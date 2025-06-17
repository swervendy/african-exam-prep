const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  require('dotenv').config();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
}

module.exports = nextConfig;