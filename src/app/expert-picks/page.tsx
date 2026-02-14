import { Award, Star, ChevronRight, ExternalLink, ShieldCheck, CheckCircle2, Zap, Heart, Sparkles, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function ExpertPicksPage() {
    const picks = [
        {
            category: "Supplements",
            title: "Best Multivitamins for Men 2024",
            item: "Ritual Essential for Men",
            rating: 4.9,
            award: "TOP PICK",
            desc: "Our medical review board analyzed 50+ multivitamins. Ritual stands out for transparency and bioavailable ingredients.",
            stats: "Lab Purity: 99.8%"
        },
        {
            category: "Mental Health",
            title: "Top-Rated Meditation Apps",
            item: "Headspace",
            rating: 4.8,
            award: "BEST FOR BEGINNERS",
            desc: "Based on clinical studies and user performance, Headspace offers the most comprehensive guided meditations.",
            stats: "User Efficacy: 94%"
        },
        {
            category: "Nutrition",
            title: "Highest Quality Whey Proteins",
            item: "Transparent Labs Grass-Fed",
            rating: 4.9,
            award: "PURITY AWARD",
            desc: "Zero artificial sweeteners, third-party tested, and sourced from grass-fed cows for maximum nutrient density.",
            stats: "Heavy Metal Tested"
        }
    ];

    return (
        <div className="flex flex-col gap-12 md:gap-20 pb-20 bg-[#f8fafc] font-sans">
            {/* High-Impact Hero Section */}
            <section className="bg-white border-b border-gray-100 pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden relative">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-50/50 -skew-x-12 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-[100px] -ml-48 -mb-48" />

                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                        <div className="flex-1 space-y-10">
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 text-blue-600 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] border border-blue-100 animate-fade-in">
                                <Sparkles className="w-4 h-4 text-blue-500" />
                                2026 Certification Awards
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[1.05] tracking-tight">
                                Expert Picks. <br />
                                <span className="text-blue-600 italic">Science Backed.</span>
                            </h1>

                            <p className="text-lg md:text-2xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
                                Every product highlighted here has passed our rigorous medical review board and double-blind laboratory testing protocols.
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-blue-600 border border-gray-50">
                                        <ShieldCheck className="w-7 h-7" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Verified</p>
                                        <p className="text-sm font-bold text-gray-900 mt-1">Medical Review</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-emerald-500 border border-gray-50">
                                        <CheckCircle2 className="w-7 h-7" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Certified</p>
                                        <p className="text-sm font-bold text-gray-900 mt-1">Lab Purity</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block w-96 relative">
                            <div className="absolute inset-0 bg-blue-600 rounded-[3rem] rotate-6 scale-95 blur-2xl opacity-10" />
                            <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-2xl relative z-10">
                                <Award className="w-16 h-16 text-blue-100 absolute -top-4 -right-4 rotate-12" />
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black text-gray-900">Selection Criteria</h3>
                                    {[
                                        "Third-Party Lab Data",
                                        "Bioavailability Scores",
                                        "Manufacturing Standards",
                                        "Consumer Experience"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                {i + 1}
                                            </div>
                                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Award Picks Grid */}
            <section className="container mx-auto px-4 md:px-6 -mt-20 md:-mt-24 relative z-20">
                <div className="grid grid-cols-1 gap-12 md:gap-16">
                    {picks.map((pick, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 p-8 md:p-14 border border-gray-50 flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch hover:translate-y-[-8px] transition-all duration-500 group"
                        >
                            <div className="w-full lg:w-1/3 aspect-square bg-[#fcfdff] rounded-[2.5rem] flex items-center justify-center p-12 relative overflow-hidden">
                                <div className="absolute inset-0 bg-blue-50/20 group-hover:bg-transparent transition-colors" />

                                <div className="absolute top-6 left-6 z-10">
                                    <div className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase shadow-xl shadow-blue-600/30 group-hover:scale-110 transition-transform">
                                        {pick.award}
                                    </div>
                                </div>

                                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-[2rem] flex items-center justify-center text-8xl filter grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                                    {pick.category === 'Supplements' ? '💊' : pick.category === 'Mental Health' ? '🧠' : '🥗'}
                                </div>

                                <div className="absolute bottom-6 right-6">
                                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-[9px] font-black text-blue-600 border border-blue-50 shadow-sm uppercase tracking-widest">
                                        {pick.stats}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">{pick.category}</span>
                                        <div className="h-0.5 w-12 bg-blue-100" />
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                        {pick.title}
                                    </h2>
                                </div>

                                <div className="flex items-center gap-6 py-8 border-y border-gray-50">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, s) => <Star key={s} className="w-5 h-5 fill-current" />)}
                                    </div>
                                    <div className="h-6 w-px bg-gray-200" />
                                    <div className="flex items-center gap-3">
                                        <UserCheck className="w-5 h-5 text-gray-300" />
                                        <span className="text-sm font-black text-gray-900">{pick.rating} / 5.0</span>
                                    </div>
                                </div>

                                <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-medium italic">
                                    "{pick.desc}"
                                </p>

                                <div className="flex flex-wrap gap-5 pt-4">
                                    <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 transform active:scale-95">
                                        View Rankings <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:border-blue-600 hover:text-blue-600 transition-all transform active:scale-95">
                                        Lab Certificate <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Engagement */}
                <div className="mt-24 bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-600/10 group-hover:scale-150 transition-transform duration-1000" />
                    <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                        <Heart className="w-16 h-16 text-blue-500 mx-auto fill-current" />
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Trusted by over 10 Million monthly readers.</h2>
                        <p className="text-lg text-gray-400 font-medium">Our methodology is published annually and audited by external medical ethics boards.</p>
                        <button className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-blue-50 transition-all shadow-2xl">
                            Read Our Methodology
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
