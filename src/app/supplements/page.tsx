'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pill, Search, ChevronRight, Loader2, Star, TrendingUp, X } from 'lucide-react';

interface Supplement {
    id: string;
    title: string;
    slug: string;
    subtitle: string;
    featuredImage: string;
    rank: number;
}

export default function SupplementsPage() {
    const [supplements, setSupplements] = useState<Supplement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterChar, setFilterChar] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const alphabets = "abcdefghijklmnopqrstuvwxyz".split("");
    const numbers = "0123456789".split("");

    useEffect(() => {
        fetchSupplements();
    }, [filterChar]);

    const fetchSupplements = async () => {
        setIsLoading(true);
        try {
            let url = '/api/supplements';
            if (filterChar) url += `?char=${filterChar}`;
            const res = await fetch(url);
            const data = await res.json();
            setSupplements(data);
        } catch (error) {
            console.error('Fetch fail:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filtered = supplements.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100 py-16 md:py-24 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 clip-path-slant hidden lg:block" />
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 transition-all hover:bg-blue-100">
                            <TrendingUp className="w-4 h-4" /> Science Backed Reviews
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight">
                            Expert <span className="text-blue-600">Supplement</span> Guides
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl font-medium">
                            We analyze purity, efficacy, and clinical research to bring you the only supplement directory you'll ever need.
                        </p>

                        <div className="relative max-w-xl group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by ingredient or concern..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-16 pr-6 py-6 bg-gray-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-100 transition-all text-lg font-bold shadow-sm placeholder:text-gray-300"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* A-Z Filter Bar */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setFilterChar(null)}
                                className={`px-6 py-2.5 rounded-2xl text-sm font-black transition-all ${!filterChar ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 ring-2 ring-blue-500 ring-offset-2' : 'bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                            >
                                ALL GUIDES
                            </button>
                            <div className="w-px h-8 bg-gray-100 mx-2 hidden sm:block" />
                            <div className="flex flex-wrap gap-1.5">
                                {numbers.map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setFilterChar(n)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all ${filterChar === n ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-400 border border-gray-100 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50'}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                            {alphabets.map(a => (
                                <button
                                    key={a}
                                    onClick={() => setFilterChar(a)}
                                    className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl text-xs font-black uppercase transition-all ${filterChar === a ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-400 border border-gray-100 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50'}`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <main className="container mx-auto px-4 py-16">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-blue-50 rounded-full animate-spin border-t-blue-600" />
                            <Pill className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <p className="font-black text-gray-300 uppercase tracking-[0.3em] text-[10px]">Filtering Database...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {filtered.map((s) => (
                            <Link
                                href={`/supplements/${s.slug}`}
                                key={s.id}
                                className="group bg-white rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col"
                            >
                                <div className="aspect-[1.2/1] relative overflow-hidden">
                                    <img
                                        src={s.featuredImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80'}
                                        alt={s.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-8 left-8 px-5 py-2.5 bg-white/95 backdrop-blur rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-xl flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                                        Verified Analysis
                                    </div>
                                    <div className="absolute bottom-6 right-8 flex items-center gap-2 text-white bg-blue-600/90 backdrop-blur px-5 py-2.5 rounded-[1.5rem] text-xs font-black shadow-2xl">
                                        <Star className="w-3.5 h-3.5 fill-white" /> Rank {s.rank}
                                    </div>
                                </div>
                                <div className="p-10 md:p-12 flex-1 flex flex-col items-start bg-gradient-to-b from-white to-gray-50/30">
                                    <h3 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                                        {s.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-10 line-clamp-3 font-medium">
                                        {s.subtitle || "A comprehensive deep-dive into ingredients, side effects, and clinical evidence for optimal health results."}
                                    </p>
                                    <div className="mt-auto w-full flex items-center justify-between">
                                        <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all flex items-center gap-2">
                                            Deep Dive Guide <ChevronRight className="w-4 h-4 translate-y-[0.5px]" />
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center max-w-lg mx-auto space-y-8">
                        <div className="relative mx-auto w-32 h-32">
                            <div className="absolute inset-0 bg-blue-50 rounded-[3rem] rotate-6 scale-95" />
                            <div className="absolute inset-0 bg-white border border-gray-100 rounded-[3rem] shadow-xl flex items-center justify-center">
                                <Search className="w-12 h-12 text-gray-200" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-gray-900">No guides matching <span className="text-blue-600">"{filterChar || searchTerm}"</span></h2>
                            <p className="text-gray-500 leading-relaxed font-medium">
                                We haven't indexed content for this specific category yet. Join our newsletter to be notified when new reviews drop.
                            </p>
                        </div>
                        <button
                            onClick={() => { setFilterChar(null); setSearchTerm(''); }}
                            className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                        >
                            Reset Discovery Engine
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
