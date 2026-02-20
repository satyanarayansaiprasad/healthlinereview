'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, User, Menu, X, ChevronDown, Info, MessageCircle, HelpCircle, FileCheck, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { NavLinkWithChildren } from '@/lib/site';

const iconByLabel: Record<string, React.ReactNode> = {
  'About Us': <Info className="w-4 h-4" />,
  'Contact Us': <MessageCircle className="w-4 h-4" />,
  'Frequently Asked Question': <HelpCircle className="w-4 h-4" />,
  'Review Guidelines': <FileCheck className="w-4 h-4" />,
};

const descByLabel: Record<string, string> = {
  'About Us': 'Our mission and story',
  'Contact Us': 'Get in touch',
  'Frequently Asked Question': 'Find quick answers',
  'Review Guidelines': 'How we test products',
};

type HeaderClientProps = {
  logoUrl: string;
  brandName: string;
  navLinks: NavLinkWithChildren[];
};

export default function HeaderClient({ logoUrl, brandName, navLinks }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const companyNav = navLinks.find((l) => l.label === 'Company');
  const companyLinks = companyNav?.children ?? [];
  const mainLinks = navLinks.filter((l) => l.label !== 'Company');

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link href="/" className="flex items-center shrink-0 group">
            <div className="relative w-48 h-12 md:w-56 md:h-14 group-hover:scale-[1.02] transition-transform duration-500">
              <Image
                src={logoUrl}
                alt={`${brandName} Logo`}
                fill
                className="object-contain object-left"
                priority
                unoptimized={logoUrl.endsWith('.svg')}
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {mainLinks.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="text-[11px] font-black text-[var(--color-muted)] hover:text-[var(--color-primary)] uppercase tracking-[0.2em] transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {companyNav && (
              <div
                className="relative"
                onMouseEnter={() => setIsCompanyOpen(true)}
                onMouseLeave={() => setIsCompanyOpen(false)}
              >
                <button className="flex items-center gap-1.5 py-8 group outline-none">
                  <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${isCompanyOpen ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)] group-hover:text-[var(--color-primary)]'}`}>
                    {companyNav.label}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-all duration-500 ${isCompanyOpen ? 'text-[var(--color-primary)] rotate-180' : 'text-gray-300'}`} />
                </button>
                {isCompanyOpen && companyLinks.length > 0 && (
                  <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-[320px] bg-white border border-gray-200 rounded-[2rem] shadow-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300 origin-top overflow-hidden">
                    <div className="space-y-1">
                      {companyLinks.map((link) => (
                        <Link
                          key={link.id}
                          href={link.href}
                          className="flex items-center gap-4 px-5 py-4 text-gray-600 hover:text-[var(--color-primary)] hover:bg-teal-50/50 rounded-2xl transition-all group/item"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[var(--color-muted)] group-hover/item:bg-white group-hover/item:text-[var(--color-primary)] group-hover/item:shadow-sm transition-all">
                            {iconByLabel[link.label] ?? <Info className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-[12px] font-black uppercase tracking-widest leading-none mb-1">{link.label}</p>
                            <p className="text-[10px] font-medium text-gray-400 truncate group-hover/item:text-teal-400">{descByLabel[link.label] ?? ''}</p>
                          </div>
                          <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="flex items-center space-x-3 md:space-x-5">
            <button className="text-[var(--color-muted)] hover:text-[var(--color-primary)] p-2 hover:bg-teal-50 rounded-xl transition-all" aria-label="Search">
              <Search className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <Link href="/admin" className="text-[var(--color-muted)] hover:text-[var(--color-primary)] p-2 hover:bg-teal-50 rounded-xl transition-all border-l border-gray-100 pl-4 md:pl-5">
              <User className="w-5 h-5 md:w-6 md:h-6" />
            </Link>
            <button
              className="lg:hidden p-2 text-gray-900 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-white transition-all duration-500 z-[100] overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="px-6 py-10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-2">
              {mainLinks.map((link) => (
                <Link key={link.id} href={link.href} className="block text-2xl font-black text-gray-900 px-4 py-4 hover:text-[var(--color-primary)] transition-colors border-b border-gray-50 uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              {companyLinks.map((link) => (
                <Link key={link.id} href={link.href} className="block text-2xl font-black text-gray-900 px-4 py-4 hover:text-[var(--color-primary)] transition-colors border-b border-gray-50 uppercase tracking-tighter" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-10 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] px-4 mb-6">Company</div>
              <div className="grid grid-cols-1 gap-4 pb-20">
                {companyLinks.map((link) => (
                  <Link key={link.id} href={link.href} className="flex items-center gap-4 px-5 py-5 bg-gray-50 hover:bg-teal-50 rounded-[2rem] transition-all group" onClick={() => setIsMenuOpen(false)}>
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[var(--color-muted)] group-hover:text-[var(--color-primary)] shadow-sm transition-all border border-gray-100">
                      {iconByLabel[link.label] ?? <Info className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-black uppercase tracking-widest text-gray-800">{link.label}</p>
                      <p className="text-[11px] font-medium text-gray-400">{descByLabel[link.label] ?? ''}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
