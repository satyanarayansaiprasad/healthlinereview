'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HelpCircle, ChevronRight, Search, Plus, Minus, MessageCircle, HelpCircleIcon, Loader2 } from 'lucide-react';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    order: number;
}

export default function FAQ() {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await fetch('/api/faqs');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Filter active FAQs and sort by order
                    const activeFaqs = data.filter((f: any) => f.isActive).sort((a, b) => a.order - b.order);
                    setFaqs(activeFaqs);
                    setFilteredFaqs(activeFaqs);
                }
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    useEffect(() => {
        const filtered = faqs.filter(faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredFaqs(filtered);
    }, [searchQuery, faqs]);

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
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-20 pr-10 py-8 bg-white border-2 border-gray-100 rounded-[2.5rem] text-lg font-bold focus:outline-none focus:border-blue-600 focus:shadow-[0_20px_50px_-20px_rgba(37,99,235,0.2)] transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] placeholder:text-gray-300"
                                    placeholder="Search the health directory..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Questions List */}
            <section className="container mx-auto px-4 md:px-6 max-w-4xl min-h-[400px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Directory...</p>
                    </div>
                ) : filteredFaqs.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 animate-fade-in">
                        <HelpCircle className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No matches found</h3>
                        <p className="text-gray-500 font-medium">Try searching for different clinical terms or categories.</p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        {filteredFaqs.map((faq, i) => (
                            <div
                                key={faq.id}
                                className={`group bg-white border transition-all duration-500 overflow-hidden ${openIndex === i ? 'border-blue-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem]' : 'border-gray-100 hover:border-blue-100 rounded-[2rem]'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full text-left p-8 md:p-10 flex items-center justify-between gap-6"
                                >
                                    <span className={`text-xl md:text-2xl font-black transition-colors ${openIndex === i ? 'text-blue-600' : 'text-gray-900'}`}>{faq.question}</span>
                                    <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all ${openIndex === i ? 'bg-blue-600 text-white rotate-180 scale-110 shadow-lg shadow-blue-600/30' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                        {openIndex === i ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                    </div>
                                </button>
                                <div className={`transition-all duration-500 ease-in-out ${openIndex === i ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-8 pb-10 md:px-10 md:pb-12 border-t border-gray-50 pt-8">
                                        <p className="text-lg md:text-xl text-gray-500 font-medium leading-[1.6]">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight underline decoration-blue-600 underline-offset-8">Can&apos;t find what <br /> you&apos;re seeking?</h2>
                            <p className="text-lg text-gray-400 font-medium max-w-xl mx-auto italic">&quot;Our human support team is standing by to bridge the gap between clinical data and your peace of mind.&quot;</p>
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
