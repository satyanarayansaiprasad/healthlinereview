'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Plus, Upload, Save, Loader2, ArrowLeft,
    Trash2, Edit2, CheckCircle, AlertCircle, X,
    Star, Image as ImageIcon, ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Category {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    isStarred: boolean;
}

export default function ReviewCategoriesAdmin() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Form states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isStarred, setIsStarred] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/review-categories');
            const data = await res.json();
            if (Array.isArray(data)) {
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'categories');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setImageUrl(data.url);
                setStatus({ type: 'success', message: 'Image uploaded successfully!' });
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            setStatus({ type: 'error', message: error.message || 'Image upload failed.' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleOpenForm = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setName(category.name);
            setImageUrl(category.imageUrl);
            setIsStarred(category.isStarred);
        } else {
            setEditingCategory(null);
            setName('');
            setImageUrl('');
            setIsStarred(false);
        }
        setIsFormOpen(true);
        setStatus(null);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingCategory(null);
        setName('');
        setImageUrl('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !imageUrl) {
            setStatus({ type: 'error', message: 'Name and Image are required.' });
            return;
        }

        setIsSaving(true);
        setStatus(null);

        const method = editingCategory ? 'PATCH' : 'POST';
        const body = editingCategory
            ? { id: editingCategory.id, name, imageUrl, isStarred }
            : { name, imageUrl, isStarred };

        try {
            const res = await fetch('/api/review-categories', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setStatus({ type: 'success', message: `Category ${editingCategory ? 'updated' : 'created'} successfully!` });
                fetchCategories();
                setTimeout(handleCloseForm, 1000);
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save category');
            }
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Something went wrong.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const res = await fetch(`/api/review-categories?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setCategories(categories.filter(c => c.id !== id));
                setStatus({ type: 'success', message: 'Category deleted successfully!' });
            } else {
                throw new Error('Failed to delete category');
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Could not delete category.' });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Review Categories</h1>
                        <p className="text-gray-500">Manage categories for product reviews</p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Create New Category
                </button>
            </div>

            {status && !isFormOpen && (
                <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold text-sm">{status.message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                        <ImageIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No categories found</p>
                    </div>
                ) : (
                    categories.map((cat) => (
                        <div key={cat.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden group hover:border-blue-100 transition-all hover:shadow-2xl hover:shadow-blue-900/5">
                            <div className="aspect-video relative overflow-hidden bg-gray-50">
                                {cat.imageUrl ? (
                                    <Image
                                        src={cat.imageUrl}
                                        alt={cat.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                                        <ImageIcon className="w-10 h-10" />
                                    </div>
                                )}
                                {cat.isStarred && (
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/50 shadow-sm">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Featured</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-8 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 leading-tight">{cat.name}</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">/{cat.slug}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenForm(cat)}
                                            className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-in-top">
                        <div className="p-8 md:p-12 space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                                    {editingCategory ? 'Update' : 'Create'} Category
                                </h2>
                                <button onClick={handleCloseForm} className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {status && (
                                <div className={`p-4 rounded-2xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <p className="font-bold text-sm">{status.message}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Category Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-8 py-5 bg-gray-50 border border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                                            placeholder="e.g., Weight Loss"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Visual Asset</label>
                                        <div
                                            className={`relative aspect-video rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-gray-50 ${imageUrl ? 'border-blue-100' : 'border-gray-100 hover:border-blue-200'}`}
                                        >
                                            {imageUrl ? (
                                                <>
                                                    <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold text-sm"
                                                        >
                                                            Replace Image
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={isUploading}
                                                    className="flex flex-col items-center gap-4 text-gray-400 hover:text-blue-600 transition-colors"
                                                >
                                                    {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                                                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">{isUploading ? 'Uploading...' : 'Browse Image'}</span>
                                                </button>
                                            )}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                        <button
                                            type="button"
                                            onClick={() => setIsStarred(!isStarred)}
                                            className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isStarred ? 'bg-yellow-100 text-yellow-600 scale-110 shadow-lg shadow-yellow-200' : 'bg-white text-gray-300'}`}
                                        >
                                            <Star className={`w-6 h-6 ${isStarred ? 'fill-yellow-600' : ''}`} />
                                        </button>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Feature on Home Page</p>
                                            <p className="text-[10px] font-bold text-gray-400">Categories with this enabled will appear in the "Product Review Category" section.</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving || isUploading}
                                    className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {editingCategory ? 'Update Changes' : 'Initialize Category'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
