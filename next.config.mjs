/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // GitHub Pages için statik dışa aktarmayı etkinleştirir

   basePath: '/excel-harita',
   assetPrefix: '/excel-harita/',

};

export default nextConfig;