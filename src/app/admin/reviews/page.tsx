'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Save, X, Search, AlertCircle } from 'lucide-react';

// --- Types based on prisma schema ---
interface ProductReview {
    id: string;
    productName: string;
    slug: string;
    rating: number;
    verdict: string;
    pros: string[];
    cons: string[];
    ingredients: string[];
    brand: string;
    form: string;
    price: string;
    guarantee: string;
    sideEffects: string;
    description: string;
    targetAudience: string;
    workingMechanism: string;
    safetyInfo: string;
    warnings: string;
    detailedIngredients: any[];
    benefitsList: string[];
    customerReviews: any[];
    pricingOffers: any[];
    faqs: any[];
    finalRating?: number;
    recommendation: string;
    affiliateLink: string;
    featuredImage: string;
    content: string;
    metaTitle: string;
    metaDescription: string;
    authorId: string;
    categoryId?: string;
    medicalReviewerId?: string;
    category?: { name: string };
    author?: { name: string };
}

export default function AdminProductReviews() {
    const [reviews, setReviews] = useState<ProductReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'form'>('list');

    // Reference Data
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [experts, setExperts] = useState<{ id: string, name: string }[]>([]);

    // Form State
    const [formData, setFormData] = useState<Partial<ProductReview>>({
        productName: '', slug: '', rating: 0, verdict: '',
        pros: [], cons: [], ingredients: [], brand: '', form: '', price: '', guarantee: '', sideEffects: '',
        description: '', targetAudience: '', workingMechanism: '', safetyInfo: '', warnings: '',
        detailedIngredients: [], benefitsList: [], customerReviews: [], pricingOffers: [], faqs: [],
        recommendation: '', affiliateLink: '', featuredImage: '', content: '',
        metaTitle: '', metaDescription: '', authorId: '', categoryId: '', medicalReviewerId: ''
    });

    // Helper states for simple string array inputs
    const [newPro, setNewPro] = useState('');
    const [newCon, setNewCon] = useState('');
    const [newIngredient, setNewIngredient] = useState('');
    const [newBenefit, setNewBenefit] = useState('');

    useEffect(() => {
        fetchReviews();
        fetchReferences();
    }, []);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/product-reviews');
            const data = await res.json();
            setReviews(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReferences = async () => {
        try {
            const [catRes, expRes] = await Promise.all([
                fetch('/api/review-categories'),
                fetch('/api/experts')
            ]);
            setCategories(await catRes.json());
            setExperts(await expRes.json());
        } catch (error) {
            console.error('Failed to fetch references', error);
        }
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const productName = e.target.value;
        setFormData(prev => ({ ...prev, productName, slug: prev.id ? prev.slug : generateSlug(productName) }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            const method = formData.id ? 'PATCH' : 'POST';
            const res = await fetch('/api/product-reviews', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save');
            }

            await fetchReviews();
            setView('list');
            resetForm();
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        
        try {
            const res = await fetch(`/api/product-reviews?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchReviews();
        } catch (error) {
            console.error('Error deleting', error);
        }
    };

    const editReview = async (review: ProductReview) => {
        try {
            const res = await fetch(`/api/product-reviews?slug=${review.slug}`);
            const fullData = await res.json();
            // Ensure arrays aren't null from DB
            setFormData({
                ...fullData,
                pros: fullData.pros || [],
                cons: fullData.cons || [],
                ingredients: fullData.ingredients || [],
                benefitsList: fullData.benefitsList || [],
                detailedIngredients: fullData.detailedIngredients || [],
                pricingOffers: fullData.pricingOffers || [],
                faqs: fullData.faqs || []
            });
            setView('form');
        } catch (e) {
            console.error(e);
        }
    };

    const resetForm = () => {
        setFormData({
            productName: '', slug: '', rating: 0, verdict: '',
            pros: [], cons: [], ingredients: [], brand: '', form: '', price: '', guarantee: '', sideEffects: '',
            description: '', targetAudience: '', workingMechanism: '', safetyInfo: '', warnings: '',
            detailedIngredients: [], benefitsList: [], customerReviews: [], pricingOffers: [], faqs: [],
            recommendation: '', affiliateLink: '', featuredImage: '', content: '',
            metaTitle: '', metaDescription: '', authorId: '', categoryId: '', medicalReviewerId: ''
        });
    };

    // --- Array Handlers ---
    const addStringToArray = (field: 'pros' | 'cons' | 'ingredients' | 'benefitsList', value: string, setValue: (v: string) => void) => {
        if (value.trim()) {
            setFormData(prev => ({ ...prev, [field]: [...(prev[field] as string[] || []), value.trim()] }));
            setValue('');
        }
    };

    const removeStringFromArray = (field: 'pros' | 'cons' | 'ingredients' | 'benefitsList', index: number) => {
        const newArr = [...(formData[field] as string[] || [])];
        newArr.splice(index, 1);
        setFormData(prev => ({ ...prev, [field]: newArr }));
    };

    const filteredReviews = reviews.filter(r => r.productName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (view === 'form') {
        return (
            <div className="max-w-6xl mx-auto space-y-6 pb-24">
                <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200 sticky top-4 z-50 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => { setView('list'); resetForm(); }} className="text-gray-500 hover:text-gray-900">
                            <X className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{formData.id ? 'Edit Review' : 'Create New Review'}</h1>
                            <p className="text-sm text-gray-500">Consumer Health Digest Deep Dive</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
                        Save Review
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="col-span-2 space-y-8">
                        
                        {/* 1. Header Section */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6">
                            <h2 className="text-xl font-bold border-b pb-4">Header Section</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Name (H1)</label>
                                    <input type="text" value={formData.productName} onChange={handleNameChange} className="w-full p-3 border rounded-lg" required/>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">URL Slug</label>
                                    <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50" required/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Rating (Out of 5)</label>
                                    <input type="number" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} className="w-full p-3 border rounded-lg"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Affiliate Link / CTA</label>
                                    <input type="url" value={formData.affiliateLink || ''} onChange={e => setFormData({...formData, affiliateLink: e.target.value})} className="w-full p-3 border rounded-lg"/>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Short Verdict</label>
                                    <input type="text" value={formData.verdict || ''} onChange={e => setFormData({...formData, verdict: e.target.value})} className="w-full p-3 border rounded-lg"/>
                                </div>
                            </div>
                        </div>

                        {/* 2. Product Overview Box */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6">
                            <h2 className="text-xl font-bold border-b pb-4">Product Overview (Quick Facts)</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-700 mb-1">Brand</label><input type="text" value={formData.brand || ''} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full p-2 border rounded-md"/></div>
                                <div><label className="block text-xs font-bold text-gray-700 mb-1">Form (e.g. Capsule)</label><input type="text" value={formData.form || ''} onChange={e => setFormData({...formData, form: e.target.value})} className="w-full p-2 border rounded-md"/></div>
                                <div><label className="block text-xs font-bold text-gray-700 mb-1">Price</label><input type="text" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded-md"/></div>
                                <div><label className="block text-xs font-bold text-gray-700 mb-1">Guarantee</label><input type="text" value={formData.guarantee || ''} onChange={e => setFormData({...formData, guarantee: e.target.value})} className="w-full p-2 border rounded-md"/></div>
                                <div className="col-span-2"><label className="block text-xs font-bold text-gray-700 mb-1">Side Effects</label><input type="text" value={formData.sideEffects || ''} onChange={e => setFormData({...formData, sideEffects: e.target.value})} className="w-full p-2 border rounded-md"/></div>
                            </div>
                        </div>

                        {/* 3. Deep Dive Content */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6">
                            <h2 className="text-xl font-bold border-b pb-4">Deep Dive Details</h2>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">What is the Product? (Description)</label>
                                <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border rounded-lg h-24"/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">How Does It Work? (Mechanism)</label>
                                <textarea value={formData.workingMechanism || ''} onChange={e => setFormData({...formData, workingMechanism: e.target.value})} className="w-full p-3 border rounded-lg h-24"/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Safety Info & Warnings</label>
                                <textarea value={formData.safetyInfo || ''} onChange={e => setFormData({...formData, safetyInfo: e.target.value})} className="w-full p-3 border rounded-lg h-24"/>
                            </div>
                        </div>

                        {/* Pros and Cons */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200">
                            <h2 className="text-xl font-bold border-b pb-4 mb-6">Pros & Cons</h2>
                            <div className="grid grid-cols-2 gap-8">
                                {/* Pros */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Pros</label>
                                    <div className="flex gap-2 mb-4">
                                        <input type="text" value={newPro} onChange={e => setNewPro(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addStringToArray('pros', newPro, setNewPro))} className="flex-1 p-2 border rounded-md text-sm"/>
                                        <button type="button" onClick={() => addStringToArray('pros', newPro, setNewPro)} className="bg-blue-50 text-blue-600 px-3 py-2 rounded-md"><Plus className="w-4 h-4"/></button>
                                    </div>
                                    <ul className="space-y-2">
                                        {formData.pros?.map((pro, i) => (
                                            <li key={i} className="flex items-center justify-between bg-green-50 text-green-800 p-2 rounded-md text-sm">
                                                <span>+ {pro}</span>
                                                <button type="button" onClick={() => removeStringFromArray('pros', i)}><X className="w-4 h-4 hover:text-red-500"/></button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Cons */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Cons</label>
                                    <div className="flex gap-2 mb-4">
                                        <input type="text" value={newCon} onChange={e => setNewCon(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addStringToArray('cons', newCon, setNewCon))} className="flex-1 p-2 border rounded-md text-sm"/>
                                        <button type="button" onClick={() => addStringToArray('cons', newCon, setNewCon)} className="bg-blue-50 text-blue-600 px-3 py-2 rounded-md"><Plus className="w-4 h-4"/></button>
                                    </div>
                                    <ul className="space-y-2">
                                        {formData.cons?.map((con, i) => (
                                            <li key={i} className="flex items-center justify-between bg-red-50 text-red-800 p-2 rounded-md text-sm">
                                                <span>- {con}</span>
                                                <button type="button" onClick={() => removeStringFromArray('cons', i)}><X className="w-4 h-4 hover:text-red-500"/></button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Final Verdict */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6">
                            <h2 className="text-xl font-bold border-b pb-4">Final Verdict</h2>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Final Rating</label>
                                <input type="number" step="0.1" value={formData.finalRating || ''} onChange={e => setFormData({...formData, finalRating: parseFloat(e.target.value)})} className="w-1/3 p-3 border rounded-lg"/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Recommendation</label>
                                <textarea value={formData.recommendation || ''} onChange={e => setFormData({...formData, recommendation: e.target.value})} className="w-full p-3 border rounded-lg h-32"/>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">
                        {/* Meta & SEO */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                            <h3 className="font-bold border-b pb-2">SEO & Metadata</h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Meta Title</label>
                                <input type="text" value={formData.metaTitle || ''} onChange={e => setFormData({...formData, metaTitle: e.target.value})} className="w-full p-2 border rounded-md text-sm"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Meta Description</label>
                                <textarea value={formData.metaDescription || ''} onChange={e => setFormData({...formData, metaDescription: e.target.value})} className="w-full p-2 border rounded-md text-sm h-24"/>
                            </div>
                        </div>

                        {/* Organization */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                            <h3 className="font-bold border-b pb-2">Organization</h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                                <select value={formData.categoryId || ''} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-2 border rounded-md text-sm">
                                    <option value="">Select Category...</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Medical Reviewer</label>
                                <select value={formData.medicalReviewerId || ''} onChange={e => setFormData({...formData, medicalReviewerId: e.target.value})} className="w-full p-2 border rounded-md text-sm">
                                    <option value="">Select Reviewer...</option>
                                    {experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Featured Image URL</label>
                                <input type="url" value={formData.featuredImage || ''} onChange={e => setFormData({...formData, featuredImage: e.target.value})} className="w-full p-2 border rounded-md text-sm"/>
                                {formData.featuredImage && (
                                    <img src={formData.featuredImage} alt="Preview" className="mt-2 rounded-lg w-full h-32 object-cover border border-gray-200"/>
                                )}
                            </div>
                        </div>

                         <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                            <p className="text-sm text-yellow-800 font-medium">
                                Structured fields like "Detailed Ingredients" and "Pricing Packages" are supported by the API. Expand these in the UI as needed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // LIST VIEW
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
                    <p className="text-gray-500">Manage deep-dive single product reviews</p>
                </div>
                <button onClick={() => setView('form')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-5 h-5"/> New Review
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search product reviews..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {isLoading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600"/></div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No reviews found.</div>
                    ) : (
                        filteredReviews.map(review => (
                            <div key={review.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <h3 className="font-bold text-gray-900">{review.productName}</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-2">
                                        <span>/{review.slug}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span>★ {review.rating}</span>
                                        {review.category && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span className="text-blue-600 font-medium">{review.category.name}</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => editReview(review)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                                        <Edit className="w-5 h-5"/>
                                    </button>
                                    <button onClick={() => handleDelete(review.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                                        <Trash2 className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
