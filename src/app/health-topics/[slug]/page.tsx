import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, Clock, BookOpen, Share2 } from 'lucide-react';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
        where: { slug },
    });

    if (!category) return { title: 'Topic Not Found' };

    return {
        title: `${category.name} | Health Topics | Health Line Review`,
        description: category.metaDescription || `Expert articles about ${category.name}.`,
    };
}

export default async function TopicDetail({ params }: Props) {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
        where: { slug },
        include: { articles: true }
    });

    if (!category) notFound();

    return (
        <div className="flex flex-col gap-12 md:gap-20 pb-20 bg-[#fbfcfd] font-sans">
            {/* Topic Hero Section */}
            <section className="bg-white border-b border-gray-100 pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-50/50 skew-x-12 translate-x-1/2" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <nav className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-8">
                        <Link href="/health-topics" className="hover:text-blue-800 transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> Health Topics
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-300" />
                        <span className="text-gray-400">{category.name}</span>
                    </nav>

                    <div className="max-w-4xl space-y-6">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            Latest in <br />
                            <span className="text-blue-600">{category.name}</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-600 leading-relaxed font-medium">
                            {category.metaDescription || `Stay informed with the latest evidence-based research, expert-reviewed guides, and wellness tips focused on ${category.name.toLowerCase()}.`}
                        </p>

                        <div className="flex flex-wrap gap-6 pt-4 text-sm font-bold text-gray-500">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-500" />
                                {category.articles.length} Specialist Articles
                            </div>
                            <div className="flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-blue-500" />
                                Expert Reviewed Content
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase tracking-tight">Recent Articles</h2>
                    <div className="hidden sm:block h-1 flex-1 bg-gray-100 ml-8 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {category.articles.map((article, i) => (
                        <Link
                            key={article.id}
                            href={`/health-topics/${category.slug}/${article.slug}`}
                            className="group flex flex-col h-full bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-500 overflow-hidden"
                        >
                            <div className="aspect-[16/10] relative overflow-hidden bg-gray-50">
                                <Image
                                    src={i % 2 === 0 ? '/topic-low-carb.png' : '/topic-fat-burning.png'}
                                    alt={article.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                                />
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-blue-600 shadow-sm">
                                        Research Based
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 md:p-10 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    <div className="flex items-center gap-1.5 text-blue-500">
                                        <Clock className="w-3.5 h-3.5" /> 6 min read
                                    </div>
                                    <span>•</span>
                                    <span>Jan 2026</span>
                                </div>

                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-4 line-clamp-2">
                                    {article.title}
                                </h3>

                                <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3">
                                    {article.content?.toString().substring(0, 160).replace(/<[^>]*>/g, '') || 'Discover deep insights and expert perspective on this topic...'}
                                </p>

                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between group/btn">
                                    <span className="text-blue-600 font-bold text-sm uppercase tracking-widest flex items-center gap-2 group-hover/btn:gap-3 transition-all">
                                        Read Article <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {category.articles.length === 0 && (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <BookOpen className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h3>
                        <p className="text-gray-500">We're currently preparing expert content for this topic.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
