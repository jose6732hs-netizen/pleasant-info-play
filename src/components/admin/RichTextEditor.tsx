import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight, 
  Link as LinkIcon, List, ListOrdered,
  Undo, Redo, Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  type?: 'title' | 'body' | 'button';
}

export function RichTextEditor({ value, onChange, label, type = 'body' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const MenuBar = () => {
    return (
      <div className="flex flex-wrap gap-1 p-2 bg-zinc-900 border-b border-white/10 sticky top-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-white/10' : ''}
          title="Negrito"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-white/10' : ''}
          title="Itálico"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'bg-white/10' : ''}
          title="Sublinhado"
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-8 mx-1 bg-white/10" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-white/10' : ''}
          title="Alinhar à Esquerda"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-white/10' : ''}
          title="Centralizar"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-white/10' : ''}
          title="Alinhar à Direita"
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-8 mx-1 bg-white/10" />

        {type === 'title' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? 'bg-white/10' : ''}
              title="H1"
            >
              H1
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? 'bg-white/10' : ''}
              title="H2"
            >
              H2
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = window.prompt('URL do Link');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            } else if (url === '') {
              editor.chain().focus().unsetLink().run();
            }
          }}
          className={editor.isActive('link') ? 'bg-white/10' : ''}
          title="Link"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-8 mx-1 bg-white/10" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          title="Desfazer"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          title="Refazer"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest block">
          {label}
        </label>
      )}
      <div className="border border-white/10 rounded-lg overflow-hidden bg-black/50 focus-within:border-white/20 transition-colors">
        <MenuBar />
        <EditorContent 
          editor={editor} 
          className="prose prose-invert max-w-none p-4 min-h-[100px] outline-none text-zinc-200"
        />
      </div>
    </div>
  );
}
