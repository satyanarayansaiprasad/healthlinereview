'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Plus, Upload, Save, Loader2, ArrowLeft,
    Trash2, Edit2, CheckCircle, AlertCircle, X,
    Star, Image as ImageIcon, ExternalLink,
    Grid, MessageSquare, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    isStarred: boolean;
}

interface ProductReview {
    id: string;
    productName: string;
    slug: string;
    rating: number;
    createdAt: string;
    category?: { name: string; slug: string };
    author: { name: string };
}

export default function ProductReviewsAdmin() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Modal / Form states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isStarred, setIsStarred] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        Promise.all([fetchCategories(), fetchReviews()]).finally(() => setIsLoading(false));
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/product-reviews');
            const data = await res.json();
            if (Array.isArray(data)) {
                setReviews(data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

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

    const handleDeleteReview = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            const res = await fetch(`/api/product-reviews?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setReviews(reviews.filter(r => r.id !== id));
                setStatus({ type: 'success', message: 'Review deleted successfully!' });
            } else {
                throw new Error('Failed to delete review');
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Could not delete review.' });
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
        <div className="max-w-6xl mx-auto pb-20 space-y-12">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Product Reviews Admin</h1>
                    <p className="text-sm text-gray-500">Manage your clinical directory and categories</p>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/admin/product-reviews/create"
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-blue-100"
                    >
                        <Plus className="w-4 h-4" /> New Review
                    </Link>
                    <button
                        onClick={() => handleOpenForm()}
                        className="bg-gray-900 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-black transition-all active:scale-95 text-xs uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4" /> Add Category
                    </button>
                </div>
            </div>

            {/* Quick Stats / Feedback */}
            {status && !isFormOpen && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold text-sm">{status.message}</p>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Categories Section */}
                <div className="lg:col-span-12 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3">
                            <Grid className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Product Review Categories</h2>
                        </div>
                        <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-md text-[9px] font-bold">{categories.length} Categories</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {categories.map((cat) => (
                            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:border-blue-100 transition-all hover:shadow-xl hover:shadow-blue-900/5">
                                <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                                    {cat.imageUrl ? (
                                        <Image
                                            src={cat.imageUrl}
                                            alt={cat.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                    )}
                                    {cat.isStarred && (
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/50 shadow-sm">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        </div>
                                    )}

                                    {/* Action Hover */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenForm(cat)}
                                            className="bg-white text-gray-900 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="bg-white text-gray-900 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tight truncate">{cat.name}</h3>
                                    <p className="text-[9px] text-gray-400 font-bold tracking-widest mt-0.5">/{cat.slug}</p>
                                </div>
                            </div>
                        ))}

                        {/* Direct Creation Card */}
                        <button
                            onClick={() => handleOpenForm()}
                            className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-4 gap-2 hover:bg-white hover:border-blue-100 transition-all group aspect-[4/3]"
                        >
                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all text-gray-300">
                                <Plus className="w-4 h-4" />
                            </div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Add New</span>
                        </button>
                    </div>
                </div>

                {/* Product Reviews Table */}
                <div className="lg:col-span-12 space-y-6 pt-10">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Active Product Reviews</h2>
                        </div>
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black">{reviews.length} Total Reviews</span>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                        {reviews.length === 0 ? (
                            <div className="p-20 text-center">
                                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">No reviews found. Click "New Review" to start.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Info</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rating</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Author</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {reviews.map((review) => (
                                            <tr key={review.id} className="hover:bg-gray-50/30 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{review.productName}</span>
                                                        <span className="text-[10px] text-gray-400 font-bold tracking-widest">/reviews/{review.slug}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                        {review.category?.name || 'Uncategorized'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-1.5 text-yellow-500">
                                                        <Star className="w-3.5 h-3.5 fill-current" />
                                                        <span className="text-sm font-black text-gray-900">{review.rating.toFixed(1)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black border border-blue-100">
                                                            {review.author.name.charAt(0)}
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700">{review.author.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => router.push(`/admin/product-reviews/edit/${review.id}`)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                            title="Edit Review"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteReview(review.id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                            title="Delete Review"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <a
                                                            href={`/reviews/${review.slug}`}
                                                            target="_blank"
                                                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-in-top">
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
                                    {editingCategory ? 'Update' : 'Create'} Category
                                </h2>
                                <button onClick={handleCloseForm} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                                    <X className="w-5 h-5" />
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
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Category Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white rounded-lg outline-none transition-all font-medium text-gray-900 text-sm"
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
                                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
