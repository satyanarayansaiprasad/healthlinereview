'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Save, X, Search, ChevronRight, AlertCircle, GripVertical } from 'lucide-react';

// --- Types based on prisma schema ---
interface ExpertPicksGuide {
    id: string;
    title: string;
    slug: string;
    description: string;
    authorId: string;
    medicalReviewerId?: string;
    categoryId?: string;
    howWeRanked: any[];
    ingredientsAnalysis: any[];
    buyingGuide: any[];
    faqs: any[];
    finalVerdict: any;
    metaTitle: string;
    metaDescription: string;
    products: ExpertPickProduct[];
    category?: { name: string };
    author?: { name: string };
    _count?: { products: number };
}

interface ExpertPickProduct {
    id?: string;
    rank: number;
    productName: string;
    shortHighlight: string;
    rating: number;
    award: string;
    pros: string[];
    cons: string[];
    price: string;
    buyLink: string;
    highlights: string[];
    productImage: string;
}

export default function AdminExpertPicks() {
    const [guides, setGuides] = useState<ExpertPicksGuide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'form'>('list');

    // Reference Data
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [experts, setExperts] = useState<{ id: string, name: string }[]>([]);

    // Form State
    const [formData, setFormData] = useState<Partial<ExpertPicksGuide>>({
        title: '', slug: '', description: '', authorId: '', medicalReviewerId: '', categoryId: '',
        metaTitle: '', metaDescription: '',
        howWeRanked: [], ingredientsAnalysis: [], buyingGuide: [], faqs: [], finalVerdict: {},
        products: []
    });

    useEffect(() => {
        fetchGuides();
        fetchReferences();
    }, []);

    const fetchGuides = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/expert-guides');
            const data = await res.json();
            setGuides(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch guides', error);
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

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({ ...prev, title, slug: prev.id ? prev.slug : generateSlug(title) }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            const method = formData.id ? 'PATCH' : 'POST';
            const res = await fetch('/api/expert-guides', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save');
            }

            await fetchGuides();
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
        if (!confirm('Are you sure you want to delete this guide? This will also delete all associated products.')) return;
        
        try {
            const res = await fetch(`/api/expert-guides?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchGuides();
        } catch (error) {
            console.error('Error deleting', error);
        }
    };

    const editGuide = async (guide: ExpertPicksGuide) => {
        // Fetch full guide details including nested products
        try {
            const res = await fetch(`/api/expert-guides?slug=${guide.slug}`);
            const fullData = await res.json();
            setFormData(fullData);
            setView('form');
        } catch (e) {
            console.error(e);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '', slug: '', description: '', authorId: '', medicalReviewerId: '', categoryId: '',
            metaTitle: '', metaDescription: '',
            howWeRanked: [], ingredientsAnalysis: [], buyingGuide: [], faqs: [], finalVerdict: {},
            products: []
        });
    };

    // --- Complex Array Handlers ---
    const addProduct = () => {
        const newProduct: ExpertPickProduct = {
            rank: (formData.products?.length || 0) + 1,
            productName: '', shortHighlight: '', rating: 5.0, award: '',
            pros: [], cons: [], price: '', buyLink: '', highlights: [], productImage: ''
        };
        setFormData(prev => ({ ...prev, products: [...(prev.products || []), newProduct] }));
    };

    const updateProduct = (index: number, field: keyof ExpertPickProduct, value: any) => {
        const newProducts = [...(formData.products || [])];
        newProducts[index] = { ...newProducts[index], [field]: value };
        setFormData(prev => ({ ...prev, products: newProducts }));
    };

    const removeProduct = (index: number) => {
        const newProducts = [...(formData.products || [])];
        newProducts.splice(index, 1);
        // Re-rank remaining
        newProducts.forEach((p, i) => p.rank = i + 1);
        setFormData(prev => ({ ...prev, products: newProducts }));
    };

    const filteredGuides = guides.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (view === 'form') {
        return (
            <div className="max-w-5xl mx-auto space-y-6 pb-24">
                <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200 sticky top-4 z-50 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => { setView('list'); resetForm(); }} className="text-gray-500 hover:text-gray-900">
                            <X className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{formData.id ? 'Edit Guide' : 'Create New Guide'}</h1>
                            <p className="text-sm text-gray-500">Consumer Health Digest Style Listicle</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
                        Save Guide
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="col-span-2 space-y-8">
                        {/* Basic Info */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-4"><AlertCircle className="w-5 h-5"/> Basic Information</h2>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Guide Title (H1)</label>
                                <input type="text" value={formData.title} onChange={handleTitleChange} className="w-full p-3 border rounded-lg" placeholder="e.g. Best Joint Pain Supplements 2026" required/>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
                                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50" required/>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle / Intro Summary</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border rounded-lg h-32" placeholder="Brief introduction text explaining the guide..."/>
                            </div>
                        </div>

                        {/* Ranked Products */}
                        <div className="bg-white p-8 rounded-xl border border-gray-200 space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <h2 className="text-xl font-bold">Ranked Products</h2>
                                <button onClick={addProduct} className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                                    <Plus className="w-4 h-4"/> Add Product
                                </button>
                            </div>

                            <div className="space-y-6">
                                {formData.products?.map((product, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50 relative group">
                                        <button onClick={() => removeProduct(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-5 h-5"/>
                                        </button>
                                        
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                                {product.rank}
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">Product #{index + 1}</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1">Product Name</label>
                                                <input type="text" value={product.productName} onChange={e => updateProduct(index, 'productName', e.target.value)} className="w-full p-2 border rounded-md"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1">Badge / Award (e.g. TOP PICK)</label>
                                                <input type="text" value={product.award} onChange={e => updateProduct(index, 'award', e.target.value)} className="w-full p-2 border rounded-md"/>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-gray-700 mb-1">Short Highlight (Table View)</label>
                                                <input type="text" value={product.shortHighlight} onChange={e => updateProduct(index, 'shortHighlight', e.target.value)} className="w-full p-2 border rounded-md"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1">Rating (Out of 5)</label>
                                                <input type="number" step="0.1" value={product.rating} onChange={e => updateProduct(index, 'rating', parseFloat(e.target.value))} className="w-full p-2 border rounded-md"/>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1">Price</label>
                                                <input type="text" value={product.price} onChange={e => updateProduct(index, 'price', e.target.value)} className="w-full p-2 border rounded-md"/>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-gray-700 mb-1">Affiliate Link</label>
                                                <input type="url" value={product.buyLink} onChange={e => updateProduct(index, 'buyLink', e.target.value)} className="w-full p-2 border rounded-md"/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!formData.products || formData.products.length === 0) && (
                                    <p className="text-gray-500 text-center py-8">No products added yet. Add products to build the rankings table.</p>
                                )}
                            </div>
                        </div>

                        {/* Note: In a full production app, you would add similar complex array editors for howWeRanked, faqs, etc here */}
                        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                            <p className="text-sm text-yellow-800 font-medium">
                                <strong>Note:</strong> Structured fields like "How We Ranked", "FAQs", and "Ingredients Analysis" require complex JSON array interfaces. For brevity in this implementation, their data structure is supported by the API, but UI fields remain minimal here. You can expand these arrays programmatically.
                            </p>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">
                        {/* Meta & SEO */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                            <h3 className="font-bold border-b pb-2">SEO & Metadata</h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Meta Title</label>
                                <input type="text" value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} className="w-full p-2 border rounded-md text-sm"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Meta Description</label>
                                <textarea value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} className="w-full p-2 border rounded-md text-sm h-24"/>
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
                                <p className="text-[10px] text-gray-500 mt-1">Adds "Medically Reviewed By" badge.</p>
                            </div>
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
                    <h1 className="text-3xl font-bold text-gray-900">Expert Picks Guides</h1>
                    <p className="text-gray-500">Manage listicles and buying guides (Consumer Health Digest style)</p>
                </div>
                <button onClick={() => setView('form')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2">
                    <Plus className="w-5 h-5"/> New Guide
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search guides..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {isLoading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600"/></div>
                    ) : filteredGuides.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No guides found. Create your first listicle!</div>
                    ) : (
                        filteredGuides.map(guide => (
                            <div key={guide.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <h3 className="font-bold text-gray-900">{guide.title}</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-2">
                                        <span>/{guide.slug}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span>{guide._count?.products || 0} Ranked Products</span>
                                        {guide.category && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span className="text-blue-600 font-medium">{guide.category.name}</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => editGuide(guide)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                                        <Edit className="w-5 h-5"/>
                                    </button>
                                    <button onClick={() => handleDelete(guide.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
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
