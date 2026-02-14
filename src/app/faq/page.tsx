'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HelpCircle, ChevronRight, Search, Plus, Minus, MessageCircle, HelpCircleIcon } from 'lucide-react';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: "How do you choose which products to review?",
            a: "Our editorial team monitors market trends, consumer requests, and retail best-sellers. We prioritize products that have a significant impact on health or those where there is a lack of transparent information."
        },
        {
            q: "What is your medical review process?",
            a: "Every article and review undergoes a rigorous three-step process: writing by certified subject matter experts, factual verification by our data team, and a final sign-off by a board-certified physician."
        },
        {
            q: "Are your reviews influenced by advertisements?",
            a: "Absolutely not. Our editorial team operates completely independently from our business and advertising departments. We do not accept payment for positive reviews or high rankings."
        },
        {
            q: "How often do you update your content?",
            a: "We audit our top content evergreen pages every 3-6 months. However, if new clinical data or safety warnings are released, we update relevant articles immediately."
        },
        {
            q: "Can I suggest a topic for you to cover?",
            a: "Yes! We welcome reader suggestions. Please use our Contact Us page to submit your ideas for articles or product reviews."
        }
    ];
    return (
        <div className="flex flex-col gap-16 md:gap-32 pb-32 bg-[#fbfcfd] font-sans">
            {/* Minimal High-End Hero */}
            <section className="bg-white pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-50/50 -skew-x-12 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-[100px] -ml-48 -mb-48" />

                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 text-blue-600 text-[10px] md:text-sm font-black uppercase tracking-[0.25em] border border-blue-100">
                            <HelpCircleIcon className="w-4 h-4 text-blue-500" />
                            Clinical Knowledge Base
                        </div>

                        <h1 className="text-5xl md:text-9xl font-black text-gray-900 tracking-tighter leading-[0.95]">
                            Find Your <br />
                            <span className="text-blue-600 italic">Answers.</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-gray-500 leading-relaxed font-medium max-w-2xl mx-auto">
                            Comprehensive responses to our methodology, clinical standards, and reader guidelines.
                        </p>

                        <div className="max-w-2xl mx-auto pt-8">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-10 flex items-center pointer-events-none">
                                    <Search className="h-6 w-6 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-20 pr-10 py-8 bg-white border-2 border-gray-100 rounded-[2.5rem] text-lg font-bold focus:outline-none focus:border-blue-600 focus:shadow-[0_20px_50px_-20px_rgba(37,99,235,0.2)] transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] placeholder:text-gray-300"
                                    placeholder="Search the health directory..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Questions List */}
            <section className="container mx-auto px-4 md:px-6 max-w-4xl">
                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`group bg-white border transition-all duration-500 overflow-hidden ${openIndex === i ? 'border-blue-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem]' : 'border-gray-100 hover:border-blue-100 rounded-[2rem]'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full text-left p-8 md:p-10 flex items-center justify-between gap-6"
                            >
                                <span className={`text-xl md:text-2xl font-black transition-colors ${openIndex === i ? 'text-blue-600' : 'text-gray-900'}`}>{faq.q}</span>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${openIndex === i ? 'bg-blue-600 text-white rotate-180 scale-110 shadow-lg shadow-blue-600/30' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                    {openIndex === i ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                </div>
                            </button>
                            <div className={`transition-all duration-500 ease-in-out ${openIndex === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-8 pb-10 md:px-10 md:pb-12 border-t border-gray-50 pt-8">
                                    <p className="text-lg md:text-xl text-gray-500 font-medium leading-[1.6]">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Support CTA */}
            <section className="container mx-auto px-4 md:px-6 max-w-5xl">
                <div className="bg-gray-900 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/faq-support-team.png"
                            alt="Support Team"
                            fill
                            className="object-cover opacity-20 group-hover:scale-110 transition-transform duration-[5s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/40 to-gray-900" />
                    </div>

                    <div className="relative z-10 space-y-10 animate-fade-in">
                        <div className="w-24 h-24 mx-auto rounded-[2rem] overflow-hidden border-2 border-white/20 shadow-2xl">
                            <Image
                                src="/faq-support-team.png"
                                alt="Support Avatar"
                                width={100}
                                height={100}
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight underline decoration-blue-600 underline-offset-8">Can't find what <br /> you're seeking?</h2>
                            <p className="text-lg text-gray-400 font-medium max-w-xl mx-auto italic">"Our human support team is standing by to bridge the gap between clinical data and your peace of mind."</p>
                        </div>
                        <button className="px-12 py-8 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-700 shadow-2xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">
                            Connect with Support
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
