import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Award, CheckCircle2, ChevronRight, ShieldCheck, Star, ExternalLink, Activity, Target, Zap, ImageIcon, Plus, X } from 'lucide-react';
import Link from 'next/link';

// --- Fetch Data ---
async function getGuide(slug: string) {
    const guide = await (prisma as any).expertPicksGuide.findUnique({
        where: { slug },
        include: {
            author: { select: { name: true } },
            medicalReviewer: { select: { name: true, imageUrl: true, designation: true } },
            products: {
                orderBy: { rank: 'asc' }
            }
        }
    });

    if (!guide) notFound();
    return guide;
}

// --- Dynamic SEO ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const guide = await getGuide(params.slug);
    return {
        title: guide.metaTitle ?? `${guide.title} | Expert Picks`,
        description: guide.metaDescription ?? guide.description ?? undefined,
        openGraph: {
            title: guide.metaTitle ?? guide.title,
            description: guide.metaDescription ?? guide.description ?? undefined,
            type: 'article',
        }
    };
}

// --- Page Component ---
export default async function ExpertPickGuidePage({ params }: { params: { slug: string } }) {
    const guide = await getGuide(params.slug);

    // Parse JSON arrays with fallbacks - Ensure strictly dynamic data usage
    const howWeRanked = Array.isArray(guide.howWeRanked) ? guide.howWeRanked : [];
    const faqs = Array.isArray(guide.faqs) ? guide.faqs : [];
    const finalVerdict = (guide.finalVerdict as any) || null;
    const buyingGuide = (guide.buyingGuide as any) || null;

    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans scroll-smooth">
            {/* 1. Hero Section */}
            <header className="bg-white pt-32 pb-16 md:pt-40 md:pb-24 border-b border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-50/50 -skew-x-12 translate-x-1/2" />
                
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center lg:text-left">
                    <div className="max-w-4xl mx-auto lg:mx-0 space-y-8">
                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">
                                Expert Picks 2026
                            </span>
                            <span className="text-gray-400 text-sm font-bold">
                                Updated {new Date(guide.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>

                        {/* Title & Concept */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                            {guide.title}
                        </h1>
                        
                        {guide.description && (
                            <p className="text-lg md:text-2xl text-gray-600 leading-relaxed font-medium">
                                {guide.description}
                            </p>
                        )}

                        {/* Trust Badges - Author & Reviewer */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 uppercase">
                                    {guide.author.name.charAt(0)}
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Written By</p>
                                    <p className="font-bold text-gray-900">{guide.author.name}</p>
                                </div>
                            </div>

                            {guide.medicalReviewer && (
                                <>
                                    <div className="hidden sm:block w-px h-10 bg-gray-200" />
                                    <div className="flex items-center gap-3 bg-blue-50/50 pr-6 rounded-full border border-blue-100">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                            {guide.medicalReviewer.imageUrl ? (
                                                <img src={guide.medicalReviewer.imageUrl} alt={guide.medicalReviewer.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                                                    {guide.medicalReviewer.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-left py-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3" /> Medically Reviewed
                                            </p>
                                            <p className="font-bold text-gray-900 text-sm">{guide.medicalReviewer.name}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 md:px-6 py-16 lg:py-24 space-y-24">
                
                {/* 2. Quick Summary Table */}
                {guide.products.length > 0 && (
                    <section className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
                            <div className="bg-gray-900 text-white p-6 md:p-8 flex items-center gap-4">
                                <Award className="w-8 h-8 text-yellow-400" />
                                <div>
                                    <h2 className="text-2xl font-black">Top Picks Summary</h2>
                                    <p className="text-sm font-medium text-gray-400">Our highest-rated selections</p>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {guide.products.map((product: any, i: number) => (
                                    <div key={product.id} className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-gray-50 transition-colors">
                                        <div className="w-12 h-12 shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-xl">
                                            #{product.rank}
                                        </div>
                                        {product.productImage && (
                                            <div className="w-20 h-20 shrink-0 bg-white border border-gray-100 rounded-xl relative overflow-hidden">
                                                <img src={product.productImage} alt={product.productName} className="object-cover w-full h-full p-2" />
                                            </div>
                                        )}
                                        <div className="flex-1 text-center md:text-left space-y-1">
                                            {product.award && (
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                                                    {product.award}
                                                </span>
                                            )}
                                            <h3 className="text-lg font-bold text-gray-900">{product.productName}</h3>
                                            {product.shortHighlight && (
                                                <p className="text-sm text-gray-500 font-medium">{product.shortHighlight}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-yellow-400">
                                                <Star className="w-5 h-5 fill-current" />
                                            </div>
                                            <span className="font-black text-gray-900">{product.rating.toFixed(1)}</span>
                                        </div>
                                        <div className="shrink-0 w-full md:w-auto">
                                            <Link href={`#product-${product.rank}`} className="block w-full text-center border-2 border-blue-600 text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition text-sm">
                                                Read Review
                                            </Link>
                                        </div>
                                        <div className="shrink-0 w-full md:w-auto">
                                            <a href={product.buyLink || '#'} target="_blank" rel="noopener noreferrer" 
                                               className="block w-full text-center bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition text-sm">
                                                Shop Official
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. Detailed Product Cards */}
                <section className="max-w-4xl mx-auto space-y-16">
                    <h2 className="text-3xl font-black text-center mb-12">Expert Analysis & Reviews</h2>
                    
                    {guide.products.map((product: any) => (
                        <div key={product.id} id={`product-${product.rank}`} className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden flex flex-col pt-8 relative scroll-mt-32 md:scroll-mt-40">
                            {/* Rank Badge */}
                            <div className="absolute top-0 left-8 -translate-y-1/2 bg-gray-900 text-white px-6 py-2 rounded-full font-black flex items-center gap-2 border-4 border-[#f8fafc]">
                                <span className="text-yellow-400">#</span>{product.rank}
                            </div>
                            
                            {product.award && (
                                <div className="absolute top-6 right-6 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
                                    {product.award}
                                </div>
                            )}

                            <div className="p-8 md:p-10 space-y-8">
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-full md:w-1/3 aspect-square bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-6">
                                        {product.productImage ? (
                                            <img src={product.productImage} alt={product.productName} className="w-full h-full object-contain mix-blend-multiply" />
                                        ) : (
                                            <div className="text-gray-300 flex flex-col items-center gap-2">
                                                <ImageIcon className="w-12 h-12" />
                                                <span className="text-xs font-bold uppercase tracking-widest">No Image</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <h3 className="text-3xl font-black text-gray-900 leading-tight mb-3">
                                                {product.productName}
                                            </h3>
                                            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                                <div className="flex items-center gap-1 text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                                <span className="font-black text-gray-900">{product.rating.toFixed(1)} / 5</span>
                                            </div>
                                        </div>

                                        {product.highlights.length > 0 && (
                                            <ul className="space-y-3">
                                                {product.highlights.map((highlight: string, idx: number) => (
                                                    <li key={idx} className="flex items-start gap-3 text-gray-600 font-medium">
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                                        <span>{highlight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
                                    <div className="bg-white p-6 space-y-4">
                                        <h4 className="font-black text-emerald-600 uppercase tracking-widest text-sm flex items-center gap-2">
                                            <Plus className="w-4 h-4" /> Pros
                                        </h4>
                                        <ul className="space-y-3">
                                            {product.pros.map((pro: string, idx: number) => (
                                                <li key={idx} className="text-sm font-medium text-gray-600 flex items-start gap-2">
                                                    <span className="text-emerald-500 font-bold block mt-[-2px]">+</span> {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-white p-6 space-y-4">
                                        <h4 className="font-black text-red-500 uppercase tracking-widest text-sm flex items-center gap-2">
                                            <div className="w-4 h-0.5 bg-current" /> Cons
                                        </h4>
                                        <ul className="space-y-3">
                                            {product.cons.map((con: string, idx: number) => (
                                                <li key={idx} className="text-sm font-medium text-gray-600 flex items-start gap-2">
                                                    <span className="text-red-400 font-bold block mt-[-2px]">-</span> {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                                    <div className="text-center sm:text-left">
                                        {product.price && (
                                            <p className="font-black text-2xl text-gray-900">{product.price}</p>
                                        )}
                                    </div>
                                    <a href={product.buyLink || '#'} target="_blank" rel="noopener noreferrer" 
                                       className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
                                        Check Official Website <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* 4. Methodology Section - Strictly Dynamic */}
                {howWeRanked.length > 0 && (
                    <section className="max-w-4xl mx-auto">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-200">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 border-b pb-4">Our Methodology</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                {howWeRanked.map((criteria: any, i: number) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-black flex items-center justify-center shrink-0">
                                            {i + 1}
                                        </div>
                                        <p className="text-gray-700 font-bold text-sm mt-1">
                                            {typeof criteria === 'string' ? criteria : (criteria.title || criteria.name || JSON.stringify(criteria))}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 4.5 Ingredients Analysis - Strictly Dynamic */}
                {Array.isArray(guide.ingredientsAnalysis) && (guide.ingredientsAnalysis as any[]).length > 0 && (
                    <section className="max-w-4xl mx-auto">
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-200">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 border-b pb-4">Key Ingredients to Look For</h2>
                            <div className="grid gap-6">
                                {(guide.ingredientsAnalysis as any[]).map((ingredient: any, i: number) => (
                                    <div key={i} className="flex flex-col md:flex-row md:items-center gap-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                        <div className="flex-1 space-y-1">
                                            <h3 className="text-lg font-black text-blue-600">{ingredient.name}</h3>
                                            <p className="text-gray-600 font-medium">{ingredient.benefit}</p>
                                        </div>
                                        {ingredient.rating && (
                                            <div className="shrink-0 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">Expert Rating</span>
                                                <span className="font-bold text-gray-900">{ingredient.rating}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 5. Buying Guide - Strictly Dynamic */}
                {buyingGuide && (
                    <section className="max-w-4xl mx-auto bg-blue-50/50 p-8 md:p-12 rounded-[2rem] border border-blue-100">
                        <h2 className="text-2xl font-black text-gray-900 mb-8 text-center uppercase tracking-widest">Buying Guide</h2>
                        <div className="grid md:grid-cols-2 gap-12">
                            {buyingGuide.whatToLookFor && (
                                <div>
                                    <h3 className="text-emerald-700 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> What to Look For
                                    </h3>
                                    <ul className="space-y-4">
                                        {Array.isArray(buyingGuide.whatToLookFor) && buyingGuide.whatToLookFor.map((item: string, i: number) => (
                                            <li key={i} className="text-sm font-medium text-gray-700 flex items-start gap-2 bg-white/50 p-3 rounded-xl border border-emerald-50">
                                                <span className="text-emerald-500 font-bold">✓</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {buyingGuide.whatToAvoid && (
                                <div>
                                    <h3 className="text-red-700 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                                        <X className="w-4 h-4" /> What to Avoid
                                    </h3>
                                    <ul className="space-y-4">
                                        {Array.isArray(buyingGuide.whatToAvoid) && buyingGuide.whatToAvoid.map((item: string, i: number) => (
                                            <li key={i} className="text-sm font-medium text-gray-700 flex items-start gap-2 bg-white/50 p-3 rounded-xl border border-red-50">
                                                <span className="text-red-500 font-bold">✕</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* 6. FAQs - Strictly Dynamic */}
                {faqs.length > 0 && (
                    <section className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-black text-center mb-12">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqs.map((faq: any, i: number) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200">
                                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-start gap-3">
                                        <span className="text-blue-600 font-black shrink-0">Q.</span> {faq.question}
                                    </h4>
                                    <p className="text-gray-600 font-medium pl-8 border-l-2 border-blue-50 leading-relaxed italic">
                                        "{faq.answer}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 7. Final Verdict - Strictly Dynamic */}
                {finalVerdict && (
                    <section className="max-w-4xl mx-auto bg-gray-900 text-white p-8 md:p-16 rounded-[3rem] text-center space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/40 rounded-full blur-[80px]" />
                        
                        <div className="relative z-10 space-y-6">
                            <Award className="w-20 h-20 text-yellow-400 mx-auto" />
                            <h2 className="text-4xl font-black uppercase tracking-tighter">Final Verdict</h2>
                            <p className="text-xl text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto">
                                {typeof finalVerdict === 'string' ? finalVerdict : (finalVerdict.summary || finalVerdict.summaryText || finalVerdict.text || "")}
                            </p>
                            {finalVerdict.winner && (
                                <div className="inline-block bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 mt-4">
                                    <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Editor's Choice</p>
                                    <p className="text-2xl font-black">{finalVerdict.winner}</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
