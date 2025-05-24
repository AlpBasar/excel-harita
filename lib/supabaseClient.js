// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// .env.local dosyasından Supabase URL ve Anon Key'i al
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase client'ını oluştur ve export et
// Eğer URL veya Key tanımsızsa hata fırlat
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL veya Anon Key ortam değişkenlerinde tanımlanmamış. Lütfen .env.local dosyanızı kontrol edin.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sunucu tarafında (API rotaları gibi) RLS'i atlayarak işlem yapmak için
// service_role key ile ayrı bir client oluşturabiliriz.
// Bu client'ı sadece kesinlikle gerekli olduğunda ve güvenli bir şekilde kullanın.
export const supabaseAdmin = () => {
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceRoleKey) {
    // Geliştirme ortamında uyarı ver, canlıda hata fırlatılabilir.
    console.warn("Supabase Service Role Key ortam değişkenlerinde tanımlanmamış. RLS'i atlayan işlemler yapılamayacak.");
    // Geliştirme kolaylığı için, service role key yoksa public client'ı döndür,
    // ancak bu, RLS'i atlamayacaktır. Canlıda bu durum farklı yönetilmeli.
    return supabase;
    // throw new Error("Supabase Service Role Key ortam değişkenlerinde tanımlanmamış.");
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      // autoRefreshToken: false, // Service role key için genellikle gereksiz
      // persistSession: false // Service role key için genellikle gereksiz
    }
  });
};
