'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

// 定义这个组件需要接收的参数类型
type UseCaseFormProps = {
  tool_id: number;
  user_id: string;
};

export default function UseCaseForm({ tool_id, user_id }: UseCaseFormProps) {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClientComponentClient();
  const router = useRouter(); // 用于提交后刷新页面

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase
      .from('use_cases')
      .insert({
        title,
        prompt,
        notes,
        tool_id,
        // 注意：RLS 策略会使用这个 user_id 进行验证
        // 但我们这里不直接插入 user_id，让数据库通过 RLS 自动关联
      });

    setIsSubmitting(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      // 提交成功，清空表单并刷新页面
      setTitle('');
      setPrompt('');
      setNotes('');
      router.refresh(); 
    }
  };

  return (
    <div className="mt-8 pt-8 border-t">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">分享你的用例</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">用例标题</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="例如：生成小红书爆款文案"
          />
        </div>
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Prompt / 核心指令</label>
          <textarea
            id="prompt"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono"
            placeholder="把你最好用的 Prompt 粘贴到这里..."
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">额外说明 (可选)</label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="分享一些使用这个 Prompt 的技巧或注意事项。"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {isSubmitting ? '提交中...' : '提交分享'}
          </button>
        </div>
      </form>
    </div>
  );
}