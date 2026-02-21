'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    ShoppingBag,
    Building2,
    Star,
    Heart,
    Pill,
    Award,
    MessageSquare,
    HelpCircle,
    FileText,
    Mail,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { label: 'Product Reviews', icon: ShoppingBag, href: '/admin/product-reviews' },
    { label: 'Brands', icon: Building2, href: '/admin/brands' },
    { label: 'Featured Topics', icon: Star, href: '/admin/featured-topics' },
    { label: 'Health Topics', icon: Heart, href: '/admin/health-topics' },
    { label: 'Supplements', icon: Pill, href: '/admin/supplements' },
    { label: 'Expert Picks', icon: Award, href: '/admin/expert-picks' },
    { label: 'Reviews', icon: MessageSquare, href: '/admin/reviews' },
    { label: 'FAQs', icon: HelpCircle, href: '/admin/faqs' },
    { label: 'Review Guidelines', icon: FileText, href: '/admin/review-guidelines' },
    { label: 'Contact Us', icon: Mail, href: '/admin/contact-us' },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout error:', error);
            // Still redirect even if API call fails
            window.location.href = '/admin/login';
        }
    };

    return (
        <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed">
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="font-bold">H</span>
                    </div>
                    <span className="text-xl font-bold">Admin CMS</span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 px-6 py-3 transition-colors hover:bg-gray-800",
                                isActive ? "bg-blue-600 text-white border-r-4 border-white" : "text-gray-400"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors w-full"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
}
