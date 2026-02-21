'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pill, Search, ChevronRight, Loader2, Star, TrendingUp } from 'lucide-react';

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
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                            <TrendingUp className="w-4 h-4" /> Science Backed Reviews
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1]">
                            Expert <span className="text-blue-600">Supplement</span> Guides
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl">
                            We analyze purity, efficacy, and clinical research to bring you the only supplement directory you'll ever need.
                        </p>

                        <div className="relative max-w-xl group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by ingredient or concern..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-100 transition-all text-lg font-medium shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* A-Z Filter Bar */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 py-4 overflow-x-auto no-scrollbar scroll-smooth">
                    <div className="flex items-center gap-2 min-w-max">
                        <button
                            onClick={() => setFilterChar(null)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${!filterChar ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            All
                        </button>
                        <div className="w-px h-6 bg-gray-100 mx-2" />
                        {numbers.map(n => (
                            <button
                                key={n}
                                onClick={() => setFilterChar(n)}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-black transition-all ${filterChar === n ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                            >
                                {n}
                            </button>
                        ))}
                        <div className="w-px h-6 bg-gray-100 mx-2" />
                        {alphabets.map(a => (
                            <button
                                key={a}
                                onClick={() => setFilterChar(a)}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-black uppercase transition-all ${filterChar === a ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <main className="container mx-auto px-4 py-16">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                        <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Curating Guides...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {filtered.map((s) => (
                            <Link
                                href={`/supplements/${s.slug}`}
                                key={s.id}
                                className="group bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img
                                        src={s.featuredImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80'}
                                        alt={s.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                                        Verified Analysis
                                    </div>
                                    <div className="absolute bottom-4 right-6 flex items-center gap-1 text-white bg-blue-600 px-3 py-1.5 rounded-full text-xs font-black shadow-lg">
                                        <Star className="w-3 h-3 fill-white" /> Rank {s.rank}
                                    </div>
                                </div>
                                <div className="p-8 md:p-10 flex-1 flex flex-col items-start">
                                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                                        {s.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                        {s.subtitle || "A comprehensive deep-dive into ingredients, side effects, and clinical evidence for optimal health results."}
                                    </p>
                                    <div className="mt-auto flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                        Explore Guide <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center max-w-md mx-auto space-y-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto">
                            <Pill className="w-10 h-10 text-gray-200" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900">No guides matching <span className="text-blue-600 italic">"{filterChar || searchTerm}"</span></h2>
                        <p className="text-gray-500 leading-relaxed">
                            We haven't indexed content for this category yet. Try another letter or browse our full collection.
                        </p>
                        <button
                            onClick={() => { setFilterChar(null); setSearchTerm(''); }}
                            className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-200"
                        >
                            View All Supplements
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
