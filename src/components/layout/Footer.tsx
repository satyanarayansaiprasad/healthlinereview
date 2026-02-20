import Link from 'next/link';
import Image from 'next/image';
import { Mail, Facebook, Twitter, Instagram, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center">
                            <div className="relative w-64 h-16 rounded overflow-hidden">
                                <Image
                                    src="/logo.png"
                                    alt="Health Line Review Logo"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Providing expert-reviewed health information, product reviews, and wellness tips to help you live a healthier life.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-blue-500 transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-pink-500 transition-colors"><Instagram className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Explore</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/health-topics" className="hover:text-blue-400">Health Topics</Link></li>
                            <li><Link href="/brands" className="hover:text-blue-400">Brands</Link></li>
                            <li><Link href="/supplements" className="hover:text-blue-400">Supplements</Link></li>
                            <li><Link href="/product-reviews" className="hover:text-blue-400">Product Reviews</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/about-us" className="hover:text-blue-400">About Us</Link></li>
                            <li><Link href="/contact-us" className="hover:text-blue-400">Contact</Link></li>
                            <li><Link href="/editorial-policy" className="hover:text-blue-400">Editorial Policy</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-blue-400">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-blue-500" />
                                <span>contact@healthlinereview.com</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-blue-500" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500 text-center md:text-left">
                        © {new Date().getFullYear()} Health Line Review. All rights reserved. The content on this site is for informational purposes only and is not intended as medical advice.
                    </p>
                    <div className="flex space-x-6 text-xs text-gray-500">
                        <Link href="/terms" className="hover:text-white">Terms of Use</Link>
                        <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
