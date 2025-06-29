// 路径: app/(main)/page.tsx (完整代码)

import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server'; // 关键改动

// 明确定义页面接收的 Props 类型
type HomePageProps = {
  searchParams: {
    category?: string;
  };
};

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = createClient(); // 关键改动
  const selectedCategory = searchParams.category;

  const categoriesPromise = supabase.from('categories').select('*').order('name');
  
  let toolsQuery = supabase.from('tools').select('*, categories(*)');

  if (selectedCategory) {
    const { data: category } = await supabase.from('categories').select('id').eq('slug', selectedCategory).single();
    if (category) {
      const { data: tool_ids_data } = await supabase.from('tool_categories').select('tool_id').eq('category_id', category.id);
      const tool_ids = tool_ids_data?.map(row => row.tool_id) || [];
      if (tool_ids.length > 0) {
        toolsQuery = toolsQuery.in('id', tool_ids);
      } else {
        toolsQuery = toolsQuery.in('id', []); // 强制返回空
      }
    }
  }
  
  toolsQuery = toolsQuery.order('created_at', { ascending: false });

  const [
    { data: categories, error: categoriesError },
    { data: tools, error: toolsError }
  ] = await Promise.all([categoriesPromise, toolsQuery]);

  if (categoriesError || toolsError) {
    return <p className="p-8 text-center text-red-500">获取数据失败。</p>;
  }

  return <PageContent categories={categories || []} tools={tools || []} selectedCategory={selectedCategory} />;
}

// UI 组件部分
type Category = { id: number; name: string; slug: string; };
type Tool = { id: number; name: string; tagline: string | null; logo_url: string | null; categories: Category[] | null };

function PageContent({ categories, tools, selectedCategory }: { categories: Category[], tools: Tool[], selectedCategory?: string }) {
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

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <Link 
          href="/" 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedCategory ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          全部
        </Link>
        {categories?.map((category) => (
          <Link 
            key={category.id} 
            href={`/?category=${category.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.slug ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools && tools.length > 0 ? (
          tools.map((tool) => (
            <Link key={tool.id} href={`/tool/${tool.id}`} className="group block h-full">
              <div className="border rounded-xl p-5 h-full flex flex-col shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                    {tool.logo_url && <Image src={tool.logo_url.trim()} alt={`${tool.name} logo`} width={48} height={48} className="object-contain" />}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{tool.name}</h2>
                </div>
                <div className="flex-grow">
                  <p className="text-gray-600">{tool.tagline}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tool.categories?.slice(0, 2).map(cat => (
                    <span key={cat.id} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">该分类下还没有任何工具。</p>
          </div>
        )}
      </div>
    </main>
  );
}