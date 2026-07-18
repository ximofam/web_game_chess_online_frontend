import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Send } from 'lucide-react';
import { forumService } from '../services/forumService';
import TiptapEditor from '../components/TiptapEditor';
import { useAuth } from '../../auth/context/AuthContext';

const schema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(100, 'Tối đa 100 ký tự'),
});

/**
 * ForumCreatePage — tạo bài viết mới với Tiptap editor.
 * Layout Header & Footer được đảm nhận bởi ProtectedLayout.
 */
export default function ForumCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useAuth();
  const [editorContent, setEditorContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentError, setContentError] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '' },
  });

  const titleValue = watch('title');

  const onSubmit = async ({ title }) => {
    // Validate content
    const contentStr = editorContent ? JSON.stringify(editorContent) : '';
    if (!editorContent || editorContent.content?.length === 0 ||
        (editorContent.content?.length === 1 && editorContent.content[0]?.content === undefined)) {
      setContentError('Nội dung không được để trống');
      return;
    }
    if (contentStr.length > 10000) {
      setContentError('Nội dung quá dài (tối đa 10000 ký tự)');
      return;
    }
    setContentError('');
    setIsSubmitting(true);

    try {
      const post = await forumService.createPost({ title, content: contentStr });
      showToast('Bài viết đã được gửi và đang chờ duyệt!', 'success');
      navigate(`/forum/posts/${post.id}`);
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Không thể tạo bài viết. Thử lại sau.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full max-w-3xl mx-auto px-4 py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[#9ca3af] hover:text-[#f3f4f6] mb-6 transition-colors focus:outline-none"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại forum
      </button>

      <div className="bg-[#1a1d24] border border-[#2d323f] rounded-2xl p-6 md:p-8">
        <h1 className="font-playfair text-2xl font-bold text-[#f3f4f6] mb-6">Tạo bài viết mới</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          {/* Title */}
          <div>
            <label htmlFor="post-title" className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">
              Tiêu đề <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id="post-title"
                type="text"
                maxLength={100}
                placeholder="Tiêu đề bài viết của bạn..."
                {...register('title')}
                className="w-full bg-[#13161c] border border-[#2d323f] rounded-xl px-4 py-3 text-[#f3f4f6] text-sm placeholder:text-[#9ca3af]/60 focus:outline-none focus:border-[#d4af37]/50 transition-colors pr-16"
              />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] ${
                titleValue.length > 90 ? 'text-yellow-400' : 'text-[#9ca3af]/60'
              }`}>
                {titleValue.length}/100
              </span>
            </div>
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-2">
              Nội dung <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <TiptapEditor onChange={setEditorContent} placeholder="Chia sẻ kiến thức cờ vua của bạn..." />
            </div>
            {contentError && <p className="text-xs text-red-400 mt-1">{contentError}</p>}
            <p className="text-[10px] text-[#9ca3af]/60 mt-1">
              Hỗ trợ bold, italic, danh sách và hình ảnh. Bài viết sẽ được kiểm duyệt tự động qua AI trước khi đăng.
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2d323f]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm font-semibold text-[#9ca3af] border border-[#2d323f] rounded-xl hover:text-[#f3f4f6] hover:border-[#f3f4f6]/20 transition-colors focus:outline-none"
            >
              Huỷ
            </button>
            <button
              id="submit-post-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 bg-[#d4af37] text-[#0d0e12] font-bold text-sm rounded-xl hover:bg-[#f3cd57] hover:shadow-[0_4px_14px_rgba(212,175,55,0.3)] transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
