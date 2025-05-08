/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'api.dicebear.com',
            pathname: '/7.x/**',
        }, ],
        dangerouslyAllowSVG: true,
    },
};

module.exports = nextConfig;