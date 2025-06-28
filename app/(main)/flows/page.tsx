// 路径: app/(main)/flows/page.tsx (完整代码)

import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function FlowsPage() {
  const supabase = createSupabaseServerClient();
  const { data: workflows, error } = await supabase
    .from('workflows')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <p className="p-8 text-center text-red-500">获取工作流列表失败: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center my-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">AI 工作流</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          探索由专家和社区贡献的端到端解决方案，用AI高效完成你的任务。
        </p>
      </div>

      <div className="space-y-6">
        {workflows && workflows.length > 0 ? (
          workflows.map((flow) => (
            <Link key={flow.id} href={`/flows/${flow.id}`} className="block">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-indigo-600">{flow.title}</h2>
                <p className="mt-2 text-gray-600">{flow.description}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">还没有任何工作流。</p>
          </div>
        )}
      </div>
    </div>
  );
}