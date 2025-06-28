// 文件路径: app/tool/[id]/page.tsx (完整代码)

import Link from 'next/link';
import Image from 'next/image';
import { createSupabaseServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getToolDetails(id: string) {
  // --- 这是关键改动 ---
  const supabase = createSupabaseServerClient();
  // --------------------

  const { data: tool, error: toolError } = await supabase
    .from('tools')
    .select('*')
    .eq('id', id)
    .single();

  if (toolError) {
    console.error(`[Tool Detail] 查询 tool (ID: ${id}) 出错:`, toolError.message);
    return null;
  }
  
  const { data: useCases, error: useCasesError } = await supabase
    .from('use_cases')
    .select('*')
    .eq('tool_id', id)
    .order('upvotes', { ascending: false });

  if (useCasesError) {
    console.error(`[Tool Detail] 查询 use_cases (tool_id: ${id}) 出错:`, useCasesError.message);
  }

  return { tool, useCases: useCases || [] };
}

export default async function ToolDetailPage({ params }: { params: { id:string } }) {
  const details = await getToolDetails(params.id);

  if (!details || !details.tool) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">哎呀！工具不存在</h1>
        <p className="mt-2">尝试查询的ID为: {params.id}</p>
        <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
          返回首页
        </Link>
      </div>
    );
  }

  const { tool, useCases } = details;

  return (
    <main className="container mx-auto p-4 sm:p-8">
      <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">
        ← 返回列表
      </Link>
      
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {tool.logo_url && <Image src={tool.logo_url.trim()} alt={`${tool.name} logo`} width={80} height={80} className="object-contain" />}
          </div>
          <div className="flex-grow">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900">{tool.name}</h1>
            <p className="mt-1 text-lg md:text-xl text-gray-500">{tool.tagline}</p>
          </div>
          <a href={tool.website_url || '#'} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto text-center">
            访问官网
          </a>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-800">详细介绍</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">{tool.description}</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">🚀 用例宇宙</h2>
        {useCases.length > 0 ? (
          <div className="space-y-6">
            {useCases.map((useCase) => (
              <div key={useCase.id} className="bg-white shadow-sm rounded-lg p-6 border">
                <h3 className="text-xl font-semibold text-indigo-700">{useCase.title}</h3>
                {useCase.notes && <p className="mt-2 text-gray-600">{useCase.notes}</p>}
                {useCase.prompt && (
                  <div className="mt-4 p-4 bg-gray-900 text-white rounded-md">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{useCase.prompt}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-6 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">还没有人分享这个工具的用例。</p>
            <p className="mt-2 text-gray-500">成为第一个分享者吧！</p>
          </div>
        )}
      </div>
    </main>
  );
}