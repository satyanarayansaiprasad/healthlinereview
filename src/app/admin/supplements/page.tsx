'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Search, Edit2, Trash2, Globe, FileText,
    MoreVertical, Loader2, ArrowUpRight, BarChart3, Pill
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Supplement {
    id: string;
    title: string;
    slug: string;
    author: { name: string };
    createdAt: string;
    rank: number;
}

export default function AdminSupplementsPage() {
    const [supplements, setSupplements] = useState<Supplement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSupplements();
    }, []);

    const fetchSupplements = async () => {
        try {
            const res = await fetch('/api/supplements');
            const data = await res.json();
            setSupplements(data);
        } catch (error) {
            console.error('Error fetching supplements:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteSupplement = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const res = await fetch(`/api/supplements/${id}`, { method: 'DELETE' });
            if (res.ok) fetchSupplements();
        } catch (error) {
            console.error('Delete fail:', error);
        }
    };

    const filtered = supplements.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Supplement Guides</h1>
                    <p className="text-gray-500">Manage your high-performance blogging content</p>
                </div>
                <Link
                    href="/admin/supplements/create"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" /> New Guide
                </Link>
            </div>

            {/* Stats Row placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Posts</p>
                        <h3 className="text-2xl font-black text-gray-900">{supplements.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Avg. Ranking</p>
                        <h3 className="text-2xl font-black text-gray-900">
                            {supplements.length > 0 ? (supplements.reduce((a, b) => a + b.rank, 0) / supplements.length).toFixed(1) : '0'}
                        </h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                        <Pill className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Categories</p>
                        <h3 className="text-2xl font-black text-gray-900">Supplements</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search guides..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : filtered.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Content</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Expert</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-extrabold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{s.title}</span>
                                            <span className="text-xs text-gray-400 font-medium">/supplements/{s.slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600">
                                                {s.author.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">{s.author.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="inline-flex px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black">
                                            {s.rank}/100
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm text-gray-500 font-medium">{format(new Date(s.createdAt), 'MMM dd, yyyy')}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/supplements/${s.slug}`}
                                                target="_blank"
                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            >
                                                <ArrowUpRight className="w-5 h-5" />
                                            </Link>
                                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => deleteSupplement(s.id)}
                                                className="p-2 text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="py-20 text-center text-gray-500 font-medium">
                        No supplement guides found. Create your first one!
                    </div>
                )}
            </div>
        </div>
    );
}
