'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Eye,
    Image as ImageIcon,
    Settings as SettingsIcon,
    Plus,
    X
} from 'lucide-react';
import Link from 'next/link';

export default function CreateArticle() {
    const router = useRouter();
    const [tags, setTags] = useState(['Healthy Living', 'Nutrition']);
    const [newTag, setNewTag] = useState('');

    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
                        <p className="text-sm text-gray-500">Draft your next health story</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Preview
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save as Draft
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Article Title</label>
                            <input
                                type="text"
                                placeholder="e.g. 10 Surprising Benefits of Green Tea"
                                className="w-full text-2xl font-bold border-none focus:ring-0 placeholder:text-gray-300"
                            />
                        </div>

                        <div className="min-h-[400px] border-y border-gray-100 py-6">
                            <textarea
                                placeholder="Tell your story..."
                                className="w-full h-full min-h-[400px] border-none focus:ring-0 resize-none placeholder:text-gray-300"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                            <SettingsIcon className="w-4 h-4 text-blue-500" /> Publishing Settings
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                                <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500">
                                    <option>Wellness</option>
                                    <option>Nutrition</option>
                                    <option>Mental Health</option>
                                    <option>Fitness</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Featured Image</label>
                                <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer p-4 group">
                                    <ImageIcon className="w-8 h-8 mb-2 group-hover:text-blue-500" />
                                    <span className="text-xs font-medium">Click to upload image</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tags</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {tags.map(tag => (
                                        <span key={tag} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                                            {tag} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        placeholder="Add tag..."
                                        className="flex-1 p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                                    />
                                    <button onClick={addTag} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-4">SEO Optimization</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Title</label>
                                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm" placeholder="Search engine title" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Description</label>
                                <textarea className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm h-24" placeholder="Brief summary for search results" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
