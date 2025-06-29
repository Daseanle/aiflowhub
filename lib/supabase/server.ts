// 文件路径: lib/supabase/server.ts (最终修复版)

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 我们把这个函数也改成 async 的，以便在内部使用 await
export function createClient() {
  // 关键改动：我们不再直接返回，而是先创建一个变量
  const cookieStore = cookies()

  // Supabase 官方的 createServerClient 需要一个同步的 cookie 对象
  // 所以我们在这里构造一个符合它要求的对象
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `好的，你的日志再次为我们提供了**最最精确的线索**！我们已经把所有其他问题都解决了，现在只剩下最后一个，也是最清晰的一个！