'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Menu, X, ChevronDown, Info, MessageCircle, HelpCircle, FileCheck, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const companyLinks = [
        { name: 'About Us', href: '/about-us', icon: <Info className="w-4 h-4" />, desc: 'Our mission and story' },
        { name: 'Contact Us', href: '/contact-us', icon: <MessageCircle className="w-4 h-4" />, desc: 'Get in touch' },
        { name: 'Frequently Asked Question', href: '/faq', icon: <HelpCircle className="w-4 h-4" />, desc: 'Find quick answers' },
        { name: 'Review Guidelines', href: '/review-guidelines', icon: <FileCheck className="w-4 h-4" />, desc: 'How we test products' },
    ];

    const mobileMainLinks = [
        { name: 'Health Topics', href: '/health-topics' },
        { name: 'Brands', href: '/brands' },
        { name: 'Supplements', href: '/supplements' },
        { name: 'Expert Picks', href: '/expert-picks' },
        { name: 'Reviews', href: '/product-reviews' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-20 md:h-24">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0 group">
                        <div className="relative w-56 h-16 md:w-80 md:h-24 group-hover:scale-[1.02] transition-transform duration-500">
                            <Image
                                src="/logo.png"
                                alt="Health Line Review Logo"
                                fill
                                className="object-contain object-left md:object-center"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {['Health Topics', 'Brands', 'Supplements'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase().replace(' ', '-')}`}
                                className="text-[11px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-colors"
                            >
                                {item}
                            </Link>
                        ))}

                        <Link href="/expert-picks" className="flex items-center gap-1.5 group">
                            <span className="text-[11px] font-black text-gray-400 group-hover:text-blue-600 uppercase tracking-[0.2em] transition-colors">Expert Picks</span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-600 transition-all" />
                        </Link>
                        <Link href="/product-reviews" className="flex items-center gap-1.5 group">
                            <span className="text-[11px] font-black text-gray-400 group-hover:text-blue-600 uppercase tracking-[0.2em] transition-colors">Reviews</span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-600 transition-all" />
                        </Link>

                        {/* Company Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsCompanyOpen(true)}
                            onMouseLeave={() => setIsCompanyOpen(false)}
                        >
                            <button className="flex items-center gap-1.5 py-8 group outline-none">
                                <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${isCompanyOpen ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`}>Company</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-all duration-500 ${isCompanyOpen ? 'text-blue-600 rotate-180' : 'text-gray-300'}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isCompanyOpen && (
                                <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-[320px] bg-white border border-gray-200 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] p-4 animate-in fade-in slide-in-from-top-2 duration-300 origin-top overflow-hidden">
                                    <div className="space-y-1">
                                        {companyLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="flex items-center gap-4 px-5 py-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-2xl transition-all group/item"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:bg-white group-hover/item:text-blue-600 group-hover/item:shadow-sm transition-all">
                                                    {link.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[12px] font-black uppercase tracking-widest leading-none mb-1">{link.name}</p>
                                                    <p className="text-[10px] font-medium text-gray-400 truncate group-hover/item:text-blue-400">{link.desc}</p>
                                                </div>
                                                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Search and Action Buttons */}
                    <div className="flex items-center space-x-3 md:space-x-5">
                        <button className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-xl transition-all">
                            <Search className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <Link href="/admin" className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-xl transition-all border-l border-gray-100 pl-4 md:pl-5">
                            <User className="w-5 h-5 md:w-6 md:h-6" />
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 text-gray-900 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 top-20 bg-white transition-all duration-500 z-[100] overflow-y-auto"
                    style={{ height: 'calc(100vh - 80px)' }}
                >
                    <div className="px-6 py-10 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="space-y-2">
                            {mobileMainLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block text-2xl font-black text-gray-900 px-4 py-4 hover:text-blue-600 transition-colors border-b border-gray-50 uppercase tracking-tighter"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="pt-10 space-y-2">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 px-4 mb-6">Corporate Directory</div>
                                <div className="grid grid-cols-1 gap-4 pb-20">
                                    {companyLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center gap-4 px-5 py-5 bg-gray-50 hover:bg-blue-50 rounded-[2rem] transition-all group"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 group-hover:text-blue-600 shadow-sm transition-all border border-gray-100">
                                                {link.icon}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[13px] font-black uppercase tracking-widest text-gray-800">{link.name}</p>
                                                <p className="text-[11px] font-medium text-gray-400">{link.desc}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
