/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // API Rotalarının çalışması için bu satır yorumlandı veya silindi.
                        // GitHub Pages'a statik dağıtım için gerekliydi, ancak API rotalarıyla uyumsuz.

  // Bu ayarlar, sitenizin bir alt yolda (örneğin, /excel-harita) sunulmasını sağlar.
  // Yerel geliştirme sırasında http://localhost:3000/excel-harita adresinden erişim sağlar.
  // Canlıya alırken (Vercel vb.) özel alan adı kullanmayacaksanız bu ayarlar kalabilir.
  /**basePath: '/excel-harita',*/
  /**assetPrefix: '/excel-harita/', */

  // Diğer Next.js yapılandırmalarınız buraya gelebilir.
};

export default nextConfig;