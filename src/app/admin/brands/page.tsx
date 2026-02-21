'use client';

import { useState, useEffect } from 'react';
import { Plus, Star, Trash2, Globe, Image as ImageIcon, Loader2, Search } from 'lucide-react';
import Image from 'next/image';

interface Brand {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    isStarred: boolean;
    createdAt: string;
}

export default function AdminBrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [name, setName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await fetch('/api/brands');
            const data = await response.json();
            setBrands(data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleAddBrand = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/brands', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, logoUrl }),
            });

            if (response.ok) {
                setName('');
                setLogoUrl('');
                fetchBrands();
            }
        } catch (error) {
            console.error('Error adding brand:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleStar = async (id: string, currentStarred: boolean) => {
        try {
            const response = await fetch(`/api/brands/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isStarred: !currentStarred }),
            });

            if (response.ok) {
                setBrands(brands.map(b => b.id === id ? { ...b, isStarred: !currentStarred } : b));
            }
        } catch (error) {
            console.error('Error toggling star:', error);
        }
    };

    const deleteBrand = async (id: string) => {
        if (!confirm('Are you sure you want to delete this brand?')) return;

        try {
            const response = await fetch(`/api/brands/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setBrands(brands.filter(b => b.id !== id));
            }
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
                    <p className="text-gray-500">Add and manage brand logos for your platform</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Brand Form */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" /> Add New Brand
                    </h2>
                    <form onSubmit={handleAddBrand} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Nike, Apple"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={logoUrl}
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://example.com/logo.png"
                                    required
                                />
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        {logoUrl && (
                            <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex flex-col items-center gap-2">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Logo Preview</p>
                                <div className="relative w-24 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center p-2">
                                    <img src={logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Brand'}
                        </button>
                    </form>
                </div>

                {/* Brands List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search brands..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                            {filteredBrands.length} Brands
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
                            {isFetching ? (
                                <div className="col-span-full p-12 flex flex-col items-center gap-4 bg-white">
                                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                    <p className="text-gray-500 font-medium">Loading brands...</p>
                                </div>
                            ) : filteredBrands.length === 0 ? (
                                <div className="col-span-full p-12 flex flex-col items-center gap-4 bg-white">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No brands found</p>
                                </div>
                            ) : (
                                filteredBrands.map((brand) => (
                                    <div key={brand.id} className="bg-white p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 p-2 flex items-center justify-center relative overflow-hidden">
                                                <img src={brand.logoUrl} alt={brand.name} className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{brand.name}</h4>
                                                <p className="text-xs text-gray-500">Added on {new Date(brand.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => toggleStar(brand.id, brand.isStarred)}
                                                className={`p-2 rounded-lg transition-colors ${brand.isStarred ? 'bg-yellow-50 text-yellow-500' : 'hover:bg-gray-100 text-gray-400'}`}
                                                title={brand.isStarred ? "Unstar" : "Star"}
                                            >
                                                <Star className={`w-5 h-5 ${brand.isStarred ? 'fill-current' : ''}`} />
                                            </button>
                                            <button
                                                onClick={() => deleteBrand(brand.id)}
                                                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
