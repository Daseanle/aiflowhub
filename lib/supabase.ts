// 注意：这个文件现在不直接导出了，而是作为创建不同客户端的工具
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// 这个函数将在服务端组件中使用
export const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient({
    cookies: () => cookieStore,
  });
};

// 我们保留一个简单的 createClient，但通常会用上面那个
// import { createClient } from '@supabase/supabase-js';
// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!, 
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );