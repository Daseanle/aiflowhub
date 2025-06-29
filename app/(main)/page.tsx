// 路径: app/(main)/page.tsx (带分类筛选功能的最终完整代码)

import Link from 'next/link';
import Image from 'next/image';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// 明确定义页面接收的 Props 类型，包含可选的 category
type HomePageProps = {
  searchParams: {
    category?: string;

      .filter(Boolean) as { id: number; name: string }[];
    
    return { ...tool, categories: relevantCategories };
  });

  // 3. 根据 URL 参数进行筛选
  const filteredTools = selectedCategorySlug
    ? toolsWithCategories.filter(tool => 
        tool.categories.some(cat => 
          (categories || []).find(c => c.id === cat.id)?.slug === selectedCategorySlug
        )
      )
    : toolsWithCategories;

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center my-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
          AI Flow Hub
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray  };
};

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = createSupabaseServerClient();
  const selectedCategory = searchParams.category;

  // 1. 并行查询所有分类和工具
  const categoriesPromise = supabase.from('categories').select('*').order('name');
  
  // 2. 构建工具查询
  //    我们使用了 Supabase 强大的关联查询！
  //    '*, categories(*)' 的意思是：查询 tools 表的所有字段，
  //    同时把关联的 categories 表的所有字段也一并查出来。
  let toolsQuery = supabase.from('tools').select('*, categories(*)').order('created_at', { ascending: false });

-500">
          你的下一代 AI 工作流解决方案中心
        </p>
      </div>

      {/* 分类筛选器 */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <Link href="/" className={`px-4 py-2 rounded-full text-sm font-medium ${!selectedCategorySlug ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          全部
        </Link>
        {categories?.map((category: Category) => (
          <Link 
            key={category.id} 
            href={`/?category=${category.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategorySlug === category.slug ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300  // 3. 如果有选中的分类，就添加筛选条件
  if (selectedCategory) {
    // 'tool_categories!inner(category_id.eq.2)' 这种是 Supabase 的高级用法
    // 但更简单的方式是先查询分类ID，再用它来筛选
    // 为了简单清晰，我们这里采用两步查询法
    const { data: category } = await supabase.from('categories').select('id').eq('slug', selectedCategory).single();
    if (category) {
      // 通过联结表进行筛选
      toolsQuery = toolsQuery.in('id', 
        (await supabase.from('tool_categories').select('tool_id').eq('category_id', category.id)).data?.map(row'}`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* 工具列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <Link key={tool.id} href={`/tool/${tool.id}`} className="group block">
              <div className="border rounded-xl p-5 h-full flex flex-col shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                    {tool.logo_url && <Image src={tool.logo_url.trim()} alt={`${tool.name} logo`} width={48} height={ => row.tool_id) || []
      );
    }
  }

  // 4. 执行查询
  const [
    { data: categories, error: categoriesError },
    { data: tools, error: toolsError }
  ] = await Promise.all([categoriesPromise, toolsQuery]);

  if (categoriesError || toolsError) {
    return <p className="p-8 text-center text-red-500">获取数据失败。</p>;
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

      {/* 分48} className="object-contain" />}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{tool.name}</h2>
                </div>
                <div className="flex-grow">
                  <p className="text-gray-600">{tool.tagline}</p>
                </div>
                {/* 在卡片底部显示分类标签 */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {tool.categories.slice(0, 2).map(cat => (
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
类筛选器 */}
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
      </div>
    </main>
  );
}