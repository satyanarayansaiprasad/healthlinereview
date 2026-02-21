'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, List, ListOrdered, Heading2, Heading3,
    Link as LinkIcon, Image as ImageIcon, Undo, Redo, Strikethrough
} from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt('Image URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap gap-2 p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'}`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'}`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'}`}
                title="Strikethrough"
            >
                <Strikethrough className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'}`}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'}`}
                title="Heading 3"
            >
                <Heading3 className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'}`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'}`}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
            <button
                type="button"
                onClick={addLink}
                className={`p-2 rounded-lg transition-colors ${editor.isActive('link') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-600'}`}
                title="Add Link"
            >
                <LinkIcon className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={addImage}
                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                title="Add Image URL"
            >
                <ImageIcon className="w-4 h-4" />
            </button>
            <div className="flex-grow" />
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </button>
        </div>
    );
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-xl max-w-full h-auto my-4',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Write something...',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[400px] p-6 max-w-none',
            },
        },
    });

    return (
        <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
