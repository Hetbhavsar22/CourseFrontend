import path from "path";
export default {
  sassOptions: {
    includePaths: [path.join(process.cwd(), "styles")],
  },
  reactStrictMode: false,
  images: {
    domains: ["via.placeholder.com"],
  },
};
