// 文件路径: tailwind.config.ts (最终、正确的配置)

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // 告诉 Tailwind 要扫描下面这些路径里的所有文件
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // 最重要的是这一行，它会扫描整个 app 目录
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
