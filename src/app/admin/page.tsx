'use client';

import {
    FileText,
    Users,
    ShoppingBag,
    TrendingUp,
    Activity,
    Settings,
    LogOut,
    Award,
    Hash,
    Pill,
    UserCheck,
    Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
    brands: number;
    reviews: number;
    topics: number;
    supplements: number;
    experts: number;
    articles: number;
}

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/stats');
                const data = await response.json();
                setStatsData(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/admin/login';
        }
    };

    const statsConfig = [
        { label: 'Total Brands', value: statsData?.brands ?? 0, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Product Reviews', value: statsData?.reviews ?? 0, icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Health Topics', value: statsData?.topics ?? 0, icon: Hash, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Supplements Added', value: statsData?.supplements ?? 0, icon: Pill, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Expert Picks', value: statsData?.experts ?? 0, icon: UserCheck, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Total Articles', value: statsData?.articles ?? 0, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Welcome back, Super Admin</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsConfig.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            {loading ? (
                                <div className="w-16 h-4 bg-gray-100 animate-pulse rounded" />
                            ) : (
                                <span className="text-green-600 text-sm font-bold flex items-center">
                                    <Activity className="w-3 h-3 mr-1" /> Live
                                </span>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                        {loading ? (
                            <div className="w-24 h-8 bg-gray-100 animate-pulse rounded mt-1" />
                        ) : (
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</h3>
                        )}
                    </div>
                ))}
            </div>

            {/* Remaining stats or other components could go here */}
        </div>
    );
}
