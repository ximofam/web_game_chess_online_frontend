import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { forumService } from '../services/forumService';
import {
  Bold, Italic, Strikethrough, List, ListOrdered,
  Heading2, Quote, ImagePlus, Undo, Redo,
} from 'lucide-react';

function ToolbarBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#d4af37] ${
        active
          ? 'bg-[#d4af37]/20 text-[#d4af37]'
          : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#2d323f]'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * TiptapEditor — rich text editor with image upload support.
 * Image nodes include `data-public-id` attribute for backend orphan tracking.
 *
 * @param {object} props
 * @param {Function} props.onChange  Called with editor JSON doc on each change
 * @param {string}   [props.placeholder]
 */
export default function TiptapEditor({ onChange, placeholder = 'Nội dung bài viết...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.extend({
        // Extend image to accept data-public-id attribute
        addAttributes() {
          return {
            ...this.parent?.(),
            'data-public-id': { default: null },
          };
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[220px] p-4 focus:outline-none text-[#f3f4f6] text-sm leading-relaxed',
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getJSON());
    },
  });

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;
      try {
        const { url, publicId } = await forumService.uploadImage(file);
        editor.chain().focus().setImage({ src: url, 'data-public-id': publicId }).run();
      } catch {
        // ponytail: swallow — user sees no toast here; parent form handles global errors
        console.error('Image upload failed');
      }
    };
    input.click();
  };

  if (!editor) return null;

  const btn = (action, title, Icon, isActive = false) => (
    <ToolbarBtn onClick={action} active={isActive} title={title}>
      <Icon className="w-3.5 h-3.5" />
    </ToolbarBtn>
  );

  return (
    <div className="border border-[#2d323f] rounded-xl overflow-hidden bg-[#13161c] focus-within:border-[#d4af37]/50 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-[#2d323f] bg-[#0d0e12]">
        {btn(() => editor.chain().focus().toggleBold().run(), 'Bold', Bold, editor.isActive('bold'))}
        {btn(() => editor.chain().focus().toggleItalic().run(), 'Italic', Italic, editor.isActive('italic'))}
        {btn(() => editor.chain().focus().toggleStrike().run(), 'Strikethrough', Strikethrough, editor.isActive('strike'))}
        <span className="w-px h-5 bg-[#2d323f] mx-1" />
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'Heading', Heading2, editor.isActive('heading', { level: 2 }))}
        {btn(() => editor.chain().focus().toggleBulletList().run(), 'Danh sách', List, editor.isActive('bulletList'))}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), 'Danh sách số', ListOrdered, editor.isActive('orderedList'))}
        {btn(() => editor.chain().focus().toggleBlockquote().run(), 'Trích dẫn', Quote, editor.isActive('blockquote'))}
        <span className="w-px h-5 bg-[#2d323f] mx-1" />
        <ToolbarBtn onClick={handleImageUpload} title="Thêm ảnh">
          <ImagePlus className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <span className="flex-1" />
        {btn(() => editor.chain().focus().undo().run(), 'Undo', Undo)}
        {btn(() => editor.chain().focus().redo().run(), 'Redo', Redo)}
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />

      {/* Placeholder shown when empty */}
      {editor.isEmpty && (
        <p className="absolute top-[52px] left-4 text-sm text-[#9ca3af]/60 pointer-events-none select-none">
          {placeholder}
        </p>
      )}
    </div>
  );
}
