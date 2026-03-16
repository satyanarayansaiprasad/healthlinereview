import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronRight, ShieldCheck, Zap, Heart, Search, Filter, ArrowRight, Award, CheckCircle2 } from 'lucide-react';

export default async function ProductReviewsIndex() {
    const reviews = await prisma.productReview.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="flex flex-col gap-12 md:gap-20 pb-20 bg-[#fbfcfd] font-sans">
            {/* Premium Hero Section */}
            <section className="bg-white border-b border-gray-100 pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden relative">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-[45%] h-full bg-blue-50/50 -skew-x-12 translate-x-1/4" />
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 -ml-32" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-20">
                        <div className="max-w-3xl text-center lg:text-left space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] border border-blue-100">
                                <Award className="w-4 h-4" />
                                Expert Tested & Human Verified
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                                Science-Backed <span className="text-blue-600">Product Reviews.</span>
                            </h1>

                            <p className="text-lg md:text-2xl text-gray-600 leading-relaxed font-medium max-w-2xl">
                                We peel back the labels and test the formulas. Unbiased, research-driven analysis to help you invest in what actually works for your health.
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-blue-600">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight">100% Honest<br />Assessments</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-emerald-500">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight">Direct Lab<br />Testing</span>
                                </div>
                            </div>
                        </div>

                        {/* Search/Filter Sidebar Feature Card */}
                        <div className="hidden lg:block w-96 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <Search className="w-5 h-5 text-blue-600" />
                                Find a Review
                            </h3>
                            <div className="space-y-4">
                                <div className="relative">
                                    <input type="text" placeholder="Search brands or products..." className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Protein', 'Vitamins', 'Skincare', 'Fat Burners'].map(cat => (
                                        <button key={cat} className="px-4 py-3 rounded-xl bg-white border border-gray-100 text-xs font-bold text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all text-left">
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-black transition-all">
                                    Browse All Categories
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Listing */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">Latest Expert Picks</h2>
                        <div className="h-1 w-20 bg-blue-600 rounded-full mt-3" />
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                        <span>SORT BY</span>
                        <select className="bg-transparent border-b-2 border-gray-100 focus:border-blue-500 outline-none pb-1 px-2 text-gray-900 text-sm cursor-pointer">
                            <option>Most Recent</option>
                            <option>Highest Rated</option>
                            <option>Trending</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {reviews.map((review, i) => (
                        <Link
                            key={review.id}
                            href={`/product-reviews/${review.slug}`}
                            className="group flex flex-col bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-500 overflow-hidden"
                        >
                            <div className="aspect-square relative bg-[#fdfefe] flex items-center justify-center p-12 group-hover:bg-white transition-colors">
                                <div className="absolute inset-0 bg-blue-50/10 group-hover:bg-transparent transition-colors" />

                                {/* Product Placeholder Visualization */}
                                <div className={`w-full h-full rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden transition-transform duration-700 group-hover:scale-105 ${i % 2 === 0 ? 'bg-gradient-to-br from-indigo-50 to-blue-50' : 'bg-gradient-to-br from-emerald-50 to-teal-50'
                                    }`}>
                                    <div className="text-6xl md:text-7xl filter grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                                        {i % 2 === 0 ? '💊' : '🧴'}
                                    </div>

                                    {/* Score Badge */}
                                    <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border-2 border-blue-600/10 group-hover:border-blue-600 transition-all">
                                        <span className="text-[10px] font-black text-blue-600 leading-none">SCORE</span>
                                        <span className="text-xl font-black text-gray-900 leading-none mt-1">{review.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 flex flex-col flex-grow">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, s) => (
                                            <Star key={s} className={`w-3.5 h-3.5 fill-current ${s >= Math.floor(review.rating) ? 'text-gray-200' : ''}`} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trust Index Verified</span>
                                </div>

                                <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-4 line-clamp-2">
                                    {review.productName}
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {review.pros?.slice(0, 2).map((pro, index) => (
                                        <span key={index} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            <CheckCircle2 className="w-3 h-3" /> {pro}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between text-blue-600 font-black text-[11px] uppercase tracking-[0.2em] group/btn">
                                    <span className="flex items-center gap-2 group-hover/btn:gap-3 transition-all">
                                        Full Analysis <ArrowRight className="w-4 h-4" />
                                    </span>
                                    <span className="text-gray-300 group-hover:text-gray-400">Jan 2026</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {reviews.length === 0 && (
                    <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Our experts are currently testing new products. Check back soon for our first wave of reviews.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
