'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    ShoppingBag,
    Users,
    Settings,
    MessageSquare,
    Mail,
    Megaphone,
    LogOut,
    FolderTree,
    Tags
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Articles', icon: FileText, href: '/admin/articles' },
    { label: 'Product Reviews', icon: ShoppingBag, href: '/admin/reviews' },
    { label: 'Categories', icon: FolderTree, href: '/admin/categories' },
    { label: 'Tags', icon: Tags, href: '/admin/tags' },
    { label: 'Users', icon: Users, href: '/admin/users' },
    { label: 'Comments', icon: MessageSquare, href: '/admin/comments' },
    { label: 'Ads', icon: Megaphone, href: '/admin/ads' },
    { label: 'Subscribers', icon: Mail, href: '/admin/subscribers' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

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
                    const isActive = pathname === item.href;
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
                <button className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors w-full">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
}
