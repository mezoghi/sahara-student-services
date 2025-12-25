/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'sahara-student-files.s3.amazonaws.com'],
  },
}

module.exports = nextConfig
