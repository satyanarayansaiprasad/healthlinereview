import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Star, Clock, User, ArrowRight, Activity, Heart, Brain, Eye, Zap } from 'lucide-react';
import FeaturedTopics from '@/components/home/FeaturedTopics';
import { prisma } from '@/lib/prisma';

export default async function Home() {
    const brands = await prisma.brand.findMany({
        take: 6,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section className="relative h-[650px] flex items-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-bg-v3.png"
                        alt="Clean Medical Wellness Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Refined overlay for perfect balance and readability */}
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-15" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left Content */}
                        <div className="lg:col-span-7 space-y-8 animate-in slide-in-from-left duration-700">
                            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
                                Trusted Reviews,<br />
                                <span className="text-blue-600">Honest Ratings</span> and<br />
                                <span className="text-blue-600">Quality Advice</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl leading-relaxed font-medium">
                                Health Line Review is your premier source for evidence-based health and wellness information and unbiased product reviews.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link href="/health-topics" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-base flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20">
                                    Explore Health Topics <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link href="/product-reviews" className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-3 rounded-full font-bold text-base transition-colors shadow-sm">
                                    Latest Reviews
                                </Link>
                            </div>
                        </div>

                        {/* Right Content - Stats/Features */}
                        <div className="hidden lg:block lg:col-span-5 animate-in slide-in-from-right duration-700 delay-200">
                            <div className="bg-white/40 backdrop-blur-md rounded-[3rem] p-10 border border-white/50 shadow-2xl shadow-blue-900/5">
                                <div className="text-center mb-10">
                                    <h2 className="text-2xl font-serif text-gray-500 uppercase tracking-widest mb-2">Authenticated Reviews</h2>
                                    <p className="text-5xl font-black text-gray-900">10,000+</p>
                                    <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-2">Verified Products</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { icon: <Zap className="w-6 h-6" />, title: "Real-Time Data" },
                                        { icon: <Activity className="w-6 h-6" />, title: "Expert Vetted" },
                                        { icon: <Heart className="w-6 h-6" />, title: "Patient Safe" },
                                        { icon: <Brain className="w-6 h-6" />, title: "Science First" }
                                    ].map((feature, i) => (
                                        <div key={i} className="text-center p-6 bg-white/60 rounded-3xl border border-white/80 shadow-sm hover:shadow-md transition-all group">
                                            <div className="w-12 h-12 mx-auto mb-4 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                                {feature.icon}
                                            </div>
                                            <h3 className="font-black text-gray-900 text-[11px] uppercase tracking-widest">{feature.title}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Review Categories */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-blue-600 mb-3 uppercase tracking-wider">Product Review Categories</h2>
                    <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {(await prisma.reviewCategory.findMany({
                        where: { isStarred: true },
                        take: 6,
                        orderBy: { createdAt: 'desc' }
                    })).map((cat, i) => (
                        <Link key={cat.id} href={`/product-reviews?category=${cat.slug}`} className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex items-center gap-6">
                            <div className="absolute right-0 top-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10 transition-transform group-hover:scale-150 bg-blue-50" />
                            <div className="w-16 h-16 flex-shrink-0 relative rounded-2xl overflow-hidden border border-gray-100 group-hover:scale-110 transition-transform">
                                <Image
                                    src={cat.imageUrl}
                                    alt={cat.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{cat.name}</h3>
                                <p className="text-xs text-gray-500 mt-1 font-medium">Verified Reviews</p>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                            </div>
                        </Link>
                    ))}
                    {(await prisma.reviewCategory.count({ where: { isStarred: true } })) === 0 && (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                            <Activity className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No clinical categories featured yet</p>
                        </div>
                    )}
                </div>
                <div className="text-center mt-10">
                    <Link href="/product-reviews/categories" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold uppercase text-sm tracking-widest transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1">
                        View All Categories <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Our Top Picks */}
            <section className="bg-gradient-to-b from-blue-50/50 to-white py-20 md:py-28">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 mb-16 tracking-tight">
                        Our <span className="text-blue-600">Top Picks</span> For You
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {[
                            { name: 'Ultimate H2', desc: 'Boost Of Energy', rating: 4.9, img: 'https://m.media-amazon.com/images/I/71L+3U5ZaAL._AC_SL1500_.jpg', bg: 'bg-blue-50/50' },
                            { name: 'Polyphenol Olive Oil', desc: 'High-Quality & Rich', rating: 4.9, img: 'https://m.media-amazon.com/images/I/61SBCf15vbS._SL1500_.jpg', bg: 'bg-emerald-50/50' },
                            { name: 'Morning Kick', desc: 'Healthy Digestion', rating: 4.8, img: 'https://m.media-amazon.com/images/I/81INSpJczkL._AC_SL1500_.jpg', bg: 'bg-orange-50/50' },
                            { name: 'MCT Wellness', desc: 'Healthy Metabolism', rating: 4.9, img: 'https://m.media-amazon.com/images/I/71P9S1Nk4hL._AC_SL1500_.jpg', bg: 'bg-purple-50/50' },
                        ].map((product, i) => (
                            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 text-center group flex flex-col h-full transform hover:-translate-y-2">
                                <div className={`aspect-square mb-6 rounded-2xl overflow-hidden relative ${product.bg} flex items-center justify-center p-8 group-hover:scale-[1.02] transition-transform duration-500`}>
                                    <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-700">
                                        <Image
                                            src={product.img}
                                            alt={product.name}
                                            fill
                                            className="object-contain drop-shadow-2xl"
                                        />
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100/50">
                                        Expert Choice
                                    </div>
                                </div>
                                <div className="space-y-1 mb-4 flex-grow">
                                    <h3 className="font-black text-xl text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{product.name}</h3>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{product.desc}</p>
                                </div>
                                <div className="flex items-center justify-center gap-1 text-yellow-400 mb-8 bg-gray-50/80 py-2.5 rounded-2xl w-full">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                                    <span className="text-gray-900 font-extrabold text-xs ml-1">{product.rating} <span className="text-gray-300 font-medium">/ 5.0</span></span>
                                </div>
                                <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-95">
                                    Check Price
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brands Section */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-4 space-y-6">
                        <h2 className="text-4xl font-extrabold text-blue-500 uppercase tracking-wide">Brands</h2>
                        <div className="h-1 w-16 bg-blue-500" />
                        <p className="text-gray-600 leading-relaxed">
                            Looking for a particular brand? This Brands A-Z page is a near comprehensive listing of brands reviewed, including skin care, weight management, vitamins and supplements.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Our team of experts objectively review a wide range of products and services across the best health and wellness brands. Whether it's a well-known brand or a new company, if it's out there, we're reviewing it for you.
                        </p>
                        <Link href="/brands" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-1 uppercase text-sm tracking-wide mt-4">
                            View All Brands <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {brands.map((brand, i) => (
                                <Link
                                    key={brand.id}
                                    href={`/brands?search=${encodeURIComponent(brand.name)}`}
                                    className="bg-white p-6 border border-gray-100 rounded-xl flex items-center justify-center hover:shadow-xl hover:border-blue-100 transition-all h-32 group"
                                >
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img
                                            src={brand.logoUrl}
                                            alt={brand.name}
                                            className="max-w-full max-h-full object-contain transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                </Link>
                            ))}
                            {brands.length === 0 && (
                                [1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center h-32 animate-pulse">
                                        <Activity className="w-6 h-6 text-gray-200" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Experts Top Recommendations */}
            <section className="bg-gray-50 py-20 md:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 mb-20 tracking-tight">
                        Experts Recommendations For <span className="text-blue-600 underline decoration-4 decoration-blue-200 underline-offset-4">Everyday Needs</span>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Article of the Week */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b-2 border-gray-900 pb-3">
                                <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-widest">Article Of The Week</h3>
                            </div>
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer h-full border border-gray-100">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <Image src="/topic-low-carb.png" alt="Healthy Teas" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                                        Weight Loss
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h4 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors leading-tight mb-4">
                                        18 Best Teas For Weight Loss And Boosting Your Metabolism 2026
                                    </h4>
                                    <p className="text-gray-500 mb-6">Discover nature's most powerful blends for sustainable health.</p>
                                    <span className="text-blue-600 font-bold text-sm uppercase tracking-wider flex items-center gap-2">Read Article <ArrowRight className="w-4 h-4" /></span>
                                </div>
                            </div>
                        </div>

                        {/* Featured List */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b-2 border-gray-900 pb-3">
                                <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-widest">Featured</h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    '17 Best Supplements To Reduce Cortisol 2026',
                                    '17 Best Biotin Supplements For Hair Growth',
                                    'The 12 Best Bone Health Supplements 2026',
                                    'The 23 Best Mood Enhancer Vitamins',
                                    '20 Best Blood Flow Supplements For Cardio'
                                ].map((title, i) => (
                                    <div key={i} className="group cursor-pointer bg-white p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all flex items-start gap-4">
                                        <span className="text-3xl font-extrabold text-gray-100 group-hover:text-blue-100 transition-colors">0{i + 1}</span>
                                        <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-snug pt-1">
                                            {title}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Latest Articles */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b-2 border-gray-900 pb-3">
                                <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-widest">Latest Articles</h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { cat: "Women's Health", title: "24 Best Supplements and Vitamins for Hormones" },
                                    { cat: "Gut Health", title: "The 20 Best Prebiotic Supplements for 2026" },
                                    { cat: "Nutrition", title: "6 Best Supplements for Kidney Health Guide" }
                                ].map((article, i) => (
                                    <div key={i} className="flex gap-5 group cursor-pointer bg-white p-4 rounded-2xl hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
                                        <div className="w-24 h-24 relative rounded-xl overflow-hidden flex-shrink-0">
                                            <Image src={`/topic-fat-burning.png`} alt={article.title} fill className="object-cover" />
                                        </div>
                                        <div className="py-1">
                                            <span className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-2 block">{article.cat}</span>
                                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                                                {article.title}
                                            </h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Reviews */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="section-title">Trusted Product Reviews</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Organic Whey Protein Plus', brand: 'Verified Quality • Non-GMO', rating: 4.8, slug: 'organic-whey', img: 'https://m.media-amazon.com/images/I/7181KquqcpL._SX679_.jpg', color: 'bg-blue-50/50' },
                            { name: 'Focus Factor Nootropic', brand: 'Brain Performance', rating: 4.2, slug: 'focus-factor', img: 'https://m.media-amazon.com/images/I/71zYzdGgvdL._AC_SL1500_.jpg', color: 'bg-purple-50/50' },
                            { name: 'Digestive Enzymes', brand: 'Gut Health Mastery', rating: 4.7, slug: 'digestive-enzymes', img: 'https://m.media-amazon.com/images/I/71Z46KZaq-L._SL1500_.jpg', color: 'bg-emerald-50/50' },
                            { name: 'Advanced Collagen', brand: 'Skin & Joint Support', rating: 4.9, slug: 'collagen', img: 'https://m.media-amazon.com/images/I/51yvBiyU6NL._SL1080_.jpg', color: 'bg-pink-50/50' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
                                <div className={`w-full aspect-square ${item.color} rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 shadow-inner`}>
                                    <Image
                                        src={item.img}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-6 mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex items-center gap-1 text-yellow-400 mb-4 bg-gray-50/80 py-1.5 px-3 rounded-full w-fit">
                                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                                    <span className="text-gray-900 font-black ml-1 text-[10px]">{item.rating}</span>
                                </div>
                                <h4 className="font-black text-lg text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-2">{item.name}</h4>
                                <p className="text-[10px] font-bold text-gray-400 mb-8 uppercase tracking-widest">{item.brand}</p>
                                <div className="mt-auto">
                                    <Link href={`/product-reviews/${item.slug}`} className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-3 transition-all">
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
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">straight to your inbox.</span>
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
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 transform hover:-translate-y-0.5">
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
