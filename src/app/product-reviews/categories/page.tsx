import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight, Activity, Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AllCategories() {
    const categories = await prisma.reviewCategory.findMany({
        orderBy: {
            name: 'asc'
        }
    });

    return (
        <div className="flex flex-col gap-20 pb-32 bg-[#fbfcfd] font-sans">
            {/* Minimal High-End Hero */}
            <section className="bg-white pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden relative border-b border-gray-100">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/30 skew-x-12 translate-x-1/2" />
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-4xl space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] border border-blue-100">
                            <Activity className="w-4 h-4" />
                            Clinical Review Directory
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-gray-900 leading-[1.1] tracking-tighter">
                            Browse All <br />
                            <span className="text-blue-600 italic">Categories.</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-600 leading-relaxed font-medium max-w-2xl">
                            Our comprehensive directory of health and wellness product categories, each vetted by our medical review board.
                        </p>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 md:px-6">
                {categories.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
                        <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-gray-900">No categories indexed yet.</h2>
                        <p className="text-gray-500 font-medium mt-2">Check back soon for our latest clinical reviews.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/product-reviews?category=${cat.slug}`}
                                className="group relative overflow-hidden bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col gap-8 transform hover:-translate-y-2"
                            >
                                <div className="w-full aspect-video relative rounded-[2rem] overflow-hidden border border-gray-100 group-hover:scale-[1.02] transition-transform duration-700">
                                    <Image
                                        src={cat.imageUrl}
                                        alt={cat.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
                                    />
                                    {cat.isStarred && (
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl border border-white/50 text-[10px] font-black uppercase tracking-widest text-blue-600">
                                            Hand-Picked
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{cat.name}</h3>
                                        <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-widest">Medical Review Access Available</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-45">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Support CTA */}
            <section className="container mx-auto px-4 md:px-6 max-w-5xl">
                <div className="bg-gray-900 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/newsletter-couple.png"
                            alt="Background"
                            fill
                            className="object-cover opacity-20 group-hover:scale-110 transition-transform duration-[5s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/60 to-gray-900" />
                    </div>

                    <div className="relative z-10 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Can&apos;t find a category?</h2>
                            <p className="text-lg text-gray-400 font-medium max-w-xl mx-auto italic">&quot;Our research team is constantly expanding our clinical directory. Let us know what you&apos;re looking for.&quot;</p>
                        </div>
                        <Link href="/contact-us" className="inline-block px-12 py-8 bg-white text-gray-900 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 hover:text-white shadow-2xl transition-all hover:scale-105 active:scale-95">
                            Request Clinical Analysis
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
