import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown } from 'lucide-react';

export default async function ContactUs() {
    const settings = await prisma.siteSettings.findFirst();
    const contactEmail = settings?.contactEmail || "contact@healthlinereview.com";
    const contactPhone = settings?.contactPhone || "+1 (555) 000-0000";
    const contactAddress = settings?.address || "123 Wellness Way, Medical District, NY 10001";

    return (
        <div className="flex flex-col pb-24 bg-[#fbfcfd] font-sans">
            {/* Minimal High-End Hero */}
            <section className="bg-white pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden relative border-b border-gray-100">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/30 skew-x-12 translate-x-1/2" />
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-4xl space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] border border-blue-100">
                            <MessageSquare className="w-4 h-4" />
                            Direct Communication Channels
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-gray-900 leading-[1.1] tracking-tighter">
                            Let&apos;s Talk <br />
                            <span className="text-blue-600 italic">Wellness.</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-600 leading-relaxed font-medium max-w-2xl">
                            Whether you&apos;re a reader with a question or a brand looking for clinical verification, our specialized teams are ready to connect.
                        </p>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 md:px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    {/* Modern Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 md:p-16 rounded-[3rem] border border-gray-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black text-gray-900">Send a Message</h2>
                                    <p className="text-gray-500 font-medium">We typically respond to inquiries within 24-48 business hours.</p>
                                </div>

                                <form className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Full Identity</label>
                                            <input type="text" className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2rem] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-inner" placeholder="Dr. Jane Smith" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Electronic Mail</label>
                                            <input type="email" className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2rem] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-inner" placeholder="jane@clinic.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Inquiry Category</label>
                                        <div className="relative">
                                            <select className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2rem] outline-none transition-all font-bold text-gray-900 appearance-none shadow-inner cursor-pointer">
                                                <option>Editorial Review Request</option>
                                                <option>Clinical Correction</option>
                                                <option>Partnership & Advertising</option>
                                                <option>Press & Media Inquiry</option>
                                            </select>
                                            <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Your Message</label>
                                        <textarea rows={6} className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2rem] outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 resize-none shadow-inner" placeholder="How can our clinical team assist you today?"></textarea>
                                    </div>

                                    <button className="w-full bg-blue-600 text-white py-8 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-blue-700 shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 duration-300">
                                        <Send className="w-5 h-5" /> Dispatch Inquiry
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Premium Sidebar Content */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="aspect-[4/5] rounded-[3.5rem] relative overflow-hidden shadow-2xl group">
                            <Image
                                src="/contact-us-sidebar.png"
                                alt="Professional Consultation"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                            <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl">
                                <p className="text-white font-black text-xs uppercase tracking-[0.3em] mb-2">Corporate Inquiries</p>
                                <p className="text-white/80 font-medium">Connect with our dedicated medical board for institutional partnerships.</p>
                            </div>
                        </div>

                        <div className="bg-gray-900 rounded-[3rem] p-10 md:p-12 text-white relative overflow-hidden">
                            <div className="relative z-10 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black">Legal Protocol</h3>
                                    <p className="text-gray-400 font-medium leading-relaxed">Our clinical team reviews all inquiries within 24-48 business hours.</p>
                                    <div className="space-y-2 pt-2">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Headquarters</p>
                                        <div className="flex gap-3 text-sm font-medium text-gray-300">
                                            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-1" />
                                            <span>{contactAddress}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { icon: <Mail className="w-5 h-5" />, label: "Global Press", val: contactEmail, href: `mailto:${contactEmail}` },
                                        { icon: <Phone className="w-5 h-5" />, label: "Review Panel", val: contactPhone, href: `tel:${contactPhone}` }
                                    ].map((item, i) => (
                                        <a key={i} href={item.href} className="flex gap-5 items-center group/item transition-colors">
                                            <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-blue-500 group-hover/item:bg-white/10 transition-colors underline-offset-4 decoration-blue-500/0 hover:decoration-blue-500/100">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-0.5">{item.label}</p>
                                                <p className="font-bold tracking-tight text-white group-hover/item:text-blue-400 transition-colors">{item.val}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

