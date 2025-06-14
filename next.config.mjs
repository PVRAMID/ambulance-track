/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.ko-fi.com',
                port: '',
                pathname: '/cdn/useruploads/**',
            },
        ],
    },
};

export default nextConfig;