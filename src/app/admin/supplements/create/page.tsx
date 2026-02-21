'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Save, Image as ImageIcon, Plus, Trash2, Globe, Loader2, ListPlus,
    MessageSquare, CheckSquare, Search, Tag, Anchor
} from 'lucide-react';
import Link from 'next/link';

interface HealthExpert {
    id: string;
    name: string;
}

export default function CreateSupplement() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [overview, setOverview] = useState('');
    const [featuredImage, setFeaturedImage] = useState('');
    const [conclusion, setConclusion] = useState('');
    const [isHelpfulActive, setIsHelpfulActive] = useState(true);
    const [rank, setRank] = useState(0);

    // SEO
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');

    // Dynamic lists
    const [faqs, setFaqs] = useState<{ question: string, answer: string }[]>([]);
    const [sources, setSources] = useState<{ label: string, url: string }[]>([]);

    // Stats & UI
    const [experts, setExperts] = useState<HealthExpert[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = async () => {
        try {
            const res = await fetch('/api/experts');
            const data = await res.json();
            setExperts(data);
        } catch (error) {
            console.error('Error fetching experts:', error);
        }
    };

    const generateSlug = (val: string) => {
        const s = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setSlug(s);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            title, slug, subtitle, authorId, featuredImage, conclusion,
            content: { overview },
            faqs, sources, metaTitle, metaDescription, isHelpfulActive, rank: Number(rank)
        };

        try {
            const res = await fetch('/api/supplements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/admin/supplements');
            }
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Add Supplement Post</h1>
                        <p className="text-gray-500">Create a high-ranking supplement guide</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Publish Post
                    </button>
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
                                onChange={(e) => { setTitle(e.target.value); generateSlug(e.target.value); }}
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

                        {/* Overview / Content */}
                        <div className="pt-6 border-t border-gray-50 space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <ListPlus className="w-5 h-5 text-blue-500" /> Professional Overview
                                </h3>
                            </div>
                            <textarea
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                className="w-full min-h-[400px] p-6 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-gray-300"
                                placeholder="Paste your comprehensive review here..."
                                required
                            />
                        </div>

                        {/* Conclusion */}
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
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Question {i + 1}</label>
                                        <input
                                            type="text"
                                            value={faq.question}
                                            onChange={(e) => updateFaq(i, 'question', e.target.value)}
                                            placeholder="Ask something users search for..."
                                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase">Answer</label>
                                        <textarea
                                            value={faq.answer}
                                            onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                                            placeholder="Provide a clear, authoritative answer..."
                                            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                        />
                                    </div>
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
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                                <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer overflow-hidden p-2 relative">
                                    {featuredImage ? (
                                        <img src={featuredImage} alt="Featured" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <>
                                            <ImageIcon className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="text-sm font-bold">Upload Image</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        onChange={handleUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept=".png, .jpg, .jpeg, .webp, .svg"
                                    />
                                    {uploading && (
                                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                        </div>
                                    )}
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
                                <label className="text-xs font-bold text-gray-500 uppercase">Ranking (0-100)</label>
                                <input
                                    type="number"
                                    value={rank}
                                    onChange={(e) => setRank(Number(e.target.value))}
                                    className="w-20 p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm text-center font-bold"
                                />
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                                <CheckSquare className="w-5 h-5 text-blue-600" />
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-blue-900">Helpful Widget Active</p>
                                    <p className="text-[10px] text-blue-600">Shows "Was this helpful?" Yes/No</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isHelpfulActive}
                                    onChange={(e) => setIsHelpfulActive(e.target.checked)}
                                    className="w-5 h-5 text-blue-600 rounded cursor-pointer"
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
                            <button
                                onClick={addSource}
                                className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add Source
                            </button>
                        </div>
                        <div className="space-y-3">
                            {sources.map((src, i) => (
                                <div key={i} className="flex gap-2 items-start group">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            value={src.label}
                                            onChange={(e) => updateSource(i, 'label', e.target.value)}
                                            placeholder="Source Label (e.g. PubMed Analysis)"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs outline-none"
                                        />
                                        <input
                                            type="url"
                                            value={src.url}
                                            onChange={(e) => updateSource(i, 'url', e.target.value)}
                                            placeholder="URL Link..."
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs outline-none"
                                        />
                                    </div>
                                    <button onClick={() => removeSource(i)} className="pt-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-blue-500" /> Search Optimization
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Meta Title</label>
                                <input
                                    type="text"
                                    value={metaTitle}
                                    onChange={(e) => setMetaTitle(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Supplement Guide Title for Google"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Meta Description</label>
                                <textarea
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                    placeholder="Brief summary for search snippets..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
