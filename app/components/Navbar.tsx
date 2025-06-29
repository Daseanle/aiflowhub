// 文件路径: app/components/Navbar.tsx (完整代码)
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server'; // 修改了导入的函数名
import { cookies } from 'next/headers'; // 需要导入 cookies 来创建客户端
import { redirect } from 'next/navigation';

export default async function Navbar() {
  const supabase = createClient(); // 修改了函数调用
  const { data: { user } } = await supabase.auth.getUser();

  const signOut = async () => {
    'use server';
    const supabase = createClient(); // 修改了函数调用
    await supabase.auth.signOut();
    return redirect('/'); // 退出后重定向到首页
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:p-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              AI Flow Hub
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                工具
              </Link>
              <Link href="/flows" className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                工作流
              </Link>
            </div>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
                <form action={signOut}>
                  <button type="submit" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300">
                    退出
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                登录 / 注册
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}