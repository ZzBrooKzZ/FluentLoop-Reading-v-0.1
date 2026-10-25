/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ['firebase-admin', '@google/genai'],
  allowedDevOrigins: [
    '**.run.app',
    '*.run.app',
    '**.google.com',
    '*.google.com',
    '**.goog',
    '*.goog',
    '**.googleusercontent.com',
    '**.web.app',
    '**.firebaseapp.com',
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
  ],
};

export default nextConfig;

