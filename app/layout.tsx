import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 导入我们创建的组件
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer"; 

// 设置默认字体
const inter = Inter({ subsets: ["latin"] });

// 设置网站的元数据（标题、描述等，对 SEO 很重要）
export const metadata: Metadata = {
  title: "AI Flow Hub", // 你的网站标题
  description: "你的下一代 AI 工作流解决方案中心", // 你的网站描述
};

// 这是根布局组件，会包裹住所有的页面
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 
        给 body 添加了三个关键的 Tailwind CSS 类：
        - flex:      启用 Flexbox 布局
        - flex-col:  让子元素垂直排列
        - min-h-screen: 确保 body 至少有屏幕那么高
      */}
      <body className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}>
        
        {/* 导航栏，始终在页面顶部 */}
        <Navbar />

        {/* 
          主要内容区域。
          - flex-grow: 这个类让 main 区域自动伸展，填满 Navbar 和 Footer 之间的所有可用空间
        */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* 页脚，始终在页面底部 */}
        <Footer />

      </body>
    </html>
  );
}