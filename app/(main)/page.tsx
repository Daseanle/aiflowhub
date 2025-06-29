// 路径: app/(main)/page.tsx (最终、最美观、功能最完整的代码)

import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

// 明确定义页面接收的 Props 类型
type HomePageProps = {
  searchParams: {
    category?: string;
  };
};

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = createClient();
  const selectedCategory = searchParams.category;

  // 1. 并行查询所有分类和工具
  const categoriesPromise = supabase.from('categories').select('*').order('name');
  
  // 2. 构建工具查询
  //    我们使用了 Supabase 强大的关联查询！
  //    '*, categories!inner(*)' 的意思是：查询 tools 表的所有字段，
  //    同时把关联的 categories 表的所有字段也一并查出来。
  //    !inner 确保只返回有关联分类的工具。
  let toolsQuery = supabase.from('tools').select('*, categories!inner(*)').order('created_at', { ascending: false });

  // 3. 如果有选中的分类，就添加筛选条件
  if (selectedCategory) {
    const { data: category } = await supabase.from('categories').select('id').eq('slug', selectedCategory).single();
    if (category) {
      // 通过联结表进行筛选
      const { data: tool_ids_data } = await supabase.from('tool_categories').select('tool_id').eq('category_id', category.id);
      const tool_ids = tool_ids_data?.map(row => row.tool_id) || [];
      
      if (tool_ids.length > 0) {
        toolsQuery = toolsQuery.in('id', tool_ids);
      } else {
        // 如果该分类下没有工具，我们将强制查询一个不存在的ID，从而返回空数组
        toolsQuery = toolsQuery.eq('id', -1); 
      }
    }
  }

  // 4. 执行查询
  const [
    { data: categories, error: categoriesError },
    { data: tools, error: toolsError }
  ] = await Promise.all([categoriesPromise, toolsQuery]);

  if (categoriesError || toolsError) {
    // 检查并打印具体的错误信息，方便调试
    if (categoriesError) console.error("Error fetching categories:", categoriesError);
    if (toolsError) console.error("Error fetching tools:", toolsError);
    return <p className="p-8 text-center text-red-500">获取数据失败。</p>;
  }

  // --- 直接在这里渲染 UI，不再需要额外的 PageContent 组件 ---
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

      {/* 分类筛选器 */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
        <Link 
          href="/" 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedCategory ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
        >
          全部
        </Link>
        {categories?.map((category) => (
          <Link 
            key={category.id} 
            href={`/?category=${category.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.slug ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* 网格布局的工具列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools && tools.length > 0 ? (
          tools.map((tool: any) => ( // 使用 any 来简化类型
            <Link key={tool.id} href={`/tool/${tool.id}`} className="group block h-full">
              <div className="border rounded-xl p-5 h-full flex flex-col bg-white shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4 overflow-hidden flex-shrink-0">
                    {tool.logo_url && <Image src={tool.logo_url.trim()} alt={`${tool.name} logo`} width={48} height={48} className="object-contain" />}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{tool.name}</h2>
                </div>
                <div className="flex-grow">
                  <p className="text-gray-600 text-sm line-clamp-2">{tool.tagline}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                  {tool.categories?.slice(0, 2).map((cat: any) => (
                    <span key={cat.id} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700">空空如也</h3>
            <p className="mt-2 text-gray-500">该分类下还没有任何工具，换个分类试试吧！</p>
          </div>
        )}
      </div>
    </main>
  );
}
