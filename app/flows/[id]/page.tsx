// 文件路径: app/flows/[id]/page.tsx (完整代码)

import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type WorkflowStep = {
  step: number;
  title: string;
  tool_id: number;
  instructions: string;
};
type ToolInfo = {
  id: number;
  name: string;
  tagline: string;
} | null;
type EnrichedStep = WorkflowStep & {
  tool: ToolInfo;
};

async function getWorkflowDetails(id: string) {
  if (!id || isNaN(parseInt(id, 10))) {
    return null;
  }
  
  const supabase = createSupabaseServerClient();
  
  const { data: workflow, error: workflowError } = await supabase
    .from('workflows')
    .select('*')
    .eq('id', id)
    .single();

  if (workflowError || !workflow) {
    return null;
  }

  const steps: WorkflowStep[] = workflow.steps || [];
  const toolIds = steps.map(step => step.tool_id).filter(id => id != null);
  
  if (toolIds.length === 0) {
    const enrichedStepsWithoutTools: EnrichedStep[] = steps.map(step => ({ ...step, tool: null }));
    return { workflow, enrichedSteps: enrichedStepsWithoutTools };
  }

  const { data: tools } = await supabase
    .from('tools')
    .select('id, name, tagline')
    .in('id', toolIds);

  const enrichedSteps: EnrichedStep[] = steps.map(step => {
    const foundTool = tools?.find(t => t.id === step.tool_id) || null;
    return { ...step, tool: foundTool };
  });

  return { workflow, enrichedSteps };
}

export default async function FlowDetailPage({ params }: { params: { id: string } }) {
  const details = await getWorkflowDetails(params.id);

  if (!details) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold">哎呀！工作流不存在</h1>
        <p className="mt-2">尝试查询的ID为: {params.id}</p>
        <Link href="/flows" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          返回工作流列表
        </Link>
      </div>
    );
  }

  const { workflow, enrichedSteps } = details;

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