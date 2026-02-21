import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    ChevronLeft, Share2,
    ShieldCheck, CheckCircle2, MessageSquare, Anchor,
    CheckCircle, XCircle, ArrowRight, Star, Link as LinkIcon
} from 'lucide-react';
import ShareButtons from '@/components/supplements/ShareButtons';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supplement = await prisma.supplement.findUnique({
        where: { slug }
    });

    if (!supplement) return { title: 'Post Not Found' };

    return {
        title: `${supplement.metaTitle || supplement.title} | Health Line Review`,
        description: supplement.metaDescription || supplement.subtitle || '',
    };
}

export default async function SupplementDetailPage({ params }: Props) {
    const { slug } = await params;
    const supplement = await prisma.supplement.findUnique({
        where: { slug },
        include: { author: true }
    });

    if (!supplement) notFound();

    // Fetch related articles from Health Topics (limit 3)
    const relatedArticles = await prisma.article.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { category: true }
    });

    // Fetch an ad (inline placement)
    const ad = await prisma.ad.findFirst({
        where: { placement: 'INLINE', isActive: true }
    });

    const faqs = (supplement.faqs as any[]) || [];
    const sources = (supplement.sources as any[]) || [];
    const content = (supplement.content as any) || {};

    return (
        <article className="min-h-screen bg-[#fcfdff] pb-24">
            {/* Header / Hero */}
            <header className="bg-white border-b border-gray-100 pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/30 -skew-x-12 translate-x-1/2" />

                <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
                    <Link href="/supplements" className="inline-flex items-center text-blue-600 font-bold mb-10 hover:gap-2 transition-all group">
                        <ChevronLeft className="w-5 h-5" /> Back to Supplements
                    </Link>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100 flex items-center gap-2">
                                <Star className="w-3.5 h-3.5 fill-white" /> Ranking {supplement.rank}/100
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                            {supplement.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl leading-relaxed">
                            {supplement.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 py-10 border-t border-gray-100 mt-12">
                            {/* Author Card */}
                            <div className="flex items-center gap-4 bg-gray-50/50 p-3 pr-6 rounded-2xl border border-gray-100 w-fit">
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                    <img src={supplement.author.imageUrl} alt={supplement.author.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900 leading-tight">{supplement.author.name}</p>
                                    <div className="flex items-center gap-1.5 text-blue-500 mt-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 fill-current text-white" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{supplement.author.designation}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 text-[11px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-blue-500" /> Medically Reviewed
                                </div>
                                <div className="flex items-center gap-2">
                                    Updated {new Date(supplement.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 md:px-6 max-w-5xl mt-16 md:mt-24">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sticky Sidebar */}
                    <aside className="lg:w-16 order-2 lg:order-1">
                        <ShareButtons title={supplement.title} />
                    </aside>

                    {/* Content Section */}
                    <div className="flex-1 order-1 lg:order-2 space-y-16">
                        {/* Featured Image */}
                        {supplement.featuredImage && (
                            <div className="rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-50 border border-gray-50">
                                <img src={supplement.featuredImage} alt={supplement.title} className="w-full h-auto" />
                            </div>
                        )}

                        {/* Main Overview Body */}
                        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-50 prose prose-lg prose-slate max-w-none prose-headings:text-gray-900 prose-headings:font-black prose-p:text-gray-600 prose-p:leading-relaxed">
                            <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <span className="w-2 h-8 bg-blue-600 rounded-full" /> Full Analysis & Efficacy
                            </h2>
                            <div className="whitespace-pre-wrap font-medium text-gray-700 leading-relaxed text-lg">
                                {content.overview}
                            </div>
                        </div>

                        {/* Advertisement Slot */}
                        {ad && (
                            <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center space-y-4">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Advertisement</span>
                                <div dangerouslySetInnerHTML={{ __html: ad.scriptCode }} />
                            </div>
                        )}

                        {/* Conclusion Section */}
                        {supplement.conclusion && (
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl shadow-blue-200">
                                <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                                    <CheckCircle className="w-8 h-8 text-blue-200" /> Final Verdict
                                </h2>
                                <p className="text-xl md:text-2xl font-medium leading-relaxed text-blue-50">
                                    {supplement.conclusion}
                                </p>
                            </div>
                        )}

                        {/* FAQs Section */}
                        {faqs.length > 0 && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                                    <MessageSquare className="w-8 h-8 text-orange-500" /> Frequently Asked Questions
                                </h2>
                                <div className="space-y-4">
                                    {faqs.map((faq, i) => (
                                        <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                            <h4 className="text-xl font-black text-gray-900 mb-4">{faq.question}</h4>
                                            <p className="text-gray-600 leading-relaxed font-medium">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sources Section */}
                        {sources.length > 0 && (
                            <div className="pt-16 border-t border-gray-100">
                                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-8">
                                    <Anchor className="w-6 h-6 text-purple-500" /> Scientific Resources
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {sources.map((src, i) => (
                                        <a
                                            key={i}
                                            href={src.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all flex items-center justify-between group"
                                        >
                                            <span className="truncate">{src.label}</span>
                                            <LinkIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Helpful Widget */}
                        {supplement.isHelpfulActive && (
                            <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl shadow-blue-50 text-center space-y-8">
                                <h3 className="text-2xl font-black text-gray-900">Was this analysis helpful?</h3>
                                <div className="flex justify-center gap-6">
                                    <button className="flex items-center gap-3 px-10 py-4 bg-green-50 text-green-600 rounded-full font-black text-lg hover:bg-green-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg shadow-green-100">
                                        <CheckCircle className="w-6 h-6" /> Yes
                                    </button>
                                    <button className="flex items-center gap-3 px-10 py-4 bg-red-50 text-red-600 rounded-full font-black text-lg hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg shadow-red-100">
                                        <XCircle className="w-6 h-6" /> No
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Related Articles Component */}
                        {relatedArticles.length > 0 && (
                            <div className="pt-24 space-y-10">
                                <div className="flex items-end justify-between">
                                    <h2 className="text-3xl font-black text-gray-900">Explore Health Topics</h2>
                                    <Link href="/health-topics" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
                                        View All <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {relatedArticles.map((art) => (
                                        <Link
                                            href={`/health-topics/${art.category.slug}/${art.slug}`}
                                            key={art.id}
                                            className="group bg-white p-6 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all"
                                        >
                                            <div className="aspect-square bg-blue-50 rounded-2xl mb-4 overflow-hidden relative">
                                                {art.featuredImage && <img src={art.featuredImage} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                                            </div>
                                            <h4 className="font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                                {art.title}
                                            </h4>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
