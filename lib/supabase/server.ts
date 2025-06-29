// 文件路径: lib/supabase/server.ts (最终、最正确的代码)

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 这个函数是同步的，它只是返回一个创建 Supabase 客户端的函数
export function createClient() {
  const cookieStore = cookies()

  // 返回一个创建好的、配置正确的 Supabase 客户端
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // cookies() 返回的对象本身就有 get, set, remove 方法，可以直接使用
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // 在 Server Action 或 Route Handler 中调用 set 可能会报错
            // 如果你有中间件刷新 session，可以安全地忽略这个错误
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // 在 Server Action 或 Route Handler 中调用 delete 可能会报错
          }
        },
      },
    }
  )
}