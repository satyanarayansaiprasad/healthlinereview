import { Search, Building2, ChevronRight, Filter, ShieldCheck, Award, CheckCircle2, Factory } from 'lucide-react';
import Link from 'next/link';

export default function BrandsPage() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const brands = [
        'Vitality Labs', 'Green Roots', 'Nature First', 'Elite Wellness',
        'Ocean Purity', 'Sky Health', 'Zen Nutrition', 'Pure Bio',
        'Aura Wellness', 'Bloom Health', 'Core Nutrition', 'Peak Performance',
        'BioTrust', 'Bulk Supplements', 'Care/of', 'Garden of Life',
        'Hum Nutrition', 'Life Extension', 'Now Foods', ' Thorne Health'
    ];

    return (
        <div className="flex flex-col gap-12 md:gap-20 pb-20 bg-[#fbfcfd] font-sans">
            {/* Search Focused Hero */}
            <section className="bg-white border-b border-gray-100 pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden relative">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/30 skew-x-12 translate-x-1/2" />

                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] border border-blue-100">
                            <Factory className="w-4 h-4" />
                            Verified Manufacturer Directory
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                            Directory of <span className="text-blue-600">Trusted Brands.</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-gray-600 leading-relaxed font-medium max-w-3xl mx-auto">
                            We research and audit the manufacturing protocols of the world's leading wellness brands to help you verify what goes into your body.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto pt-8">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-16 pr-6 py-6 md:py-8 bg-white border-2 border-gray-100 rounded-[2rem] text-lg font-medium placeholder:text-gray-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-2xl shadow-blue-900/5"
                                    placeholder="Search for a manufacturer or brand..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* A-Z Navigation & Listing */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-blue-50 shadow-xl shadow-blue-900/5 mb-20 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-500" />

                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Filter className="w-4 h-4" /> FILTER BY NAME
                        </h3>
                        <span className="text-blue-600 font-black text-xs">VIEWING ALL</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                        {alphabet.map((letter) => (
                            <button
                                key={letter}
                                className="w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-sm md:text-lg font-black text-gray-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer border border-gray-50 hover:border-blue-600 hover:scale-110"
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                    {brands.map((brand, i) => (
                        <div
                            key={brand}
                            className="group flex flex-col items-center text-center bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-500 cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-4 right-4">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50/50 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors shadow-inner">
                                <Building2 className="w-10 h-10 text-blue-300 group-hover:text-white transition-colors" />
                            </div>

                            <span className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight leading-tight">
                                {brand}
                            </span>

                            <div className="mt-6 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Brand Profile</span>
                                <ChevronRight className="w-3 h-3 text-blue-600" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Directory Stats */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <ShieldCheck className="w-6 h-6" />, label: "Audited Brands", value: "850+" },
                        { icon: <Award className="w-6 h-6" />, label: "Certification Gold", value: "142" },
                        { icon: <CheckCircle2 className="w-6 h-6" />, label: "Verified Facilities", value: "3.2k" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl border border-gray-50 flex items-center gap-6 shadow-sm">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
