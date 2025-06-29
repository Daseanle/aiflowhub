// 文件路径: lib/supabase/server.ts (已修复所有花括号)

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

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
            // 在 Server Action 或 Route Handler 中调用 set 可能会报错
          }
        }, // <--- 之前这里可能缺少了逗号和括号
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // 在 Server Action 或 Route Handler 中调用 delete 可能会报错
          }
        }, // <--- 之前这里可能缺少了逗号和括号
      },
    }
  )
}