'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Save, Image as ImageIcon, Plus, Trash2, Globe, Loader2, ListPlus,
    MessageSquare, CheckSquare, Search, Tag, Anchor, ShoppingBag, Star
} from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface HealthExpert {
    id: string;
    name: string;
}

interface Props {
    params: Promise<{ id: string }>;
}

export default function EditSupplement({ params }: Props) {
    const { id } = use(params);
    const router = useRouter();

    // State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [overview, setOverview] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');
    const [conclusion, setConclusion] = useState('');
    const [isHelpfulActive, setIsHelpfulActive] = useState(true);
    const [rank, setRank] = useState(0);
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [faqs, setFaqs] = useState<{ question: string, answer: string }[]>([]);
    const [sources, setSources] = useState<{ label: string, url: string }[]>([]);

    // Post Type & Products
    const [postType, setPostType] = useState<'SUPPLEMENT' | 'EXPERT_PICK' | 'PRODUCT_REVIEW'>('SUPPLEMENT');
    const [products, setProducts] = useState<any[]>([]);

    const [experts, setExperts] = useState<HealthExpert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, [id]);

    const fetchInitialData = async () => {
        try {
            const [exRes, supRes] = await Promise.all([
                fetch('/api/experts'),
                fetch(`/api/supplements/${id}`)
            ]);

            const expertsData = await exRes.json();
            const supplement = await supRes.json();

            setExperts(expertsData);

            // Populate form
            setTitle(supplement.title);
            setSlug(supplement.slug);
            setSubtitle(supplement.subtitle || '');
            setAuthorId(supplement.authorId);
            setOverview(supplement.content?.overview || '');
            setFeaturedImage(supplement.featuredImage || '');
            setConclusion(supplement.conclusion || '');
            setIsHelpfulActive(supplement.isHelpfulActive);
            setRank(supplement.rank || 0);
            setMetaTitle(supplement.metaTitle || '');
            setMetaDescription(supplement.metaDescription || '');
            setFaqs(supplement.faqs || []);
            setSources(supplement.sources || []);

            // New fields
            if (supplement.postType) setPostType(supplement.postType);
            if (supplement.products) setProducts(supplement.products);

        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'supplements');

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

    const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
    const removeFaq = (idx: number) => setFaqs(faqs.filter((_, i) => i !== idx));
    const updateFaq = (idx: number, field: 'question' | 'answer', val: string) => {
        const newFaqs = [...faqs];
        newFaqs[idx][field] = val;
        setFaqs(newFaqs);
    };

    const addSource = () => setSources([...sources, { label: '', url: '' }]);
    const removeSource = (idx: number) => setSources(sources.filter((_, i) => i !== idx));
    const updateSource = (idx: number, field: 'label' | 'url', val: string) => {
        const newSources = [...sources];
        newSources[idx][field] = val;
        setSources(newSources);
    };

    // Product Handlers
    const addProduct = () => {
        if (postType === 'EXPERT_PICK') {
            setProducts([...products, {
                name: '', rating: 0, imageUrl: '', content: '',
                specs: { form: '', dosage: '', usage: '', quantity: '', ingredients: '', safety: '', companyInfo: '' },
                buyLinks: { amazon: '', walmart: '' },
                featuredVerdict: { title: '', rating: 0, quote: '', reviewer: '' }
            }]);
        } else if (postType === 'PRODUCT_REVIEW') {
            setProducts([{ name: '', subtitle: '', description: '', imageUrl: '', buyLinks: { amazon: '', flipkart: '' } }]);
        }
    };

    const removeProduct = (idx: number) => setProducts(products.filter((_, i) => i !== idx));

    const updateProduct = (idx: number, field: string, val: any) => {
        const newProducts = [...products];
        const fields = field.split('.');
        if (fields.length === 1) {
            newProducts[idx][field] = val;
        } else if (fields.length === 2) {
            if (!newProducts[idx][fields[0]]) newProducts[idx][fields[0]] = {};
            newProducts[idx][fields[0]][fields[1]] = val;
        }
        setProducts(newProducts);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const payload = {
            title, slug, subtitle, authorId, featuredImage, conclusion,
            content: { overview },
            faqs, sources, metaTitle, metaDescription, isHelpfulActive, rank: Number(rank),
            postType, products
        };

        try {
            const res = await fetch(`/api/supplements/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/admin/supplements');
                router.refresh();
            }
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Supplement</h1>
                        <p className="text-gray-500">Update your high-ranking supplement guide</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
                    </button>
                </div>
            </div>

            {/* Post Type Selector */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-blue-500" /> Choose Post Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { id: 'SUPPLEMENT', label: 'Regular Supplement', desc: 'Standard informative post' },
                        { id: 'EXPERT_PICK', label: 'Expert Picks', desc: 'Curated products with specs' },
                        { id: 'PRODUCT_REVIEW', label: 'Product Review', desc: 'Highly recommended product' }
                    ].map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setPostType(type.id as any)}
                            className={`p-6 rounded-2xl border-2 text-left transition-all ${postType === type.id
                                ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50'
                                : 'border-gray-100 hover:border-gray-200 bg-white'
                                }`}
                        >
                            <div className="font-bold text-gray-900 mb-1">{type.label}</div>
                            <div className="text-xs text-gray-500">{type.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-4xl font-extrabold border-none focus:ring-0 placeholder:text-gray-200 p-0"
                                placeholder="Supplement Title..."
                                required
                            />
                            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                                <Globe className="w-4 h-4" />
                                <span>/supplements/</span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="border-b border-gray-100 focus:border-blue-500 focus:ring-0 p-0 text-gray-600"
                                />
                            </div>
                            <input
                                type="text"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className="w-full text-xl text-gray-400 font-medium border-none focus:ring-0 p-0"
                                placeholder="Catchy subtitle or summary..."
                            />
                        </div>

                        <div className="pt-6 border-t border-gray-50 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <ListPlus className="w-5 h-5 text-blue-500" /> Professional Overview
                            </h3>
                            <RichTextEditor
                                content={overview}
                                onChange={setOverview}
                                placeholder="Paste or write your comprehensive review here..."
                            />
                        </div>

                        <div className="pt-6 border-t border-gray-50 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <CheckSquare className="w-5 h-5 text-green-500" /> Expert Conclusion
                            </h3>
                            <textarea
                                value={conclusion}
                                onChange={(e) => setConclusion(e.target.value)}
                                className="w-full min-h-[150px] p-6 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                placeholder="Summary of the experts final verdict..."
                            />
                        </div>
                    </div>

                    {/* Dynamic Product Fields */}
                    {postType !== 'SUPPLEMENT' && (
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-pink-500" />
                                    {postType === 'EXPERT_PICK' ? 'Featured Expert Picks' : 'Highly Recommended Product'}
                                </h3>
                                {postType === 'EXPERT_PICK' && (
                                    <button
                                        onClick={addProduct}
                                        className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" /> Add Product
                                    </button>
                                )}
                            </div>

                            <div className="space-y-12">
                                {products.map((product, i) => (
                                    <div key={i} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-8 relative group">
                                        <button
                                            onClick={() => removeProduct(i)}
                                            className="absolute right-6 top-6 text-gray-400 hover:text-red-500 p-2 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                                                    <input
                                                        type="text"
                                                        value={product.name}
                                                        onChange={(e) => updateProduct(i, 'name', e.target.value)}
                                                        className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                                        placeholder="e.g., Carlyle Berberine HCL"
                                                    />
                                                </div>

                                                {postType === 'PRODUCT_REVIEW' && (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Sub-title</label>
                                                        <input
                                                            type="text"
                                                            value={product.subtitle}
                                                            onChange={(e) => updateProduct(i, 'subtitle', e.target.value)}
                                                            className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                                            placeholder="Short catchphrase..."
                                                        />
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Product Image URL</label>
                                                    <input
                                                        type="url"
                                                        value={product.imageUrl}
                                                        onChange={(e) => updateProduct(i, 'imageUrl', e.target.value)}
                                                        className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                                        placeholder="Paste image link..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                {postType === 'EXPERT_PICK' ? (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Amazon Link</label>
                                                            <input
                                                                type="text"
                                                                value={product.buyLinks?.amazon}
                                                                onChange={(e) => updateProduct(i, 'buyLinks.amazon', e.target.value)}
                                                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs outline-none shadow-sm"
                                                                placeholder="Link or Price..."
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Walmart Link</label>
                                                            <input
                                                                type="text"
                                                                value={product.buyLinks?.walmart}
                                                                onChange={(e) => updateProduct(i, 'buyLinks.walmart', e.target.value)}
                                                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs outline-none shadow-sm"
                                                                placeholder="Link or Price..."
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Amazon Link</label>
                                                            <input
                                                                type="text"
                                                                value={product.buyLinks?.amazon}
                                                                onChange={(e) => updateProduct(i, 'buyLinks.amazon', e.target.value)}
                                                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs outline-none shadow-sm"
                                                                placeholder="URL..."
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Flipkart Link</label>
                                                            <input
                                                                type="text"
                                                                value={product.buyLinks?.flipkart}
                                                                onChange={(e) => updateProduct(i, 'buyLinks.flipkart', e.target.value)}
                                                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs outline-none shadow-sm"
                                                                placeholder="URL..."
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Rating (1-5)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={product.rating}
                                                        onChange={(e) => updateProduct(i, 'rating', Number(e.target.value))}
                                                        className="w-20 bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {postType === 'EXPERT_PICK' && (
                                            <>
                                                <div className="pt-8 border-t border-gray-100">
                                                    <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Specifications</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {Object.keys(product.specs || {}).map((spec) => (
                                                            <div key={spec} className="space-y-1">
                                                                <label className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">{spec.replace(/([A-Z])/g, ' $1')}</label>
                                                                <input
                                                                    type="text"
                                                                    value={product.specs[spec]}
                                                                    onChange={(e) => updateProduct(i, `specs.${spec}`, e.target.value)}
                                                                    className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs outline-none"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="pt-8 border-t border-gray-100">
                                                    <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Expert Support Highlight</h4>
                                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <input
                                                                type="text"
                                                                placeholder="Highlight Title (e.g., Supports My Blood Sugar)"
                                                                value={product.featuredVerdict?.title}
                                                                onChange={(e) => updateProduct(i, 'featuredVerdict.title', e.target.value)}
                                                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs outline-none"
                                                            />
                                                            <div className="flex items-center gap-2">
                                                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                                <input
                                                                    type="number"
                                                                    step="0.1"
                                                                    placeholder="Rating"
                                                                    value={product.featuredVerdict?.rating}
                                                                    onChange={(e) => updateProduct(i, 'featuredVerdict.rating', Number(e.target.value))}
                                                                    className="w-16 bg-gray-50 border-none rounded-xl px-4 py-3 text-xs outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                        <textarea
                                                            placeholder="Expert Quote..."
                                                            value={product.featuredVerdict?.quote}
                                                            onChange={(e) => updateProduct(i, 'featuredVerdict.quote', e.target.value)}
                                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs outline-none h-20"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Reviewer Name (e.g., Gregory T. Lawson)"
                                                            value={product.featuredVerdict?.reviewer}
                                                            onChange={(e) => updateProduct(i, 'featuredVerdict.reviewer', e.target.value)}
                                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="pt-8 border-t border-gray-100">
                                            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Description / Review</h4>
                                            <textarea
                                                value={postType === 'EXPERT_PICK' ? product.content : product.description}
                                                onChange={(e) => updateProduct(i, postType === 'EXPERT_PICK' ? 'content' : 'description', e.target.value)}
                                                className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm h-40"
                                                placeholder="Write detailed information here..."
                                            />
                                        </div>
                                    </div>
                                ))}

                                {products.length === 0 && (
                                    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/50">
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-4">No products added yet</p>
                                        <button
                                            onClick={addProduct}
                                            className="bg-white px-6 py-3 rounded-xl font-bold text-blue-600 shadow-sm hover:shadow-md transition-all flex items-center gap-2 mx-auto"
                                        >
                                            <Plus className="w-4 h-4" /> {postType === 'EXPERT_PICK' ? 'Add Recommended Product' : 'Add Review Product'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* FAQs Section */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-orange-500" /> Frequently Asked Questions
                            </h3>
                            <button
                                onClick={addFaq}
                                className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add FAQ
                            </button>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 group relative">
                                    <button
                                        onClick={() => removeFaq(i)}
                                        className="absolute right-4 top-4 text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="text"
                                        value={faq.question}
                                        onChange={(e) => updateFaq(i, 'question', e.target.value)}
                                        placeholder="Question..."
                                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm"
                                    />
                                    <textarea
                                        value={faq.answer}
                                        onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                                        placeholder="Answer..."
                                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm h-24"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Media & Expert */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700">Written / Reviewed By</label>
                            <select
                                value={authorId}
                                onChange={(e) => setAuthorId(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                                required
                            >
                                <option value="">Select an Expert</option>
                                {experts.map(ex => (
                                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700">Featured Image</label>
                            <div className="relative group">
                                <div className="relative aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
                                    {featuredImage ? (
                                        <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-10 h-10 text-gray-200" />
                                    )}
                                    <input
                                        type="file"
                                        onChange={handleUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept=".png, .jpg, .jpeg, .webp, .svg"
                                    />
                                    {uploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}
                                </div>
                                <div className="mt-2 text-[10px] text-gray-400 font-bold uppercase text-center bg-gray-50 py-1 rounded-lg border border-gray-100">
                                    Supports: PNG, JPG, WEBP, SVG
                                </div>
                                <div className="mt-4 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Image URL (Instant Preview)</label>
                                    <input
                                        type="url"
                                        value={featuredImage}
                                        onChange={(e) => setFeaturedImage(e.target.value)}
                                        placeholder="Paste an image URL..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-500">Ranking (0-100)</label>
                                <input
                                    type="number"
                                    value={rank}
                                    onChange={(e) => setRank(Number(e.target.value))}
                                    className="w-20 p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm text-center font-bold"
                                />
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-blue-900">Helpful Widget</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isHelpfulActive}
                                    onChange={(e) => setIsHelpfulActive(e.target.checked)}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sources Section */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Anchor className="w-5 h-5 text-purple-500" /> Scientific Sources
                            </h3>
                            <button onClick={addSource} className="text-blue-600 font-bold text-sm flex items-center gap-1">
                                <Plus className="w-4 h-4" /> Add Source
                            </button>
                        </div>
                        <div className="space-y-4">
                            {sources.map((src, i) => (
                                <div key={i} className="space-y-2 group relative">
                                    <button onClick={() => removeSource(i)} className="absolute -right-2 top-0 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                    <input value={src.label} onChange={(e) => updateSource(i, 'label', e.target.value)} placeholder="Label..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs" />
                                    <input value={src.url} onChange={(e) => updateSource(i, 'url', e.target.value)} placeholder="URL..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-blue-500" /> SEO Settings
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Meta Title</label>
                                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Meta Description</label>
                                <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm h-24" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
