// 文件路径: app/auth/callback/route.ts (完整代码)
import { createClient } from '@/lib/supabase/server'; // 修改了导入的函数名
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient(); // 修改了函数调用
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 重定向回首页
  return NextResponse.redirect(requestUrl.origin);
}