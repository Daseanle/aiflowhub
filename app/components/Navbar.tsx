// 文件路径: app/components/Navbar.tsx (最终确认)

import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// 这是退出登录的 Server Action，它直接在这里定义和使用
async function SignOut() {
  'use server';
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  const { revalidatePath } = await import('next/cache');
  revalidatePath('/');
}

export default async function Navbar() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ... 左侧和中间的导航链接代码 ... */}
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
          
          {/* 右侧的登录/退出逻辑 */}
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
                {/* 这个 form 的 action 直接调用了上面的 SignOut 函数 */}
                <form action={SignOut}>
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