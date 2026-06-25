/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
    unoptimized: true
  },
}

module.exports = nextConfig