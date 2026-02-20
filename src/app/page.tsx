import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star, ArrowRight, Activity, Heart, Brain, Zap } from 'lucide-react';
import FeaturedTopics from '@/components/home/FeaturedTopics';
import { getSiteSettings } from '@/lib/site';
import { prisma } from '@/lib/prisma';

export default async function Home() {
    const [settings, categories, topReviews, latestReviews, articleOfWeek, featuredArticles, latestArticles] = await Promise.all([
        getSiteSettings(),
        prisma.category.findMany({ orderBy: { name: 'asc' }, take: 6 }),
        prisma.productReview.findMany({ orderBy: { rating: 'desc' }, take: 4 }),
        prisma.productReview.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
        prisma.article.findFirst({ where: { status: 'PUBLISHED' }, orderBy: { updatedAt: 'desc' }, include: { category: true } }),
        prisma.article.findMany({ where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'desc' }, take: 5, include: { category: true } }),
        prisma.article.findMany({ where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'desc' }, take: 3, include: { category: true } }),
    ]);

    const heroTitle = settings.heroTitle ?? 'Trusted Reviews, Honest Ratings and Quality Advice';
    const heroSubtitle = settings.heroSubtitle ?? 'Health Line Review is your premier source for evidence-based health and wellness information and unbiased product reviews.';

    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section className="relative min-h-[600px] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
                <div className="container mx-auto px-4 md:px-6 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-8">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-secondary)] leading-tight">
                                {heroTitle.split(',').length > 1
                                    ? heroTitle.split(',').map((part, i) => (
                                        <span key={i}>
                                            {i > 0 && <br />}
                                            <span className={i >= 1 ? 'text-[var(--color-primary)]' : ''}>{part.trim()}</span>
                                        </span>
                                    ))
                                    : heroTitle}
                            </h1>
                            <p className="text-lg md:text-xl text-[var(--color-body)] max-w-2xl leading-relaxed font-medium">
                                {heroSubtitle}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link href="/health-topics" className="bg-[var(--color-primary)] hover:opacity-90 text-white px-8 py-3 rounded-full font-bold text-base flex items-center gap-2 transition-all shadow-lg">
                                    {settings.heroCtaPrimary ?? 'Explore Health Topics'} <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link href="/product-reviews" className="bg-white hover:bg-gray-50 text-[var(--color-secondary)] border border-gray-200 px-8 py-3 rounded-full font-bold text-base transition-colors shadow-sm">
                                    {settings.heroCtaSecondary ?? 'Latest Reviews'}
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:block lg:col-span-5">
                            <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-10 border border-gray-100 shadow-xl">
                                <div className="text-center mb-10">
                                    <p className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-widest mb-2">Authenticated Reviews</p>
                                    <p className="text-5xl font-black text-[var(--color-secondary)]">10,000+</p>
                                    <p className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-widest mt-2">Verified Products</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { icon: <Zap className="w-6 h-6" />, title: 'Real-Time Data' },
                                        { icon: <Activity className="w-6 h-6" />, title: 'Expert Vetted' },
                                        { icon: <Heart className="w-6 h-6" />, title: 'Patient Safe' },
                                        { icon: <Brain className="w-6 h-6" />, title: 'Science First' },
                                    ].map((feature, i) => (
                                        <div key={i} className="text-center p-6 bg-teal-50/50 rounded-3xl border border-teal-100/50 hover:shadow-md transition-all group">
                                            <div className="w-12 h-12 mx-auto mb-4 bg-teal-100 text-[var(--color-primary)] rounded-2xl flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-300">
                                                {feature.icon}
                                            </div>
                                            <h3 className="font-black text-[var(--color-secondary)] text-[11px] uppercase tracking-widest">{feature.title}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories from DB */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-primary)] mb-3 uppercase tracking-wider">Health Topics</h2>
                    <div className="w-20 h-1.5 bg-[var(--color-primary)] mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/health-topics/${cat.slug}`} className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex items-center gap-6">
                            <div className="absolute right-0 top-0 w-24 h-24 -mr-6 -mt-6 rounded-full bg-teal-100/50 transition-transform group-hover:scale-150" />
                            <div className="w-16 h-16 flex-shrink-0 rounded-2xl bg-teal-100 text-[var(--color-primary)] flex items-center justify-center text-2xl font-black group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                                {cat.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-colors">{cat.name}</h3>
                                <p className="text-xs text-[var(--color-muted)] mt-1 font-medium">Articles &amp; Guides</p>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="text-center mt-10">
                    <Link href="/health-topics" className="inline-flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] font-bold uppercase text-sm tracking-widest transition-colors border-b-2 border-transparent hover:border-[var(--color-primary)] pb-1">
                        View All Topics <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Our Top Picks - from DB */}
            <section className="bg-gradient-to-b from-teal-50/50 to-white py-20 md:py-28">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-center text-[var(--color-secondary)] mb-16 tracking-tight">
                        Our <span className="text-[var(--color-primary)]">Top Picks</span> For You
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {topReviews.map((product, i) => (
                            <div key={product.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 text-center group flex flex-col h-full transform hover:-translate-y-2">
                                <div className="aspect-square mb-6 rounded-2xl overflow-hidden relative bg-teal-50/50 flex items-center justify-center p-8 group-hover:scale-[1.02] transition-transform duration-500">
                                    {product.featuredImage ? (
                                        <div className="relative w-full h-full">
                                            <Image src={product.featuredImage} alt={product.productName} fill className="object-contain drop-shadow-2xl" />
                                        </div>
                                    ) : (
                                        <span className="text-6xl font-black text-teal-200">{product.productName.charAt(0)}</span>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100/50">
                                        Expert Choice
                                    </div>
                                </div>
                                <div className="space-y-1 mb-4 flex-grow">
                                    <h3 className="font-black text-xl text-[var(--color-secondary)] leading-tight group-hover:text-[var(--color-primary)] transition-colors">{product.productName}</h3>
                                    <p className="text-[var(--color-muted)] text-xs font-bold uppercase tracking-widest">{product.pros?.[0] ?? 'Reviewed'}</p>
                                </div>
                                <div className="flex items-center justify-center gap-1 text-yellow-400 mb-8 bg-gray-50/80 py-2.5 rounded-2xl w-full">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
                                    ))}
                                    <span className="text-[var(--color-secondary)] font-extrabold text-xs ml-1">{product.rating} <span className="text-gray-300 font-medium">/ 5.0</span></span>
                                </div>
                                <Link href={`/product-reviews/${product.slug}`} className="w-full py-4 bg-[var(--color-secondary)] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl text-center block">
                                    Check Price
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brands Section */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-4 space-y-6">
                        <h2 className="text-4xl font-extrabold text-[var(--color-primary)] uppercase tracking-wide">Brands</h2>
                        <div className="h-1 w-16 bg-[var(--color-primary)]" />
                        <p className="text-[var(--color-body)] leading-relaxed">
                            Looking for a particular brand? This Brands A-Z page is a near comprehensive listing of brands reviewed, including skin care, weight management, vitamins and supplements.
                        </p>
                        <p className="text-[var(--color-body)] leading-relaxed">
                            Our team of experts objectively review a wide range of products and services across the best health and wellness brands.
                        </p>
                        <Link href="/brands" className="text-[var(--color-primary)] font-bold hover:opacity-80 inline-flex items-center gap-1 uppercase text-sm tracking-wide mt-4">
                            View All Brands <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {['Beverly Hills MD', 'CrazyBulk', 'DRMTLGY', 'Gundry MD', 'Nushape', 'ActivatedYou'].map((brand, i) => (
                                <div key={i} className="bg-white p-8 border border-gray-100 rounded-xl flex items-center justify-center hover:shadow-md transition-shadow h-32">
                                    <span className="text-xl font-bold text-[var(--color-secondary)] uppercase tracking-widest">{brand}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Experts Top Recommendations - from DB */}
            <section className="bg-gray-50 py-20 md:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-center text-[var(--color-secondary)] mb-20 tracking-tight">
                        Experts Recommendations For <span className="text-[var(--color-primary)] underline decoration-4 decoration-teal-200 underline-offset-4">Everyday Needs</span>
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b-2 border-[var(--color-secondary)] pb-3">
                                <h3 className="text-xl font-extrabold text-[var(--color-secondary)] uppercase tracking-widest">Article Of The Week</h3>
                            </div>
                            {articleOfWeek ? (
                                <Link href={`/health-topics/${articleOfWeek.category.slug}/${articleOfWeek.slug}`} className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group h-full border border-gray-100">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-teal-100">
                                        {articleOfWeek.featuredImage ? (
                                            <Image src={articleOfWeek.featuredImage} alt={articleOfWeek.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-teal-300">{articleOfWeek.title.charAt(0)}</div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                                            {articleOfWeek.category.name}
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h4 className="text-2xl font-bold text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-colors leading-tight mb-4">{articleOfWeek.title}</h4>
                                        <span className="text-[var(--color-primary)] font-bold text-sm uppercase tracking-wider flex items-center gap-2">Read Article <ArrowRight className="w-4 h-4" /></span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center text-[var(--color-muted)]">No article of the week yet.</div>
                            )}
                        </div>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b-2 border-[var(--color-secondary)] pb-3">
                                <h3 className="text-xl font-extrabold text-[var(--color-secondary)] uppercase tracking-widest">Featured</h3>
                            </div>
                            <div className="space-y-6">
                                {featuredArticles.map((article, i) => (
                                    <Link key={article.id} href={`/health-topics/${article.category.slug}/${article.slug}`} className="group flex items-start gap-4 bg-white p-5 rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all">
                                        <span className="text-3xl font-extrabold text-gray-100 group-hover:text-teal-100 transition-colors">0{i + 1}</span>
                                        <h4 className="text-lg font-bold text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-colors leading-snug pt-1">{article.title}</h4>
                                    </Link>
                                ))}
                                {featuredArticles.length === 0 && <p className="text-[var(--color-muted)] text-sm">No featured articles yet.</p>}
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b-2 border-[var(--color-secondary)] pb-3">
                                <h3 className="text-xl font-extrabold text-[var(--color-secondary)] uppercase tracking-widest">Latest Articles</h3>
                            </div>
                            <div className="space-y-6">
                                {latestArticles.map((article) => (
                                    <Link key={article.id} href={`/health-topics/${article.category.slug}/${article.slug}`} className="flex gap-5 group bg-white p-4 rounded-2xl hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
                                        <div className="w-24 h-24 relative rounded-xl overflow-hidden flex-shrink-0 bg-teal-100 flex items-center justify-center text-2xl font-black text-teal-400">
                                            {article.featuredImage ? <Image src={article.featuredImage} alt="" fill className="object-cover" /> : article.title.charAt(0)}
                                        </div>
                                        <div className="py-1">
                                            <span className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest mb-2 block">{article.category.name}</span>
                                            <h4 className="text-lg font-bold text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-colors leading-tight">{article.title}</h4>
                                        </div>
                                    </Link>
                                ))}
                                {latestArticles.length === 0 && <p className="text-[var(--color-muted)] text-sm">No articles yet.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Reviews - from DB */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-extrabold text-[var(--color-secondary)] mb-8">Trusted Product Reviews</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {latestReviews.map((item) => (
                            <div key={item.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
                                <div className="w-full aspect-square rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden bg-teal-50/50 group-hover:scale-[1.02] transition-transform duration-500 shadow-inner">
                                    {item.featuredImage ? (
                                        <Image src={item.featuredImage} alt={item.productName} fill className="object-contain p-6" />
                                    ) : (
                                        <span className="text-5xl font-black text-teal-200">{item.productName.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-yellow-400 mb-4 bg-gray-50/80 py-1.5 px-3 rounded-full w-fit">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className={`w-3 h-3 ${s <= Math.round(item.rating) ? 'fill-current' : 'text-gray-200'}`} />
                                    ))}
                                    <span className="text-[var(--color-secondary)] font-black ml-1 text-[10px]">{item.rating}</span>
                                </div>
                                <h4 className="font-black text-lg text-[var(--color-secondary)] mb-2 leading-tight group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">{item.productName}</h4>
                                <p className="text-[10px] font-bold text-[var(--color-muted)] mb-8 uppercase tracking-widest">{item.pros?.[0] ?? 'Expert Reviewed'}</p>
                                <div className="mt-auto">
                                    <Link href={`/product-reviews/${item.slug}`} className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Read Analysis <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter / Looking For More Section */}
            <section className="bg-gray-50 py-20 md:py-32 border-t border-gray-200">
                <div className="container mx-auto px-4 md:px-6">
                    {/* Looking For More CTA */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
                        <div className="md:w-2/3 text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">Looking for something specific?</h2>
                            <p className="text-gray-600 text-lg">Browse our comprehensive guides on vitamins, supplements, skin care and much more.</p>
                        </div>
                        <button className="bg-gray-900 hover:bg-black text-white font-bold text-lg px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap">
                            See Our Best Guides
                        </button>
                    </div>

                    {/* Premium Newsletter Section */}
                    <div className="relative rounded-[2.5rem] overflow-hidden bg-[#0F172A] text-white shadow-2xl">
                        {/* Background Elements */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/newsletter-couple.png"
                                alt="Background"
                                fill
                                className="object-cover opacity-30 mix-blend-overlay"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/95 to-[#1e293b]/50" />
                        </div>

                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 p-8 md:p-16 lg:p-20 items-center">
                            <div className="space-y-8">
                                <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/20">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                    Weekly Wellness
                                </span>

                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                                    Health tips,<br />
                                    <span className="text-[var(--color-primary)]">straight to your inbox.</span>
                                </h2>

                                <p className="text-lg md:text-xl text-slate-300 max-w-lg leading-relaxed">
                                    Join 50,000+ subscribers who get our best evidence-based articles, product reviews, and exclusive discounts every week.
                                </p>

                                <div className="flex flex-col gap-4 pt-2">
                                    {[
                                        'Evidence-based health advice',
                                        'Exclusive product discounts',
                                        'Expert-reviewed guides'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2">Join the Community</h3>
                                    <p className="text-slate-400 text-sm">Start your journey to better health today. No spam, ever.</p>
                                </div>

                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Email Address</label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="w-full px-6 py-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <button className="w-full bg-[var(--color-primary)] hover:opacity-90 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5">
                                        Subscribe Now
                                    </button>
                                </form>

                                <p className="text-xs text-slate-500 text-center mt-6">
                                    By subscribing, you agree to our <a href="#" className="underline hover:text-white transition-colors">Terms</a> & <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FeaturedTopics />
        </div>
    );
}
