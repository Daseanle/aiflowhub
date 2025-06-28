// 文件路径: app/login/page.tsx (完整代码)

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('sign-in');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setView('check-email');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="container mx-auto max-w-sm p-4 mt-12">
      {view === 'check-email' ? (
        <p className="text-center text-gray-600">
          请检查你的邮箱 <strong>{email}</strong> 并点击里面的链接来完成注册。
        </p>
      ) : (
        <form onSubmit={view === 'sign-in' ? handleSignIn : handleSignUp} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-bold text-center mb-6">{view === 'sign-in' ? '登录' : '注册'}</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              邮箱
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              密码 (至少6位)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {view === 'sign-in' ? '登 录' : '注 册'}
            </button>
            <p className="text-center text-sm">
              {view === 'sign-in' ? (
                <>
                  还没有账户?{' '}
                  <button type="button" onClick={() => { setView('sign-up'); setError(null); }} className="font-bold text-blue-500 hover:text-blue-800">
                    立即注册
                  </button>
                </>
              ) : (
                <>
                  已经有账户了?{' '}
                  <button type="button" onClick={() => { setView('sign-in'); setError(null); }} className="font-bold text-blue-500 hover:text-blue-800">
                    立即登录
                  </button>
                </>
              )}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}