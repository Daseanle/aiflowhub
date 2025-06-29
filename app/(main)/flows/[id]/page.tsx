// 路径: app/(main)/flows/[id]/page.tsx (完整代码)

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server'; // 关键改动
import { notFound } from 'next/navigation';

type PageProps = { params: { id: string } };
export const dynamic = 'force-dynamic';

type EnrichedStep = { 
  step: number; 
  title: string; 
  instructions: string; 
  tool: { id: number; name: string; tagline: string; } | null; 
};

export default async function FlowDetailPage({ params }: PageProps) {
  const supabase = createClient(); // 关键改动
  const id = params.id;

  const { data: workflow } = await supabase.from('workflows').select('*').eq('id', id).single();
  if (!workflow) notFound();

  const steps: any[] = workflow.steps || [];
  const toolIds = steps.map(step => step.tool_id).filter(Boolean);

  let enrichedSteps: EnrichedStep[] = [];

  if (toolIds.length > 0) {
    const { data: tools } = await supabase.from('tools').select('id, name, tagline').in('id', toolIds);
    enrichedSteps = steps.map(step => {
      const foundTool = tools?.find((t: any) => t.id === step.tool_id) || null;
      return { ...step, tool: foundTool };
    });
  } else {
    enrichedSteps = steps.map(step => ({ ...step, tool: null }));
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-12">
        <Link href="/flows" className="text-indigo-600 hover:underline">← 返回工作流列表</Link>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900">{workflow.title}</h1>
        <p className="mt-3 text-lg text-gray-600 max-w-3xl">{workflow.description}</p>
      </div>
      <div className="space-y-12">
        {enrichedSteps.map((step, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold">
                {step.step}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex-grow">
              <h2 className="text-2xl font-bold text-gray-800">{step.title}</h2>
              <p className="mt-3 text-base text-gray-600 leading-relaxed">{step.instructions}</p>
              {step.tool && (
                <div className="mt-5 border-t pt-4">
                  <span className="text-sm font-semibold text-gray-500">推荐工具</span>
                  <Link href={`/tool/${step.tool.id}`} className="block mt-1">
                    <div className="p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                      <p className="font-bold text-indigo-700">{step.tool.name}</p>
                      <p className="text-sm text-gray-500">{step.tool.tagline}</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}