import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown, Clock, ShieldCheck, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ContactUs() {
    const settings = await prisma.siteSettings.findFirst();
    const contactEmail = settings?.contactEmail || "contact@healthlinereview.com";
    const contactPhone = settings?.contactPhone || "+1 (555) 000-0000";
    const contactAddress = settings?.address || "123 Wellness Way, Medical District, NY 10001";

    return (
        <div className="flex flex-col bg-[#fafbfc] font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Ultra-Premium Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-36 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent -skew-x-12 translate-x-1/4" />
                <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-blue-100/20 rounded-full blur-3xl" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl space-y-10">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-gray-100 shadow-sm animate-fade-in">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Clinical Verification Panel</span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-6xl md:text-9xl font-black text-gray-900 leading-[0.95] tracking-tight animate-slide-in-top">
                                Connect with <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Our Experts.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium max-w-2xl animate-fade-in delay-200">
                                Bridging the gap between clinical research and daily wellness. Our medical board is ready to address your inquiries with scientific precision.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 -mt-16 pb-32 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
                    {/* Minimalist Professional Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-10 md:p-20 rounded-[4rem] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
                            <div className="space-y-16">
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                        <h2 className="text-4xl font-black text-gray-900">Direct Message</h2>
                                    </div>
                                    <p className="text-gray-400 font-medium text-lg leading-relaxed">
                                        Responses are prioritized by clinical urgency. Expect a detailed follow-up within 24-48 business hours.
                                    </p>
                                </div>

                                <form className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4 group">
                                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-6 group-focus-within:text-blue-600 transition-colors">Professional Identity</label>
                                            <input type="text" className="w-full px-10 py-7 bg-gray-50/50 border border-transparent focus:border-blue-600 focus:bg-white rounded-[2.5rem] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" placeholder="Name or Institution" />
                                        </div>
                                        <div className="space-y-4 group">
                                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-6 group-focus-within:text-blue-600 transition-colors">Digital Point of Contact</label>
                                            <input type="email" className="w-full px-10 py-7 bg-gray-50/50 border border-transparent focus:border-blue-600 focus:bg-white rounded-[2.5rem] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" placeholder="email@address.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 group">
                                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-6 group-focus-within:text-blue-600 transition-colors">Subject of Analysis</label>
                                        <div className="relative">
                                            <select className="w-full px-10 py-7 bg-gray-50/50 border border-transparent focus:border-blue-600 focus:bg-white rounded-[2.5rem] outline-none transition-all font-bold text-gray-900 appearance-none cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                                                <option>Clinical Method Verification</option>
                                                <option>Editorial Correction Request</option>
                                                <option>Brand Partnership Inquiry</option>
                                                <option>Press & Media Engagement</option>
                                            </select>
                                            <ChevronDown className="absolute right-10 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 group">
                                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 ml-6 group-focus-within:text-blue-600 transition-colors">Detailed Inquiry</label>
                                        <textarea rows={6} className="w-full px-10 py-8 bg-gray-50/50 border border-transparent focus:border-blue-600 focus:bg-white rounded-[3rem] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]" placeholder="Describe your inquiry with as much clinical detail as possible..."></textarea>
                                    </div>

                                    <button className="w-full group/btn relative overflow-hidden bg-gray-900 text-white py-9 rounded-[3rem] font-black uppercase tracking-[0.4em] text-xs transition-all hover:scale-[1.01] active:scale-[0.98] shadow-2xl shadow-gray-900/20">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                                        <span className="relative z-10 flex items-center justify-center gap-5">
                                            <Send className="w-5 h-5" /> Secure Submission
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sophisticated Sidebar */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-[4.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="aspect-[5/6] rounded-[4rem] relative overflow-hidden shadow-2xl bg-white border-8 border-white">
                                <Image
                                    src="/contact-us-sidebar.png"
                                    alt="Medical Consultation"
                                    fill
                                    className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                                <div className="absolute bottom-10 left-10 right-10 p-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <p className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Premium Support</p>
                                    </div>
                                    <p className="text-white font-bold leading-relaxed">Dedicated channels for clinical partners & research institutions.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[4rem] p-12 border border-gray-100 shadow-sm space-y-12">
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-1 rounded-full bg-blue-600" />
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Global Hub</h3>
                                </div>

                                <div className="space-y-10">
                                    <div className="flex gap-6">
                                        <div className="w-14 h-14 bg-blue-50 flex-shrink-0 flex items-center justify-center rounded-2xl text-blue-600">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1 pt-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Headquarters</p>
                                            <p className="font-black text-gray-900 leading-snug">{contactAddress}</p>
                                        </div>
                                    </div>

                                    {[
                                        { icon: <Mail className="w-6 h-6" />, label: "Direct Email", val: contactEmail, href: `mailto:${contactEmail}`, color: "bg-indigo-50 text-indigo-600" },
                                        { icon: <Phone className="w-6 h-6" />, label: "Clincal Line", val: contactPhone, href: `tel:${contactPhone}`, color: "bg-emerald-50 text-emerald-600" }
                                    ].map((item, i) => (
                                        <a key={i} href={item.href} className="group/item flex gap-6 items-start">
                                            <div className={`w-14 h-14 ${item.color} flex-shrink-0 flex items-center justify-center rounded-2xl transition-all group-hover/item:scale-110 shadow-sm`}>
                                                {item.icon}
                                            </div>
                                            <div className="space-y-1 pt-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                                                <p className="font-black text-gray-900 text-lg group-hover/item:text-blue-600 transition-colors underline decoration-2 decoration-transparent group-hover/item:decoration-blue-100">{item.val}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-10 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-500">24/7 Monitoring</p>
                                </div>
                                <div className="px-5 py-2 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-100">
                                    Systems Online
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}


