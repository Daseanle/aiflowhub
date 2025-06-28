// 文件路径: app/tool/[id]/page.tsx (完整代码)

import Link from 'next/link';
import Image from 'next/image';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import UseCaseForm from '@/app/components/UseCaseForm';

export const dynamic = 'force-dynamic';

async function getToolDetails(id: string) {
  if (!id || isNaN(parseInt(id, 10))) {
    return null;
  }
  
  const supabase = createSupabaseServerClient();
  
  const toolPromise = supabase.from('tools').select('*').eq('id', id).single();
  const useCasesPromise = supabase.from('use_cases').select('*').eq('tool_id', id).order('upvotes', { ascending: false });
  const userPromise = supabase.auth.getUser();

  const [
    { data: tool, error: toolError },
    { data: useCases, error: useCasesError },
    { data: { user } }
  ] = await Promise.all([toolPromise, useCasesPromise, userPromise]);

  if (toolError) return null;

  return { tool, useCases: useCases || [], user };
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

  const { tool, useCases, user } = details;

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
        {user ? (
          <UseCaseForm tool_id={tool.id} user_id={user.id} />
        ) : (
          <div className="text-center py-8 px-6 bg-white rounded-lg shadow-sm border">
            <p className="text-gray-600">想分享你的独家用例或 Prompt 吗？</p>
            <Link href="/login" className="mt-4 inline-block bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700">
              登录后即可分享
            </Link>
          </div>
        )}
        
        <div className="mt-10 space-y-6">
          {useCases.length > 0 ? (
            useCases.map((useCase) => (
              <div key={useCase.id} className="bg-white shadow-sm rounded-lg p-6 border">
                <h3 className="text-xl font-semibold text-indigo-700">{useCase.title}</h3>
                {useCase.notes && <p className="mt-2 text-gray-600">{useCase.notes}</p>}
                {useCase.prompt && (
                  <div className="mt-4 p-4 bg-gray-900 text-white rounded-md">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{useCase.prompt}</pre>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">还没有人分享这个工具的用例。</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}