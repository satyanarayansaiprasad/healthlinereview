'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Save, Image as ImageIcon, Plus, Trash2, Globe, Loader2, ListPlus,
    MessageSquare, CheckSquare, Search, Tag, Anchor, Star, Info, AlertTriangle,
    CheckCircle2, XCircle, ShoppingCart, UserCheck, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface Category {
    id: string;
    name: string;
}

interface User {
    id: string;
    name: string;
}

interface HealthExpert {
    id: string;
    name: string;
}

export default function CreateProductReview() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Basic Data
    const [productName, setProductName] = useState('');
    const [slug, setSlug] = useState('');
    const [rating, setRating] = useState(0);
    const [verdict, setVerdict] = useState('');
    const [brand, setBrand] = useState('');
    const [form, setForm] = useState('');
    const [price, setPrice] = useState('');
    const [guarantee, setGuarantee] = useState('');
    const [sideEffects, setSideEffects] = useState('');
    const [description, setDescription] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [workingMechanism, setWorkingMechanism] = useState('');
    const [safetyInfo, setSafetyInfo] = useState('');
    const [warnings, setWarnings] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [affiliateLink, setAffiliateLink] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');
    const [content, setContent] = useState('');
    const [finalRating, setFinalRating] = useState(0);

    // Relations
    const [authorId, setAuthorId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [medicalReviewerId, setMedicalReviewerId] = useState('');

    // Dynamic Lists (Strings)
    const [pros, setPros] = useState<string[]>(['']);
    const [cons, setCons] = useState<string[]>(['']);
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [benefitsList, setBenefitsList] = useState<string[]>(['']);

    // Dynamic Lists (Objects/JSON)
    const [detailedIngredients, setDetailedIngredients] = useState<{ name: string, dosage: string, benefit: string }[]>([]);
    const [customerReviews, setCustomerReviews] = useState<{ user: string, rating: number, comment: string }[]>([]);
    const [pricingOffers, setPricingOffers] = useState<{ package: string, price: string, savings: string }[]>([]);
    const [faqs, setFaqs] = useState<{ question: string, answer: string }[]>([]);

    // SEO
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');

    // Selection Data
    const [categories, setCategories] = useState<Category[]>([]);
    const [authors, setAuthors] = useState<User[]>([]);
    const [experts, setExperts] = useState<HealthExpert[]>([]);

    useEffect(() => {
        Promise.all([
            fetch('/api/review-categories').then(res => res.json()),
            fetch('/api/authors').then(res => res.json()),
            fetch('/api/experts').then(res => res.json())
        ]).then(([cats, auths, exps]) => {
            setCategories(cats);
            setAuthors(auths);
            setExperts(exps);
        }).catch(err => console.error('Error fetching form data:', err));
    }, []);

    const generateSlug = (val: string) => {
        const s = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setSlug(s);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'reviews');

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (data.url) setFeaturedImage(data.url);
        } catch (error) {
            console.error('Upload fail:', error);
        } finally {
            setUploading(false);
        }
    };

    const addItem = (list: string[], setList: (l: string[]) => void) => setList([...list, '']);
    const removeItem = (list: string[], setList: (l: string[]) => void, idx: number) => setList(list.filter((_, i) => i !== idx));
    const updateItem = (list: string[], setList: (l: string[]) => void, idx: number, val: string) => {
        const newList = [...list];
        newList[idx] = val;
        setList(newList);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            productName, slug, rating: Number(rating), verdict, brand, form, price,
            guarantee, sideEffects, description, targetAudience, workingMechanism,
            safetyInfo, warnings, recommendation, affiliateLink, featuredImage,
            content, finalRating: Number(finalRating), authorId, categoryId,
            medicalReviewerId,
            pros: pros.filter(Boolean),
            cons: cons.filter(Boolean),
            ingredients: ingredients.filter(Boolean),
            benefitsList: benefitsList.filter(Boolean),
            detailedIngredients,
            customerReviews,
            pricingOffers,
            faqs,
            metaTitle,
            metaDescription
        };

        try {
            const res = await fetch('/api/product-reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/admin/product-reviews');
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to save review');
            }
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <button onClick={() => router.back()} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm border border-gray-100">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">New Product Review</h1>
                        <p className="text-gray-500 font-medium">Create a clinical-grade deep dive analysis</p>
                    </div>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 md:flex-none bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Publish Review
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Main Editor & Details */}
                <div className="lg:col-span-8 space-y-10">
                    
                    {/* 1. Header & Identity */}
                    <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                            <Info className="w-5 h-5 text-blue-500" />
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Identify Product</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => { setProductName(e.target.value); generateSlug(e.target.value); }}
                                className="w-full text-5xl font-black border-none focus:ring-0 placeholder:text-gray-100 p-0 text-gray-900 leading-tight"
                                placeholder="Product Name..."
                                required
                            />
                            
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 min-w-[240px]">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">/reviews/</span>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="bg-transparent border-none focus:ring-0 p-0 text-xs font-bold text-gray-600 w-full"
                                    />
                                </div>
                                <div className="flex items-center gap-3 bg-yellow-50 px-4 py-2.5 rounded-xl border border-yellow-100">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-[10px] font-black text-yellow-700 uppercase tracking-widest">Initial Rating</span>
                                    <input
                                        type="number"
                                        step="0.1"
                                        max="5"
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                        className="bg-transparent border-none focus:ring-0 p-0 text-xs font-black text-yellow-700 w-12 text-center"
                                    />
                                </div>
                            </div>

                            <textarea
                                value={verdict}
                                onChange={(e) => setVerdict(e.target.value)}
                                className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-gray-600 leading-relaxed italic"
                                placeholder="Core verdict... High impact executive summary of the review."
                                rows={3}
                            />
                        </div>
                    </section>

                    {/* 2. Blog Content (Rich Text) */}
                    <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                            <MessageSquare className="w-5 h-5 text-purple-500" />
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Detailed Analysis (Blog Content)</h3>
                        </div>
                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Paste your full blog review content here. Support images, headings, and lists."
                        />
                    </section>

                    {/* 3. Pros, Cons & Ingredients */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Pros */}
                        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Notable Pros
                                </h3>
                                <button onClick={() => addItem(pros, setPros)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Plus className="w-3 h-3" /></button>
                            </div>
                            <div className="space-y-3">
                                {pros.map((p, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            value={p}
                                            onChange={(e) => updateItem(pros, setPros, i, e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
                                        />
                                        <button onClick={() => removeItem(pros, setPros, i)} className="text-gray-200 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Cons */}
                        <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                    <XCircle className="w-4 h-4" /> Notable Cons
                                </h3>
                                <button onClick={() => addItem(cons, setCons)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Plus className="w-3 h-3" /></button>
                            </div>
                            <div className="space-y-3">
                                {cons.map((p, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            value={p}
                                            onChange={(e) => updateItem(cons, setCons, i, e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:ring-1 focus:ring-red-500 outline-none"
                                        />
                                        <button onClick={() => removeItem(cons, setCons, i)} className="text-gray-200 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* 4. Detailed Ingredients Table */}
                    <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                                <ListPlus className="w-5 h-5 text-blue-500" /> Ingredient Profiles
                            </h3>
                            <button
                                onClick={() => setDetailedIngredients([...detailedIngredients, { name: '', dosage: '', benefit: '' }])}
                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                            >
                                Add Ingredient
                            </button>
                        </div>
                        <div className="space-y-4">
                            {detailedIngredients.map((ing, i) => (
                                <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-2xl relative group">
                                    <button
                                        onClick={() => setDetailedIngredients(detailedIngredients.filter((_, idx) => idx !== i))}
                                        className="absolute -top-2 -right-2 bg-white text-gray-300 hover:text-red-500 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">Name</label>
                                        <input
                                            value={ing.name}
                                            onChange={(e) => {
                                                const list = [...detailedIngredients];
                                                list[i].name = e.target.value;
                                                setDetailedIngredients(list);
                                            }}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">Dosage</label>
                                        <input
                                            value={ing.dosage}
                                            onChange={(e) => {
                                                const list = [...detailedIngredients];
                                                list[i].dosage = e.target.value;
                                                setDetailedIngredients(list);
                                            }}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">Core Benefit</label>
                                        <input
                                            value={ing.benefit}
                                            onChange={(e) => {
                                                const list = [...detailedIngredients];
                                                list[i].benefit = e.target.value;
                                                setDetailedIngredients(list);
                                            }}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Right Column: Settings & Metadata */}
                <div className="lg:col-span-4 space-y-10">
                    
                    {/* Media & Action */}
                    <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Featured Image</label>
                            <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer">
                                {featuredImage ? (
                                    <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <ImageIcon className="w-10 h-10 text-gray-200 mb-3 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                                    </>
                                )}
                                <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                            </div>
                            <input
                                type="url"
                                value={featuredImage}
                                onChange={(e) => setFeaturedImage(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-400 outline-none"
                                placeholder="Or paste image URL..."
                            />
                        </div>

                        <div className="space-y-6 pt-6 border-t border-gray-50">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Affiliate (Buy) Link</label>
                                <div className="flex items-center gap-3 bg-gray-50 px-4 py-1 rounded-2xl border border-gray-100">
                                    <ShoppingCart className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="url"
                                        value={affiliateLink}
                                        onChange={(e) => setAffiliateLink(e.target.value)}
                                        className="bg-transparent border-none focus:ring-0 p-0 text-xs font-bold text-gray-600 w-full py-3"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Final Evaluation Score</label>
                                <div className="flex items-center gap-3 bg-blue-50 px-4 py-1 rounded-2xl border border-blue-100">
                                    <Star className="w-4 h-4 text-blue-600" />
                                    <input
                                        type="number"
                                        step="0.1"
                                        max="5"
                                        value={finalRating}
                                        onChange={(e) => setFinalRating(Number(e.target.value))}
                                        className="bg-transparent border-none focus:ring-0 p-0 text-xl font-black text-blue-900 w-full py-3"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Attribution & Categorization */}
                    <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                    <UserCheck className="w-3.5 h-3.5" /> Clinical Author
                                </label>
                                <select
                                    value={authorId}
                                    onChange={(e) => setAuthorId(e.target.value)}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-xs font-black text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Author</option>
                                    {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Medical Reviewer
                                </label>
                                <select
                                    value={medicalReviewerId}
                                    onChange={(e) => setMedicalReviewerId(e.target.value)}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-xs font-black text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Expert</option>
                                    {experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                                    <Tag className="w-3.5 h-3.5" /> Category
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-xs font-black text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Meta & SEO */}
                    <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                            <Anchor className="w-4 h-4 text-gray-400" />
                            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Search Optimization</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Meta Title</label>
                                <input
                                    type="text"
                                    value={metaTitle}
                                    onChange={(e) => setMetaTitle(e.target.value)}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-xs font-bold outline-none"
                                    placeholder="Title for Google results..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Meta Description</label>
                                <textarea
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-xs font-bold outline-none resize-none"
                                    rows={4}
                                    placeholder="Summary snippet for search..."
                                />
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
