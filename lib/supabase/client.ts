// 文件路径: lib/supabase/client.ts (完整代码)

import { createBrowserClient } from '@supabase/ssr'

// 这个函数将在客户端组件中使用 (比如登录页面、提交表单)
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}