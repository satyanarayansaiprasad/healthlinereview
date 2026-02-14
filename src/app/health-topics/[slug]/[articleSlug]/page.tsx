import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, User, Share2, Facebook, Twitter, Link as LinkIcon, ChevronRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
    params: Promise<{ slug: string; articleSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { articleSlug } = await params;
    const article = await prisma.article.findUnique({
        where: { slug: articleSlug },
        include: { category: true }
    });

    if (!article) return { title: 'Article Not Found' };

    return {
        title: `${article.title} | Health Line Review`,
        description: article.metaDescription || '',
    };
}

export default async function ArticleDetailPage({ params }: Props) {
    const { articleSlug } = await params;
    const article = await prisma.article.findUnique({
        where: { slug: articleSlug },
        include: {
            category: true,
            author: true,
            tags: true
        }
    });

    if (!article) notFound();

    return (
        <article className="bg-[#fcfdff] font-sans pb-24">
            {/* Article Header & Hero */}
            <div className="bg-white border-b border-gray-100 pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden relative">
                {/* Subtle Background Pattern */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/30 -skew-x-12 translate-x-1/2" />

                <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
                    <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-10">
                        <Link href="/health-topics" className="hover:text-blue-800 transition-colors">Health Topics</Link>
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        <Link href={`/health-topics/${article.category.slug}`} className="hover:text-blue-800 transition-colors">{article.category.name}</Link>
                    </nav>

                    <div className="space-y-8">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight max-w-4xl">
                            {article.title}
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 py-10 border-t border-gray-100">
                            {/* Author Card */}
                            <div className="flex items-center gap-4 bg-gray-50/50 p-3 pr-6 rounded-2xl border border-gray-100 w-fit">
                                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
                                    {article.author.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900 leading-tight">{article.author.name}</p>
                                    <div className="flex items-center gap-1.5 text-blue-500 mt-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 fill-current text-white" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Medical Review Board</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 text-[11px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-500" /> 8 min read
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-blue-500" /> Updated {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 max-w-5xl mt-16 md:mt-24">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Share Sidebar */}
                    <div className="lg:w-16 flex lg:flex-col gap-4 order-2 lg:order-1 justify-center lg:justify-start">
                        <div className="sticky top-32 space-y-4 flex lg:flex-col gap-4 items-center">
                            <span className="hidden lg:block text-[10px] font-black text-gray-300 uppercase [writing-mode:vertical-rl] [text-orientation:mixed] tracking-widest mb-4">Share</span>
                            <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <LinkIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Main Content Body */}
                    <div className="flex-1 order-1 lg:order-2">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-sm border border-gray-50 prose prose-lg prose-slate max-w-none prose-headings:text-gray-900 prose-headings:font-black prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:font-bold hover:prose-a:text-blue-700">
                            {typeof article.content === 'string' ? (
                                <div dangerouslySetInnerHTML={{ __html: article.content }} />
                            ) : (
                                <p className="text-red-500 font-bold">Unable to render article content.</p>
                            )}
                        </div>

                        {/* Article Footer / Tags */}
                        <div className="mt-16 p-8 md:p-12 bg-blue-50/30 rounded-[2.5rem] border border-blue-50 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map(tag => (
                                    <span key={tag.id} className="px-5 py-2.5 bg-white text-gray-600 border border-gray-100 rounded-full text-xs font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 cursor-pointer transition-all shadow-sm">
                                        #{tag.name.toUpperCase()}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Medical Disclaimer</span>
                                <ShieldCheck className="w-5 h-5 text-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
