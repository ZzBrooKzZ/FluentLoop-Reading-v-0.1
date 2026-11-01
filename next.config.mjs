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
  async rewrites() {
    return [
      {
        source: '/__/auth/:path*',
        destination: 'https://project-3ba42a74-36cc-4dbd-ac7.firebaseapp.com/__/auth/:path*',
      },
      {
        source: '/__/firebase/:path*',
        destination: 'https://project-3ba42a74-36cc-4dbd-ac7.firebaseapp.com/__/firebase/:path*',
      },
    ];
  },
};

export default nextConfig;

