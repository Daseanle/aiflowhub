// 文件路径: app/auth/callback/route.ts (修正后)

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 无论成功与否，都重定向回首页
  // 登录状态的改变会由 cookie 控制，Navbar 会自动更新
  return NextResponse.redirect(requestUrl.origin);
}