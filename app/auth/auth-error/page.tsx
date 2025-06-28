import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">认证失败</h1>
      <p className="mt-4 text-gray-700">
        链接可能已过期或无效。请尝试重新登录。
      </p>
      <Link href="/login" className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
        返回登录页面
      </Link>
    </div>
  );
}