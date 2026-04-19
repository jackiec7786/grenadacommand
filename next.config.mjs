/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent the page from being embedded in an iframe (clickjacking)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Stop browsers from sniffing the MIME type
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Only send referrer for same-origin requests
          { key: 'Referrer-Policy', value: 'same-origin' },
          // Enforce HTTPS for 1 year once the user has visited over HTTPS
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Disable browser features not needed by this app
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
