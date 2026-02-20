import { Shield, Users, Heart, Award, CheckCircle2, Stethoscope, Microscope, Globe } from 'lucide-react';
import { getPageContent } from '@/lib/site';

export default async function AboutUs() {
    const page = await getPageContent('about-us');
    const title = page?.title ?? 'About Us';
    const contentBlocks = (page?.content as { type: string; content: string }[] | undefined) ?? [];

    return (
        <div className="flex flex-col gap-16 md:gap-32 pb-32 bg-[#fbfcfd] font-sans">
            <section className="bg-white pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[40%] h-full bg-teal-50/50 -skew-x-12 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/5 rounded-full blur-[100px] -ml-48 -mb-48" />
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="flex-1 space-y-10">
                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-50 text-[var(--color-primary)] text-[10px] md:text-sm font-black uppercase tracking-[0.25em] border border-teal-100 animate-fade-in">
                                <Stethoscope className="w-4 h-4" />
                                Medical Authority & Integrity
                            </div>
                            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-[var(--color-secondary)] leading-[1.05] tracking-tighter">
                                Empowering <br />
                                <span className="text-[var(--color-primary)] italic">Health Decisions.</span>
                            </h1>
                            {contentBlocks.length > 0
                                ? contentBlocks
                                    .filter((b): b is { type: 'paragraph'; content: string } => b.type === 'paragraph')
                                    .map((block, i) => (
                                        <p key={i} className="text-lg md:text-2xl text-[var(--color-body)] leading-relaxed font-medium max-w-2xl">{block.content}</p>
                                    ))
                                : (
                                    <p className="text-lg md:text-2xl text-[var(--color-body)] leading-relaxed font-medium max-w-2xl">
                                        Health Line Review is dedicated to the pursuit of medical transparency. We bridge the gap between complex science and your daily wellness journey.
                                    </p>
                                )}
                        </div>
                        <div className="hidden lg:block w-1/3 aspect-[4/5] rounded-[3rem] relative overflow-hidden shadow-2xl bg-teal-100/30 flex items-center justify-center">
                            <span className="text-8xl font-black text-teal-200">H</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scientific Rigor Section */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="grid grid-cols-2 gap-6 md:gap-8">
                        {[
                            { icon: <Award className="w-6 h-6" />, label: "Accredited Reviews", value: "2.5k+" },
                            { icon: <Users className="w-6 h-6" />, label: "Health Experts", value: "85+" },
                            { icon: <Globe className="w-6 h-6" />, label: "Monthly Readers", value: "4.2M" },
                            { icon: <Shield className="w-6 h-6" />, label: "Verified Data Points", value: "15k+" }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
<div className="text-[var(--color-primary)] mb-6">{stat.icon}</div>
                                                <div className="text-3xl md:text-4xl font-black text-[var(--color-secondary)] mb-1">{stat.value}</div>
                                                <div className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-10 lg:pl-12">
                        <h2 className="text-4xl md:text-6xl font-black text-[var(--color-secondary)] leading-tight">The Science Behind <br /> Every Sentence.</h2>
                        <p className="text-xl text-[var(--color-body)] font-medium leading-relaxed">
                            Every article on Health Line Review is written by professional health journalists and vetted by our Medical Review Board—a panel of board-certified clinicians with decades of experience in diverse specialties.
                        </p>
                        <ul className="space-y-4">
                            {['Evidence-Based Citations', 'Medical Board Review', 'Annual Data Audits'].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-[var(--color-secondary)] font-black uppercase text-xs tracking-widest">
                                    <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)]" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Premium Values Grid */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="bg-gray-900 rounded-[4rem] p-12 md:p-24 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -mr-64 -mt-64" />

                    <div className="relative z-10 text-center space-y-20">
                        <div className="space-y-6 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-black text-white">Our Values Drive <br /><span className="text-[var(--color-primary)]">Your Results.</span></h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { title: "Clinical Accuracy", icon: <Microscope className="w-8 h-8" />, desc: "We don't settle for 'good enough'. Our data is pulled directly from peer-reviewed journals." },
                                { title: "Reader Trust", icon: <Heart className="w-8 h-8" />, desc: "Our recommendations are never for sale. Independence is our most vital asset." },
                                { title: "Global Reach", icon: <Globe className="w-8 h-8" />, desc: "Healing shouldn't have borders. We make health education accessible at zero cost." }
                            ].map((v, i) => (
                                <div key={i} className="space-y-6 text-center group">
                                    <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-500">
                                        {v.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-white">{v.title}</h3>
                                    <p className="text-gray-400 font-medium leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
