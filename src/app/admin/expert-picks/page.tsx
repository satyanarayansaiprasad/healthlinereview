'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Search, Edit2, Trash2, Globe, FileText,
    MoreVertical, Loader2, ArrowUpRight, BarChart3, Star
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

export default function AdminExpertPicksPage() {
    const [supplements, setSupplements] = useState<Supplement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSupplements();
    }, []);

    const fetchSupplements = async () => {
        try {
            const res = await fetch('/api/supplements?type=EXPERT_PICK');
            const data = await res.json();
            setSupplements(data);
        } catch (error) {
            console.error('Error fetching expert picks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteSupplement = async (id: string) => {
        if (!confirm('Are you sure you want to delete this expert pick?')) return;

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
                    <h1 className="text-3xl font-bold text-gray-900">Expert Picks</h1>
                    <p className="text-gray-500">Manage your curated product recommendations</p>
                </div>
                <Link
                    href="/admin/supplements/create"
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
                >
                    <Plus className="w-5 h-5" /> New Expert Pick
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search expert picks..."
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
                                        <div className="inline-flex px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-black">
                                            <Star className="w-3 h-3 mr-1 fill-yellow-600" /> {s.rank}/100
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
                                            <Link
                                                href={`/admin/supplements/edit/${s.id}`}
                                                className="p-2 text-gray-400 hover:text-gray-600"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </Link>
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
                        No expert picks found. Create your first one!
                    </div>
                )}
            </div>
        </div>
    );
}
