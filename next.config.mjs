// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.sanity.io"],
  },
  i18n: {
    // Add as many locales as you want:
    locales: ["en-US", "en-GB", "de", "fr", "it"],
    defaultLocale: "en-US",
  },
};

export default nextConfig;
