// pages/api/auth/signup.js
import { supabaseAdmin } from '../../../lib/supabaseClient'; // supabase yerine supabaseAdmin'i import et
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const adminSupabase = supabaseAdmin(); // Admin client'ı çağır

  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-posta ve şifre alanları zorunludur.' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Lütfen geçerli bir e-posta adresi girin.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Şifre en az 6 karakter uzunluğunda olmalıdır.' });
    }

    // Önce e-postanın zaten kayıtlı olup olmadığını kontrol et (admin client ile)
    const { data: existingUser, error: selectError } = await adminSupabase // adminSupabase kullan
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Kullanıcı sorgulama hatası (SUNUCU TARAFI - Admin Client):', selectError);
      throw new Error('Kullanıcı sorgulanırken bir veritabanı hatası oluştu.');
    }

    if (existingUser) {
      return res.status(409).json({ message: 'Bu e-posta adresi zaten kayıtlı.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Yeni kullanıcıyı Supabase'deki `users` tablomuza ekle (admin client ile)
    const { data: newUser, error: insertError } = await adminSupabase // adminSupabase kullan
      .from('users')
      .insert([
        {
          email: email,
          hashed_password: hashedPassword,
          name: name || null,
        },
      ])
      .select('id, email, name') // Sadece gerekli ve güvenli alanları seç
      .single();

    if (insertError) {
      console.error('Kullanıcı ekleme hatası (SUNUCU TARAFI - Admin Client):', insertError);
      throw new Error('Kullanıcı kaydedilirken bir veritabanı hatası oluştu.');
    }

    console.log('Yeni kullanıcı kaydedildi (Admin Client ile):', newUser);
    res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi.', user: newUser });

  } catch (error) {
    console.error('Kayıt API Hatası:', error);
    res.status(500).json({ message: error.message || 'Sunucu tarafında bir hata oluştu.' });
  }
}
