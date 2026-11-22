/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: {
		styledComponents: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "plus.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			}
		],
	},
};

module.exports = nextConfig;


// import type { NextConfig } from "next";
//
// const nextConfig: NextConfig = {
// 	/* config options here */
// };
//
// export default nextConfig;
