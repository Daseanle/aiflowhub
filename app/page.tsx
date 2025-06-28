// 文件路径: app/page.tsx (完整代码)

import Link from 'next/link';
import Image from 'next/image';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createSupabaseServerClient();

  const { data: tools, error } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <p className="p-8">出错了: {error.message}</p>;
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center my-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
          AI Flow Hub
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500">
          你的下一代 AI 工作流解决方案中心
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools?.map((tool) => (
          <Link key={tool.id} href={`/tool/${tool.id}`} className="group block">
            <div className="border rounded-xl p-5 h-full flex flex-col shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                  {tool.logo_url ? (
                    <Image
                      src={tool.logo_url.trim()}
                      alt={`${tool.name} logo`}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  ) : (
                    <span className="font-bold text-gray-500 text-lg">
                      {tool.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{tool.name}</h2>
              </div>
              <div className="flex-grow">
                <p className="text-gray-600">{tool.tagline}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}