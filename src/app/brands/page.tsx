'use client';

import { useState, useEffect } from 'react';
import { Search, Star, Loader2, ArrowRight, Activity } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Brand {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    isStarred: boolean;
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await fetch('/api/brands');
            const data = await response.json();
            setBrands(data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const starredBrands = brands.filter(b => b.isStarred);

    const filteredBrands = brands.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLetter = selectedLetter ? b.name.toUpperCase().startsWith(selectedLetter) : true;
        return matchesSearch && matchesLetter;
    });

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Header */}
            <div className="bg-gray-50 border-b border-gray-100 py-20 pb-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Our Trusted <span className="text-blue-600">Brands</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
                        Browse our comprehensive list of health and wellness brands we've reviewed for you.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group">
                        <input
                            type="text"
                            placeholder="Search for a brand..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-8 py-5 rounded-2xl bg-white border-2 border-transparent shadow-xl focus:border-blue-500 focus:outline-none transition-all text-lg group-hover:shadow-2xl"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                            <Search className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                {/* Featured Brands (Starred) */}
                {starredBrands.length > 0 && !searchTerm && !selectedLetter && (
                    <section className="mb-20">
                        <div className="flex items-center gap-4 mb-10">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                                <Star className="w-6 h-6 text-yellow-500 fill-current" /> Featured Brands
                            </h2>
                            <div className="h-px flex-1 bg-gray-100" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {starredBrands.map((brand) => (
                                <div key={brand.id} className="bg-white p-6 border border-gray-100 rounded-2xl flex flex-col items-center justify-center hover:shadow-xl transition-all h-40 group cursor-pointer text-center">
                                    <div className="relative w-20 h-20 mb-3 transform group-hover:scale-110 transition-transform flex items-center justify-center">
                                        <img src={brand.logoUrl} alt={brand.name} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm">{brand.name}</h3>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* A-Z Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-12 py-6 bg-gray-50/50 rounded-2xl border border-gray-100 px-4">
                    <button
                        onClick={() => setSelectedLetter(null)}
                        className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${!selectedLetter ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white border border-transparent hover:border-gray-200 text-gray-500'}`}
                    >
                        ALL
                    </button>
                    {alphabet.map((char) => (
                        <button
                            key={char}
                            onClick={() => setSelectedLetter(char)}
                            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${selectedLetter === char ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white border border-transparent hover:border-gray-200 text-gray-500'}`}
                        >
                            {char}
                        </button>
                    ))}
                </div>

                {/* Brands Grid */}
                {isFetching ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="font-bold text-gray-400 uppercase tracking-widest">Gathering Brands...</p>
                    </div>
                ) : filteredBrands.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {filteredBrands.map((brand) => (
                            <div key={brand.id} className="bg-white p-6 border border-gray-100 rounded-2xl flex flex-col items-center justify-center hover:shadow-xl transition-all h-40 group cursor-pointer text-center">
                                <div className="relative w-20 h-20 mb-3 transform group-hover:scale-110 transition-transform flex items-center justify-center">
                                    <img src={brand.logoUrl} alt={brand.name} className="max-w-full max-h-full object-contain" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm">{brand.name}</h3>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-6">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                            <Activity className="w-10 h-10 text-blue-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            Available right now, <span className="text-blue-600">we will add it soon ☺️</span>
                        </h3>
                        <p className="text-gray-500">We are constantly reviewing new health and wellness products.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedLetter(null); }}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            View all brands instead
                        </button>
                    </div>
                )}
            </div>

            {/* Newsletter Minimal */}
            <section className="bg-gray-900 py-20 mt-20">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-white max-w-xl text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-4">Don't see your brand?</h2>
                        <p className="text-gray-400 text-lg">Suggest a brand to our review team and get notified when our analysis is live.</p>
                    </div>
                    <Link href="/contact-us" className="bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 whitespace-nowrap">
                        Suggest a Brand
                    </Link>
                </div>
            </section>
        </div>
    );
}
