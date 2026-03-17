import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { ShieldCheck, Star, ExternalLink, Activity, Info, AlertTriangle, CheckCircle2, TrendingUp, HelpCircle, ImageIcon } from 'lucide-react';

// --- Fetch Data ---
async function getReview(slug: string) {
    const review = await (prisma as any).productReview.findUnique({
        where: { slug },
        include: {
            author: { select: { name: true } },
            medicalReviewer: { select: { name: true, imageUrl: true, designation: true } },
            category: { select: { name: true, slug: true } }
        }
    });

    if (!review) notFound();
    return review;
}

// --- Dynamic SEO ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const review = await getReview(params.slug);
    return {
        title: review.metaTitle ?? `${review.productName} Review (2026) | HealthlineReview`,
        description: review.metaDescription ?? review.verdict ?? undefined,
        openGraph: {
            title: review.metaTitle ?? review.productName,
            description: review.metaDescription ?? review.verdict ?? undefined,
            type: 'article',
        }
    };
}

// --- Page Component ---
export default async function ProductReviewPage({ params }: { params: { slug: string } }) {
    const review = await getReview(params.slug);

    // Parse JSON arrays with fallbacks
    const pros = (review.pros as string[]) || [];
    const cons = (review.cons as string[]) || [];
    const detailedIngredients = (review.detailedIngredients as any[]) || [];
    const faqs = (review.faqs as any[]) || [];

    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans">
            {/* 1. Header & Hero */}
            <header className="bg-white pt-32 pb-12 md:pt-40 md:pb-16 border-b border-gray-100">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        
                        {/* Breadcrumbs / Tags */}
                         <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-gray-500">
                            {review.category && (
                                <>
                                    <span className="text-blue-600 uppercase tracking-widest text-[10px]">{review.category.name}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                </>
                            )}
                            <span className="uppercase tracking-widest text-[10px]">Product Review</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-gray-400">
                                Updated {new Date(review.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
                            {review.productName} Review: <span className="text-gray-600 font-bold">{review.verdict}</span>
                        </h1>

                        {/* Ratings & Buy Button Bar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 mt-6 border-t border-gray-100">
                             <div className="flex items-center gap-6">
                                {/* Rating block */}
                                <div className="flex items-center gap-3">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-6 h-6 ${i < Math.floor(review.rating) ? 'fill-current' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-2xl text-gray-900 leading-none">{review.rating.toFixed(1)}</span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Our Score</span>
                                    </div>
                                </div>
                             </div>

                             <div className="w-full sm:w-auto">
                                <a href={review.affiliateLink || '#'} target="_blank" rel="noopener noreferrer" 
                                    className="block w-full text-center bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2">
                                    Check Official Website <ExternalLink className="w-4 h-4" />
                                </a>
                             </div>
                        </div>

                        {/* Author/Reviewer Badge */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 mt-8">
                             <div className="flex items-center gap-3 pr-4 sm:border-r border-gray-200">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-xs">
                                    {review.author.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Author</p>
                                    <p className="font-bold text-gray-900 text-xs">{review.author.name}</p>
                                </div>
                            </div>
                            {review.medicalReviewer && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600">
                                          {review.medicalReviewer.imageUrl ? (
                                                <img src={review.medicalReviewer.imageUrl} alt={review.medicalReviewer.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="font-bold text-xs">{review.medicalReviewer.name.charAt(0)}</span>
                                            )}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" /> Medically Reviewed By
                                        </p>
                                        <p className="font-bold text-gray-900 text-xs">{review.medicalReviewer.name}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 md:px-6 py-12 space-y-16 max-w-4xl">
                
                {/* 2. Quick Overview Box (Consumer Health Digest signature layout) */}
                <section className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/40 overflow-hidden transform relative z-10 -mt-20">
                    <div className="bg-gray-900 p-6 flex items-center justify-between text-white">
                        <h2 className="text-xl font-black flex items-center gap-2">
                            <Activity className="w-6 h-6 text-blue-400" /> 
                            Quick Facts: {review.productName}
                        </h2>
                    </div>
                    
                    <div className="p-6 md:p-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 bg-white relative">
                        {review.featuredImage && (
                            <div className="absolute opacity-5 -right-10 -bottom-10 w-64 h-64 mix-blend-multiply pointer-events-none">
                                <img src={review.featuredImage} alt="background" className="w-full h-full object-contain" />
                            </div>
                        )}

                        <div className="space-y-1 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1"><Info className="w-3 h-3"/> Brand</span>
                            <p className="font-bold text-gray-900">{review.brand || 'N/A'}</p>
                        </div>
                        <div className="space-y-1 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1"><Info className="w-3 h-3"/> Form</span>
                            <p className="font-bold text-gray-900">{review.form || 'N/A'}</p>
                        </div>
                        <div className="space-y-1 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Price</span>
                            <p className="font-black text-gray-900 text-lg">{review.price || 'Check Website'}</p>
                        </div>
                        <div className="space-y-1 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Guarantee</span>
                            <p className="font-bold text-gray-900">{review.guarantee || 'N/A'}</p>
                        </div>
                        <div className="sm:col-span-2 space-y-1 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Side Effects</span>
                            <p className="font-bold text-gray-900">{review.sideEffects || 'None reported'}</p>
                        </div>
                    </div>
                </section>

                {/* 3. Pros & Cons Split */}
                {(pros.length > 0 || cons.length > 0) && (
                    <section className="grid md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 h-full">
                            <h3 className="font-black text-2xl text-emerald-900 mb-6 flex items-center gap-3">
                                <span className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><CheckCircle2 className="w-6 h-6" /></span>
                                Pros
                            </h3>
                            <ul className="space-y-4">
                                {pros.map((pro, i) => (
                                    <li key={i} className="flex gap-3 text-emerald-900 font-medium leading-relaxed">
                                        <span className="text-emerald-500 font-black mt-[-2px]">+</span> {pro}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100 h-full">
                           <h3 className="font-black text-2xl text-red-900 mb-6 flex items-center gap-3">
                                <span className="bg-red-100 text-red-600 p-2 rounded-xl"><AlertTriangle className="w-6 h-6" /></span>
                                Cons
                            </h3>
                            <ul className="space-y-4">
                                {cons.map((con, i) => (
                                    <li key={i} className="flex gap-3 text-red-900 font-medium leading-relaxed">
                                        <span className="text-red-500 font-black mt-[-2px]">-</span> {con}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}

                {/* 4. Deep Dive Content Sections */}
                <div className="space-y-16">
                    
                    {review.description && (
                        <section className="prose prose-lg prose-blue max-w-none">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 border-b pb-4">What is {review.productName}?</h2>
                            <p className="text-gray-600 font-medium leading-relaxed bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm leading-[1.8]">
                                {review.description}
                            </p>
                        </section>
                    )}

                    {review.workingMechanism && (
                        <section className="prose prose-lg prose-blue max-w-none">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 border-b pb-4">How Does It Work?</h2>
                            <p className="text-gray-600 font-medium leading-relaxed bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm leading-[1.8]">
                                {review.workingMechanism}
                            </p>
                        </section>
                    )}

                    {review.safetyInfo && (
                        <section className="prose prose-lg prose-blue max-w-none">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 border-b pb-4 flex items-center gap-3">
                                <ShieldCheck className="w-8 h-8 text-blue-600" />
                                Safety & Side Effects
                            </h2>
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                                <p className="text-gray-600 font-medium leading-[1.8]">
                                    {review.safetyInfo}
                                </p>
                                {review.warnings && (
                                    <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                                        <p className="text-yellow-800 font-bold text-sm m-0">
                                            <strong>Warning:</strong> {review.warnings}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Benefits Section - Dynamic */}
                    {Array.isArray(review.benefitsList) && review.benefitsList.length > 0 && (
                        <section className="prose prose-lg prose-blue max-w-none">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 border-b pb-4">Key Benefits</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {review.benefitsList.map((benefit: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <p className="font-bold text-gray-900 m-0">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Ingredients Section - Dynamic */}
                    {detailedIngredients.length > 0 && (
                        <section className="prose prose-lg prose-blue max-w-none">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 border-b pb-4">Ingredient Analysis</h2>
                            <div className="grid gap-4">
                                {detailedIngredients.map((ingredient: any, i: number) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h4 className="text-lg font-black text-blue-600 mb-1">{ingredient.name || ingredient.title}</h4>
                                        <p className="text-gray-600 font-medium text-sm">{ingredient.description || ingredient.benefit || ingredient.content}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Pricing & Offers Section - Dynamic */}
                    {(review.pricingOffers as any[] || []).length > 0 && (
                        <section className="prose prose-lg prose-blue max-w-none">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 border-b pb-4">Pricing & Availability</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {(review.pricingOffers as any[] || []).map((offer: any, i: number) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group hover:border-blue-200 transition-colors">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Package</p>
                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{offer.name}</h4>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Price</p>
                                            <p className="font-black text-blue-600 text-lg">{offer.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* FAQs Section - Dynamic */}
                    {faqs.length > 0 && (
                        <section className="prose prose-lg prose-blue max-w-none">
                            <h2 className="text-3xl font-black text-gray-900 mb-6 border-b pb-4">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {faqs.map((faq: any, i: number) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">Q. {faq.question}</h4>
                                        <p className="text-gray-600 font-medium leading-relaxed italic border-l-2 border-blue-50 pl-4">
                                            "{faq.answer}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Final CTA Box */}
                    <section className="bg-gray-900 text-white rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />
                        
                        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to try {review.productName}?</h2>
                                {review.recommendation && (
                                    <p className="text-gray-300 font-medium text-lg">
                                        {review.recommendation}
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex flex-col items-center gap-4">
                                <a href={review.affiliateLink || '#'} target="_blank" rel="noopener noreferrer" 
                                    className="bg-blue-600 text-white px-10 py-5 rounded-xl font-black text-lg hover:bg-blue-700 transition w-full sm:w-auto shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3">
                                    Visit Official Store <ExternalLink className="w-5 h-5" />
                                </a>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    Secure Checkout • 100% Guaranteed 
                                </p>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
