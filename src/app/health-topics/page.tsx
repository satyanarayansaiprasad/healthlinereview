import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ShieldCheck, Stethoscope, ClipboardCheck, ArrowRight, User, CheckCircle2, Award, Heart } from 'lucide-react';

export default async function HealthTopics() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    const featuredExperts = await prisma.healthExpert.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: 'desc' }
    });

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <div className="flex flex-col gap-16 md:gap-24 pb-20 font-sans text-gray-900 bg-[#f8fafc]">
            {/* Top Header - The Answers You Need */}
            <section className="bg-white border-b border-gray-100 py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12">
                        <div className="max-w-2xl text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-600 leading-tight mb-4">
                                <span className="text-gray-900">The</span> Answers You Need.
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-500 font-medium">
                                From doctors, dermatologists, and journalists you can trust.
                            </p>
                        </div>

                        {/* Trust Markers */}
                        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight">Trusted<br />Information</h3>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                                    <Stethoscope className="w-8 h-8" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight">Fact Checked<br />by Specialists</h3>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                                    <ClipboardCheck className="w-8 h-8" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base leading-tight">Honest<br />Product Review</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-6 md:p-12 lg:p-16 border border-gray-100 -mt-10 md:-mt-20 relative z-10">
                    <div className="space-y-8 text-gray-600 text-lg leading-relaxed mb-16">
                        <p>
                            In today's fast-paced world, navigating the vast amount of health information available can be overwhelming. At the Health Center, our experts provide reliable insights that go beyond trends, offering both factual data and practical experiences.
                        </p>
                        <p>
                            With their wealth of knowledge, our team dissects popular health topics, giving individuals a well-rounded understanding to make informed choices about diet, exercise, mental well-being, and preventive measures.
                        </p>
                        <p>
                            Browsing through our selection of health articles, verified and peer-reviewed by our team of experts, can be incredibly advantageous for your overall health and well-being.
                        </p>
                    </div>

                    {/* Featured/Popular Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            { title: '18 Best Teas For Weight Loss And Boosting Your Metabolism 2026', img: '/topic-low-carb.png', bg: 'bg-green-100' },
                            { title: '17 Best Supplements To Reduce Cortisol 2026, According to Experts', img: '/topic-fat-burning.png', bg: 'bg-orange-100' },
                            { title: '17 Best Biotin Supplements For Hair Growth 2026, According to Dermatologists', img: '/topic-low-carb.png', bg: 'bg-blue-100' }
                        ].map((article, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className={`aspect-[16/9] rounded-2xl overflow-hidden ${article.bg} mb-5 relative`}>
                                    <Image src={article.img} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors leading-snug">
                                    {article.title}
                                </h3>
                            </div>
                        ))}
                    </div>

                    {/* Expert Perspective Section */}
                    <div className="border-t border-gray-100 pt-16 mt-16">
                        <h2 className="text-3xl font-extrabold text-blue-600 mb-6">Health Center: Expert Perspective on Popular Health Topics</h2>
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p className="font-bold italic">"Precaution Is Better Than Cure" but to take precaution at a proper time it is important to encounter the health issue as early as possible and for doing so awareness about the various disease is important.</p>
                            <p>Considering this as an objective Health Line Review has assembled experts to guide and share their knowledge and experience related to various health issues for both men and women. We provide all the information on fitness, health, relationships, pregnancy, weight-loss, nutrition and muscle building. This is our one-in-all platform for what you need to know about any health issues.</p>
                            <p>Connect with us and get access to best-in-class experts selected by our editorial team.</p>
                        </div>
                    </div>

                    {/* Product Review A-Z Directory */}
                    <div className="mt-20">
                        <div className="flex items-center gap-6 mb-8">
                            <h2 className="text-3xl font-extrabold text-blue-600">Health Topics A to Z</h2>
                            <Link href="/categories" className="text-orange-500 font-extrabold text-sm uppercase tracking-widest flex items-center gap-2 hover:text-orange-600">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <p className="text-gray-500 mb-8 font-medium">Find a topic or category by its first letter:</p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-3">
                            {alphabet.map((letter) => {
                                const hasItems = categories.some(c => c.name.toUpperCase().startsWith(letter));
                                return (
                                    <Link
                                        key={letter}
                                        href={hasItems ? `/health-topics?filter=${letter}` : '#'}
                                        className={`h-12 flex items-center justify-center rounded-xl font-extrabold text-lg transition-all ${hasItems
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:scale-110 active:scale-95'
                                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        {letter}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Experts & Editorial Standards Section */}
            <section className="container mx-auto px-4 md:px-6 py-12 md:py-24">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Left: Experts */}
                    <div className="lg:col-span-7 space-y-12 text-center lg:text-left">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-6">Meet Our Health Experts</h2>
                            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                                We create trustworthy content that is honest, objective, and comprehensive. We make sure that the information is reliable and fact checked by experts. We simplify complicated issues to help you make better choices about your health.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {featuredExperts.length > 0 ? (
                                featuredExperts.map((expert) => (
                                    <div key={expert.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-5 hover:shadow-xl transition-all group cursor-pointer">
                                        <div className="w-16 h-16 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-blue-400 transition-all">
                                            <img src={expert.imageUrl} alt={expert.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">{expert.name}</h4>
                                            <p className="text-xs text-gray-500 font-medium">{expert.designation}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                [1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-5 animate-pulse">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 bg-gray-100 rounded w-3/4" />
                                            <div className="h-3 bg-gray-50 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <Link
                            href="/health-experts"
                            className="inline-flex py-4 px-10 bg-[#84bd00] hover:bg-[#71a300] text-white rounded-full font-bold text-lg shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1"
                        >
                            Meet The Team
                        </Link>
                    </div>

                    {/* Right: Editorial Standards */}
                    <div className="lg:col-span-5 relative">
                        <div className="bg-blue-50 rounded-[3rem] p-10 md:p-14 border border-blue-100 sticky top-24">
                            <h3 className="text-3xl font-extrabold text-blue-600 mb-10 text-center md:text-left">Our Editorial Standards</h3>
                            <div className="space-y-10">
                                {[
                                    { icon: CheckCircle2, title: 'Integrity', desc: 'We create trustworthy content that is honest, objective, and comprehensive.' },
                                    { icon: Award, title: 'Reliability', desc: 'We make sure that the information is reliable and fact checked by experts.' },
                                    { icon: Heart, title: 'Empathy', desc: 'We simplify complicated issues to help you make better choices about your health.' }
                                ].map((standard, i) => (
                                    <div key={i} className="flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex flex-shrink-0 items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                            <standard.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-gray-900 text-xl mb-2">{standard.title}</h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">{standard.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-12 py-4 bg-[#84bd00] hover:bg-[#71a300] text-white rounded-full font-bold text-lg shadow-lg shadow-green-200 transition-all">
                                Read Editorial Process
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
