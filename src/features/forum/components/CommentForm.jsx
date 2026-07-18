import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, X } from 'lucide-react';

const schema = z.object({
  content: z.string().min(1, 'Không được để trống').max(5000, 'Tối đa 5000 ký tự'),
});

/**
 * CommentForm — tạo comment cấp 1 hoặc reply.
 * @param {object} props
 * @param {number} props.postId
 * @param {number} [props.parentId]   If provided, creates a reply
 * @param {Function} props.onSubmit   Called with created comment object
 * @param {Function} [props.onCancel] If provided, show cancel button
 */
export default function CommentForm({ postId, parentId, onSubmit, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        placeholder={parentId ? 'Viết phản hồi...' : 'Viết bình luận...'}
        className="w-full bg-[#13161c] border border-[#2d323f] rounded-lg px-3 py-2 text-sm text-[#f3f4f6] placeholder:text-[#9ca3af]/60 focus:outline-none focus:border-[#d4af37]/50 resize-none"
      />
      {errors.content && (
        <p className="text-xs text-red-400">{errors.content.message}</p>
      )}
      <div className="flex items-center gap-2 self-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#9ca3af] hover:text-[#f3f4f6] border border-[#2d323f] rounded-lg transition-colors focus:outline-none"
          >
            <X className="w-3.5 h-3.5" />
            Huỷ
          </button>
        )}
        <button
          id={parentId ? `submit-reply-${parentId}` : `submit-comment-${postId}`}
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#d4af37] text-[#0d0e12] rounded-lg hover:bg-[#f3cd57] transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none"
        >
          <Send className="w-3.5 h-3.5" />
          {isSubmitting ? 'Đang gửi...' : parentId ? 'Phản hồi' : 'Bình luận'}
        </button>
      </div>
    </form>
  );
}
