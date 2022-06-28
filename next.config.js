/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ui-avatars.com'],
  },
  i18n: {
    locales: ['ru-RU', 'en-US'],
    defaultLocale: 'ru-RU',
  },
};

module.exports = nextConfig;
