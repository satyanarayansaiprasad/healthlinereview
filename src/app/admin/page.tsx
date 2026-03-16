'use client';

import {
    FileText,
    Users,
    ShoppingBag,
    TrendingUp,
    Activity,
    Settings,
    LogOut
} from 'lucide-react';
import Link from 'next/link';

const stats = [
    { label: 'Total Articles', value: '1,280', icon: FileText, trend: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Product Reviews', value: '450', icon: ShoppingBag, trend: '+5%', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Users', value: '52,430', icon: Users, trend: '+18%', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Monthly Visitors', value: '1.2M', icon: TrendingUp, trend: '+25%', color: 'text-orange-600', bg: 'bg-orange-50' },
];

export default function AdminDashboard() {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-green-600 text-sm font-bold flex items-center">
                                <Activity className="w-3 h-3 mr-1" /> {stat.trend}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Remaining stats or other components could go here */}
        </div>
    );
}
