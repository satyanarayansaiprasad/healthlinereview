import Image from 'next/image';
import { ClipboardCheck, Star, Shield, Zap, Award, Search, CheckCircle2, FlaskConical, Scale, BookOpen } from 'lucide-react';

export default function ReviewGuidelines() {
    return (
        <div className="flex flex-col gap-16 md:gap-32 pb-32 bg-[#fbfcfd] font-sans">
            {/* Minimal High-End Hero */}
            <section className="bg-white pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden relative border-b border-gray-100/50">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/review-guidelines-hero.png"
                        alt="Clinical Research Environment"
                        fill
                        className="object-cover opacity-15"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-5xl space-y-12 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] md:text-sm font-black uppercase tracking-[0.25em] border border-emerald-100">
                            <FlaskConical className="w-4 h-4 text-emerald-500" />
                            Clinical Review Protocols
                        </div>

                        <h1 className="text-5xl md:text-9xl font-black text-gray-900 tracking-tighter leading-[0.95]">
                            Science Over <br />
                            <span className="text-emerald-600 italic">Speculation.</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-gray-500 leading-relaxed font-medium max-w-3xl">
                            Transparency is our foundation. Discover the rigorous 5-pillar evaluation system we use to audit every product before it reaches our readers.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Pillars of Trust */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {[
                        { icon: <Shield />, color: "text-blue-500", title: "Ingredient Purity", desc: "We cross-reference every ingredient list with peer-reviewed safety data and third-party laboratory results. No hidden fillers allowed." },
                        { icon: <Scale />, color: "text-emerald-500", title: "Clinical Dosing", desc: "Active compounds must be present at dosages proven effective in randomized controlled trials, not just listed on the label." },
                        { icon: <Award />, color: "text-amber-500", title: "Compliance Audit", desc: "We verify manufacturing facilities for GMP compliance and audit brand certifications for legitimacy and transparency." },
                        { icon: <Star />, color: "text-orange-500", title: "Real-World Efficacy", desc: "Our team tests products for flavor, solubility, and physiological impact in real-world wellness routines for 30+ days." },
                        { icon: <Search />, color: "text-indigo-500", title: "Marketing Vetting", desc: "We strip away marketing hype, evaluating health claims against the current global scientific consensus." },
                        { icon: <BookOpen />, color: "text-emerald-600", title: "Editorial Integrity", desc: "Reviewers have zero commission incentives. Our scoring is purely data-driven and independent." }
                    ].map((pillar, i) => (
                        <div key={i} className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group">
                            <div className={`w-20 h-20 rounded-[1.5rem] bg-gray-50 flex items-center justify-center mb-10 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500 ${pillar.color}`}>
                                {pillar.icon}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 leading-tight">{pillar.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed text-lg">{pillar.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Premium Scoring Matrix */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="bg-gray-900 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:bg-emerald-600/10 transition-all duration-1000" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                        <div className="space-y-10">
                            <h2 className="text-4xl md:text-7xl font-black leading-tight italic text-emerald-500">The 10-Point <br /> Integrity Score.</h2>
                            <p className="text-xl text-gray-400 font-medium leading-relaxed">
                                Our scoring isn't subjective. It's an algorithm built on safety, efficacy, and value. Products must clear a 7.5 baseline to even be considered for our "Best Of" rankings.
                            </p>
                            <div className="flex gap-4">
                                <div className="w-1.5 h-12 bg-emerald-500 rounded-full" />
                                <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-500/50 mt-1">Verified Audit Data</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { range: "9.0 - 10", label: "Gold Standard", color: "text-emerald-500", desc: "Perfect clinical alignment and zero purity issues." },
                                { range: "7.0 - 8.9", label: "Recommended", color: "text-blue-500", desc: "High quality but may have minor value or taste drawbacks." },
                                { range: "5.0 - 6.9", label: "Medical Average", color: "text-amber-500", desc: "Safe, but contains fillers or proprietary blends." },
                                { range: "< 5.0", label: "Failed Protocol", color: "text-red-500", desc: "Significant quality issues or misleading marketing claims." }
                            ].map((tier, i) => (
                                <div key={i} className="p-8 md:p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group/item">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`text-3xl font-black ${tier.color}`}>{tier.range}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover/item:text-white transition-colors">{tier.label}</div>
                                    </div>
                                    <p className="text-gray-400 font-medium">{tier.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
