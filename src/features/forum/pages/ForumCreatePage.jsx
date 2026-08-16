import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { forumService } from '../services/forumService';
import TiptapEditor from '../components/TiptapEditor';
import { useAuth } from '../../auth/context/AuthContext';

/**
 * ForumCreatePage — tạo bài viết mới với Tiptap editor.
 * Layout Header & Footer được đảm nhận bởi ProtectedLayout.
 */
export default function ForumCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['forum']);
  const { showToast } = useAuth();
  const [editorContent, setEditorContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentError, setContentError] = useState('');

  const schema = z.object({
    title: z.string().min(1, t('forum:err_title_empty')).max(100, t('forum:err_title_max_100')),
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '' },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const titleValue = watch('title');

  const onSubmit = async ({ title }) => {
    // Validate content
    const contentStr = editorContent ? JSON.stringify(editorContent) : '';
    if (!editorContent || editorContent.content?.length === 0 ||
        (editorContent.content?.length === 1 && editorContent.content[0]?.content === undefined)) {
      setContentError(t('forum:err_content_empty'));
      return;
    }
    if (contentStr.length > 10000) {
      setContentError(t('forum:err_content_max_10000'));
      return;
    }
    setContentError('');
    setIsSubmitting(true);

    try {
      await forumService.createPost({ title, content: contentStr });
      showToast(t('forum:toast_post_submitted'), 'success');
      navigate('/forum/my-posts');
    } catch (err) {
      const msg = err.response?.data?.message ?? t('forum:toast_post_error');
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
        className="flex items-center gap-2 text-sm font-inter font-semibold text-chess-muted hover:text-chess-text mb-6 transition-colors focus:outline-none"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('forum:back_to_forum')}
      </button>

      <div className="bg-chess-surface border border-chess-border rounded-lg shadow-md p-6 md:p-8">
        <h1 className="font-playfair text-2xl font-bold text-chess-text mb-6">{t('forum:create_new_post')}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          {/* Title */}
          <div>
            <label htmlFor="post-title" className="block text-xs font-inter font-semibold text-chess-muted uppercase tracking-widest mb-2">
              {t('forum:title_label')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="post-title"
                type="text"
                maxLength={100}
                placeholder={t('forum:title_placeholder')}
                {...register('title')}
                className="w-full bg-chess-dark border border-chess-border rounded-lg px-4 py-3 text-chess-text font-inter text-sm placeholder:text-chess-muted focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-chess-gold focus:border-chess-gold transition-colors pr-16"
              />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 font-inter text-[10px] font-semibold ${
                titleValue.length > 90 ? 'text-yellow-500' : 'text-chess-muted'
              }`}>
                {titleValue.length}/100
              </span>
            </div>
            {errors.title && <p className="text-xs font-inter text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-inter font-semibold text-chess-muted uppercase tracking-widest mb-2">
              {t('forum:content_label')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <TiptapEditor onChange={setEditorContent} placeholder={t('forum:content_placeholder')} />
            </div>
            {contentError && <p className="text-xs font-inter text-red-500 mt-1">{contentError}</p>}
            <p className="text-[10px] font-inter text-chess-muted mt-1">
              {t('forum:content_helper')}
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-chess-border">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm font-inter font-semibold text-chess-muted border border-chess-border bg-transparent rounded-lg hover:text-chess-gold hover:border-chess-gold transition-colors focus:outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-chess-gold"
            >
              {t('forum:cancel')}
            </button>
            <button
              id="submit-post-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 bg-chess-gold text-chess-dark font-inter font-bold text-sm rounded-lg hover:bg-chess-gold-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-chess-gold"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? t('forum:publishing') : t('forum:publish')}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
