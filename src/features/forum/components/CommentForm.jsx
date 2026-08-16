import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * CommentForm — tạo comment cấp 1 hoặc reply.
 * @param {object} props
 * @param {number} props.postId
 * @param {number} [props.parentId]   If provided, creates a reply
 * @param {Function} props.onSubmit   Called with created comment object
 * @param {Function} [props.onCancel] If provided, show cancel button
 */
export default function CommentForm({ postId, parentId, onSubmit, onCancel }) {
  const { t } = useTranslation(['forum']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = z.object({
    content: z.string().min(1, t('forum:err_empty')).max(5000, t('forum:err_max_5000')),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { content: '' },
  });

  const submit = async ({ content }) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ postId, content, commentParentId: parentId ?? null });
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-2">
      <textarea
        id={parentId ? `reply-input-${parentId}` : `comment-input-${postId}`}
        {...register('content')}
        rows={parentId ? 2 : 3}
        placeholder={parentId ? t('forum:placeholder_reply') : t('forum:placeholder_comment')}
        className="w-full bg-chess-dark border border-chess-border rounded-lg px-3 py-2 text-sm font-inter text-chess-text placeholder-chess-muted focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-chess-gold focus:border-chess-gold resize-none transition-colors"
      />
      {errors.content && (
        <p className="text-xs font-inter text-red-500">{errors.content.message}</p>
      )}
      <div className="flex items-center gap-2 self-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-inter font-semibold text-chess-muted hover:text-chess-text hover:border-chess-gold border border-chess-border bg-transparent rounded-lg transition-colors focus:outline-none"
          >
            <X className="w-3.5 h-3.5" />
            {t('forum:cancel')}
          </button>
        )}
        <button
          id={parentId ? `submit-reply-${parentId}` : `submit-comment-${postId}`}
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-inter font-bold bg-chess-gold text-chess-dark rounded-lg hover:bg-chess-gold-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none"
        >
          <Send className="w-3.5 h-3.5" />
          {isSubmitting ? t('forum:sending') : parentId ? t('forum:reply') : t('forum:comment')}
        </button>
      </div>
    </form>
  );
}
