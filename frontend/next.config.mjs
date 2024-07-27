/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    },
    images: {
        domains: ['s3.us-west-2.amazonaws.com']
    }
};

export default nextConfig;
