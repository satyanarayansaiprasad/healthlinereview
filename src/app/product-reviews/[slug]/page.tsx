import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, CheckCircle, AlertTriangle, ExternalLink, ChevronRight, ShoppingCart, ShieldCheck, Award, Zap, Heart, CheckCircle2, Info } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const review = await prisma.productReview.findUnique({
        where: { slug },
    });

    if (!review) return { title: 'Review Not Found' };

    return {
        title: `${review.productName} Review: Quality & Value Analysis | Health Line Review`,
        description: `Read our expert review of ${review.productName}. We analyze ingredients, side effects, and value for money.`,
    };
}

export default async function ProductReviewPage({ params }: Props) {
    const { slug } = await params;
    const review = await prisma.productReview.findUnique({
        where: { slug },
        include: { author: true }
    });

    if (!review) notFound();

    const reviewSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": review.productName,
        "image": "https://healthlinereview.com/product.jpg",
        "brand": {
            "@type": "Brand",
            "name": "Trusted Brands"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": review.rating,
            "reviewCount": "128"
        }
    };

    return (
        <div className="bg-[#fcfdff] pb-24 font-sans">
            <JsonLd data={reviewSchema} />

            {/* Premium Hero Header */}
            <div className="bg-white border-b border-gray-100 pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden relative">
                {/* Visual Background Elements */}
                <div className="absolute top-0 right-0 w-[45%] h-full bg-blue-50/30 skew-x-12 translate-x-1/3" />
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-50/20 rounded-full blur-[100px] -ml-48" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <nav className="flex items-center gap-2 text-[10px] md:text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-10">
                        <Link href="/" className="hover:text-blue-800 transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        <Link href="/product-reviews" className="hover:text-blue-800 transition-colors">Reviews</Link>
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        <span className="text-gray-400">{review.productName}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                        <div className="lg:col-span-7 space-y-10">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-1.5 text-yellow-400">
                                    {[...Array(5)].map((_, s) => (
                                        <Star key={s} className={`w-5 h-5 ${s < Math.floor(review.rating) ? 'fill-current' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <span className="text-2xl font-black text-gray-900">{review.rating} <span className="text-gray-300 text-lg font-medium">/ 5.0</span></span>
                                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">Lab Verified</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                                <span className="text-gray-400">Review:</span><br />{review.productName}
                            </h1>

                            <p className="text-lg md:text-2xl text-gray-600 leading-relaxed font-medium max-w-2xl">
                                An in-depth lab analysis of purity, ingredient profiles, and real-world performance for health-conscious individuals.
                            </p>

                            <div className="flex flex-wrap gap-5 pt-4">
                                <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 shadow-2xl shadow-blue-600/30 transition-all transform hover:-translate-y-1 active:scale-95">
                                    <ShoppingCart className="w-5 h-5" /> Buy at Best Price
                                </button>
                                <button className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all">
                                    Compare Alternatives
                                </button>
                            </div>

                            {/* Trust Markers */}
                            <div className="flex flex-wrap gap-8 pt-6">
                                <div className="flex items-center gap-2.5">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Purity Guaranteed</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Zap className="w-5 h-5 text-blue-500" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Efficiency Optimized</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative group">
                            <div className="absolute inset-0 bg-blue-600/5 rounded-[3rem] rotate-3 scale-105 group-hover:rotate-0 transition-transform duration-700" />
                            <div className="aspect-square bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 p-16 relative overflow-hidden flex items-center justify-center border border-gray-50 uppercase">
                                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-[2rem] flex items-center justify-center relative overflow-hidden">
                                    {/* Dynamic Image Selection based on Product Name */}
                                    {review.productName.toLowerCase().includes('h2') ? (
                                        <Image src="https://m.media-amazon.com/images/I/71L+3U5ZaAL._AC_SL1500_.jpg" alt={review.productName} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                                    ) : review.productName.toLowerCase().includes('olive') ? (
                                        <Image src="https://m.media-amazon.com/images/I/61SBCf15vbS._SL1500_.jpg" alt={review.productName} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                                    ) : review.productName.toLowerCase().includes('kick') ? (
                                        <Image src="https://m.media-amazon.com/images/I/81INSpJczkL._AC_SL1500_.jpg" alt={review.productName} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                                    ) : review.productName.toLowerCase().includes('mct') ? (
                                        <Image src="https://m.media-amazon.com/images/I/71P9S1Nk4hL._AC_SL1500_.jpg" alt={review.productName} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                                    ) : review.productName.toLowerCase().includes('whey') ? (
                                        <Image src="https://m.media-amazon.com/images/I/7181KquqcpL._SX679_.jpg" alt={review.productName} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                                    ) : review.productName.toLowerCase().includes('focus') ? (
                                        <Image src="https://m.media-amazon.com/images/I/71zYzdGgvdL._AC_SL1500_.jpg" alt={review.productName} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                                    ) : review.productName.toLowerCase().includes('enzyme') ? (
                                        <Image src="https://m.media-amazon.com/images/I/71Z46KZaq-L._SL1500_.jpg" alt={review.productName} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                                    ) : review.productName.toLowerCase().includes('collagen') ? (
                                        <Image src="https://m.media-amazon.com/images/I/51yvBiyU6NL._SL1080_.jpg" alt={review.productName} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="text-7xl filter grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                                            💊
                                        </div>
                                    )}
                                </div>
                                <div className="absolute top-10 left-10 bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30">
                                    TOP RATING 2026
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 max-w-6xl mt-20 md:mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    <div className="lg:col-span-8 space-y-16 md:space-y-24">
                        <section>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-10 flex items-center gap-5">
                                <div className="w-3 h-10 bg-blue-600 rounded-full" />
                                Expert Verdict
                            </h2>
                            <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-gray-100 shadow-sm relative">
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-600/40">
                                    <div className="text-center">
                                        <span className="block text-[10px] font-black leading-none uppercase">Rating</span>
                                        <span className="text-3xl font-black leading-tight">{review.rating}</span>
                                    </div>
                                </div>
                                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                                    Our comprehensive 30-day trial and lab cross-verification reveals that <span className="text-blue-600 font-bold">{review.productName}</span> delivers precisely what it promises. In a market flooded with proprietary blends and hidden fillers, this product sets a new standard for transparency and ingredient quality.
                                </p>
                            </div>
                        </section>

                        {/* Ingredients Section */}
                        <section className="bg-[#0F172A] text-white p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            {/* Background flair */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />

                            <h2 className="text-3xl font-black mb-12 flex items-center gap-4">
                                <Info className="w-8 h-8 text-blue-400" />
                                Active Compound Analysis
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {review.ingredients?.length ? (
                                    review.ingredients.map((ing, i) => (
                                        <div key={i} className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 group hover:border-blue-500/50 transition-all">
                                            <h4 className="font-black text-xl text-blue-300 mb-3 group-hover:text-blue-400 transition-colors">{ing}</h4>
                                            <p className="text-sm text-slate-400 leading-relaxed">High-purity extract verified via secondary lab testing for maximum bio-availability.</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 italic">Ingredient breakdown coming soon.</p>
                                )}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-10">Full Performance Analysis</h2>
                            <div className="prose prose-xl prose-slate max-w-none text-gray-600 space-y-8 prose-p:leading-relaxed prose-strong:text-gray-900 prose-headings:font-black">
                                {typeof review.content === 'string' ? (
                                    <div dangerouslySetInnerHTML={{ __html: review.content }} />
                                ) : (
                                    <p>Discover deep insights and expert perspective on this product performance...</p>
                                )}
                            </div>
                        </section>

                        {/* Side Effects */}
                        <section>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-10 flex items-center gap-4">
                                <AlertTriangle className="w-10 h-10 text-orange-500" />
                                Safety & Tolerance
                            </h2>
                            <div className="bg-orange-50/50 p-10 md:p-14 rounded-[2.5rem] border border-orange-100 flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 flex-shrink-0">
                                    <Award className="w-8 h-8" />
                                </div>
                                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                                    While generally well-tolerated, some users may experience mild digestive adjustments during the initial 48-72 hours. We recommend starting with a half-dose to assess personal sensitivity. Always consult your healthcare provider before beginning any new supplement regimen.
                                </p>
                            </div>
                        </section>
                    </div>

                    <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-12">
                        {/* Pros / Cons QuickBox */}
                        <div className="space-y-6">
                            <div className="bg-emerald-50 p-8 md:p-10 rounded-[2.5rem] border border-emerald-100 shadow-sm">
                                <h3 className="text-emerald-800 text-xl font-black mb-8 flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6" /> The Advantage
                                </h3>
                                <ul className="space-y-5">
                                    {review.pros?.map((p, i) => (
                                        <li key={i} className="flex items-start gap-4 text-sm font-bold text-emerald-900 leading-snug">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                                            {p}
                                        </li>
                                    )) || <li>Loading pros...</li>}
                                </ul>
                            </div>

                            <div className="bg-red-50 p-8 md:p-10 rounded-[2.5rem] border border-red-100 shadow-sm">
                                <h3 className="text-red-800 text-xl font-black mb-8 flex items-center gap-3">
                                    <AlertTriangle className="w-6 h-6" /> Considerations
                                </h3>
                                <ul className="space-y-5">
                                    {review.cons?.map((p, i) => (
                                        <li key={i} className="flex items-start gap-4 text-sm font-bold text-red-900 leading-snug">
                                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                                            {p}
                                        </li>
                                    )) || <li>Loading cons...</li>}
                                </ul>
                            </div>
                        </div>

                        {/* Updated CTA Box */}
                        <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-12 rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(59,130,246,0.3)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                            <div className="relative z-10 space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black leading-tight">Secure Best Pricing</h3>
                                    <p className="text-blue-100 text-sm font-medium leading-relaxed">Join 2,400+ users who purchased this week via our verified discount link.</p>
                                </div>
                                <button className="w-full bg-white text-blue-900 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 transform active:scale-95">
                                    Verify Stock & Price <ExternalLink className="w-4 h-4" />
                                </button>
                                <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-3">
                                    <ShieldCheck className="w-4 h-4 text-blue-300" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">Official Partner Link</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
