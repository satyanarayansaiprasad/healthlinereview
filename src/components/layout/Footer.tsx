import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';
import { getSiteSettings, getFooterSections } from '@/lib/site';

export default async function Footer() {
  const [settings, sections] = await Promise.all([getSiteSettings(), getFooterSections()]);

  return (
    <footer className="bg-[var(--color-secondary)] text-gray-300 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center">
              <div className="relative w-48 h-12 md:w-52 md:h-14 rounded overflow-hidden">
                <Image
                  src={settings.logoUrl}
                  alt={`${settings.brandName} Logo`}
                  fill
                  className="object-contain object-left"
                  unoptimized={settings.logoUrl.endsWith('.svg')}
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              {settings.footerTagline ?? 'Providing expert-reviewed health information, product reviews, and wellness tips to help you live a healthier life.'}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-4 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-[var(--color-primary)] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              {settings.contactEmail && (
                <li className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-[var(--color-primary)] transition-colors">{settings.contactEmail}</a>
                </li>
              )}
              {settings.contactPhone && (
                <li className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <span>{settings.contactPhone}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} {settings.brandName}. All rights reserved. The content on this site is for informational purposes only and is not intended as medical advice.
          </p>
          <div className="flex space-x-6 text-xs text-gray-500">
            <Link href="/review-guidelines" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/faq" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
