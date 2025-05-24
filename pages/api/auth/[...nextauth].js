// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseAdmin } from '../../../lib/supabaseClient'; // Doğru yolu kontrol edin
import bcrypt from 'bcryptjs';

// authOptions nesnesini dışa aktarmak, başka yerlerde (örneğin getSession için)
// aynı yapılandırmayı kullanmak isterseniz faydalı olabilir, ancak zorunlu değil.
export const authOptions = {
  session: {
    strategy: 'jwt',
    // maxAge: 30 * 24 * 60 * 60, // 30 gün (opsiyonel)
    // updateAge: 24 * 60 * 60, // 24 saatte bir güncelle (opsiyonel)
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials, req) {
        const adminSupabase = supabaseAdmin();
        // console.log("AUTHORIZE FONKSİYONU ÇAĞRILDI (Admin Client ile)"); // Bu logu zaten görmüştük

        if (!credentials?.email || !credentials?.password) {
          // console.log("E-posta veya şifre eksik.");
          return null;
        }

        const { email, password: inputPassword } = credentials;
        // console.log(`Giriş denemesi için e-posta: ${email}`);

        const { data: user, error } = await adminSupabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Supabase kullanıcı sorgulama hatası (Admin Client):", error);
          throw new Error("Giriş sırasında bir iç sunucu hatası oluştu.");
        }
        if (!user) {
          // console.log(`Kullanıcı bulunamadı (Admin Client ile): ${email}`);
          return null;
        }

        // console.log(`Veritabanından bulunan kullanıcı (Admin Client ile):`, user);
        // console.log(`Giriş için girilen şifre (inputPassword): "${inputPassword}"`);
        // console.log(`Veritabanındaki hash'lenmiş şifre (user.hashed_password): "${user.hashed_password}"`);

        const isPasswordValid = await bcrypt.compare(inputPassword, user.hashed_password);
        // console.log(`bcrypt.compare sonucu (isPasswordValid): ${isPasswordValid}`);

        if (!isPasswordValid) {
          // console.log(`Geçersiz şifre denemesi (bcrypt.compare false döndü - Admin Client ile): ${email}`);
          return null;
        }

        // console.log(`Kullanıcı başarıyla doğrulandı (Admin Client ile): ${email}`);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          credits: user.credits,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.credits = user.credits;
      }
      // console.log("[NextAuth] JWT Callback, Token:", token); // JWT oluşturulduğunda/güncellendiğinde logla
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.credits = token.credits;
      }
      // console.log("[NextAuth] Session Callback, Session:", session); // Session oluşturulduğunda/güncellendiğinde logla
      return session;
    },
  },
  pages: {
    signIn: '/', // Giriş için ana sayfayı kullanıyoruz (modal ile)
    // error: '/auth/hata', // Hata sayfanız varsa
  },
  // secret alanı doğrudan NextAuth fonksiyonuna da verilebilir, ancak process.env üzerinden okunması standarttır.
  // Eğer process.env.NEXTAUTH_SECRET'ın doğru yüklendiğinden şüpheniz varsa,
  // burada doğrudan string olarak (sadece test için, canlıda asla!) deneyebilirsiniz,
  // ama en iyisi .env.local'in doğru çalıştığından emin olmaktır.
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // Geliştirme ortamında debug loglarını etkinleştir
  events: {
    async signIn(message) { console.log("[NextAuth Event] signIn:", message); },
    async signOut(message) { console.log("[NextAuth Event] signOut:", message); },
    // async createUser(message) { console.log("[NextAuth Event] createUser:", message); }, // Genellikle provider'lar için
    // async updateUser(message) { console.log("[NextAuth Event] updateUser:", message); },
    // async linkAccount(message) { console.log("[NextAuth Event] linkAccount:", message); },
    async session(message) { console.log("[NextAuth Event] session (aktif oturum güncellendi/alındı):", message); },
    async error(message) {
      console.error("[NextAuth Event] ERROR:", message); // ÖNEMLİ: Hataları burada yakalamaya çalışalım
    }
  }
};

// NextAuth fonksiyonunu authOptions ile çağır
export default NextAuth(authOptions);
