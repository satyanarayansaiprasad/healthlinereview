'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Star,
    Plus,
    X,
    Tag,
    ListChecks,
    AlertCircle,
    ExternalLink
} from 'lucide-react';

export default function CreateProductReview() {
    const router = useRouter();
    const [pros, setPros] = useState(['High Potency', 'No Fishy Aftertaste']);
    const [cons, setCons] = useState(['Slightly Expensive']);
    const [rating, setRating] = useState(4.5);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add Product Review</h1>
                        <p className="text-sm text-gray-500">Expert analysis of health products</p>
                    </div>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" /> Publish Review
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Product Name</label>
                            <input
                                type="text"
                                className="w-full text-xl font-bold p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Life Extension Super Omega-3"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 font-mono text-gray-400 text-xs">REVIEW CONTENT</label>
                            <textarea
                                className="w-full h-96 p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"
                                placeholder="Write your detailed review here..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm space-y-4">
                            <h3 className="text-green-700 font-bold flex items-center gap-2">
                                <ListChecks className="w-4 h-4" /> Pros
                            </h3>
                            <div className="space-y-2">
                                {pros.map((pro, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-green-50 p-2 rounded-lg text-sm text-green-800">
                                        <span className="flex-1">{pro}</span>
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => setPros(pros.filter((_, idx) => idx !== i))} />
                                    </div>
                                ))}
                                <button
                                    onClick={() => setPros([...pros, 'New Pro'])}
                                    className="w-full py-2 border border-dashed border-green-200 text-green-600 rounded-lg text-xs font-bold hover:bg-green-50"
                                >
                                    + Add Pro
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm space-y-4">
                            <h3 className="text-red-700 font-bold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Cons
                            </h3>
                            <div className="space-y-2">
                                {cons.map((con, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-red-50 p-2 rounded-lg text-sm text-red-800">
                                        <span className="flex-1">{con}</span>
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => setCons(cons.filter((_, idx) => idx !== i))} />
                                    </div>
                                ))}
                                <button
                                    onClick={() => setCons([...cons, 'New Con'])}
                                    className="w-full py-2 border border-dashed border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50"
                                >
                                    + Add Con
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Rating</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    value={rating}
                                    onChange={(e) => setRating(parseFloat(e.target.value))}
                                    className="flex-1 accent-yellow-500"
                                />
                                <span className="text-xl font-bold text-gray-900">{rating}</span>
                                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Affiliate Link</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                                    placeholder="https://amazon.com/..."
                                />
                                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ingredients</label>
                                <textarea className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm mt-2" placeholder="List key ingredients..." />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Side Effects</label>
                                <textarea className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm mt-2" placeholder="Document any reported side effects..." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
