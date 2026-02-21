'use client';

import { useState, useEffect } from 'react';
import { Plus, Star, Trash2, Globe, Image as ImageIcon, Loader2, Search, User, X } from 'lucide-react';

interface HealthExpert {
    id: string;
    name: string;
    designation: string;
    specializations: string[];
    imageUrl: string;
    isFeatured: boolean;
    createdAt: string;
}

export default function AdminHealthTopicsPage() {
    const [experts, setExperts] = useState<HealthExpert[]>([]);
    const [name, setName] = useState('');
    const [designation, setDesignation] = useState('');
    const [specializationInput, setSpecializationInput] = useState('');
    const [specializations, setSpecializations] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = async () => {
        try {
            const response = await fetch('/api/experts');
            const data = await response.json();
            setExperts(data);
        } catch (error) {
            console.error('Error fetching experts:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'experts');

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.url) {
                setImageUrl(data.url);
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const addSpecialization = () => {
        if (specializationInput.trim() && !specializations.includes(specializationInput.trim())) {
            setSpecializations([...specializations, specializationInput.trim()]);
            setSpecializationInput('');
        }
    };

    const removeSpecialization = (spec: string) => {
        setSpecializations(specializations.filter(s => s !== spec));
    };

    const handleAddExpert = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/experts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    designation,
                    specializations,
                    imageUrl,
                    isFeatured
                }),
            });

            if (response.ok) {
                setName('');
                setDesignation('');
                setSpecializations([]);
                setImageUrl('');
                setIsFeatured(false);
                const fileInput = document.getElementById('image-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                fetchExperts();
            }
        } catch (error) {
            console.error('Error adding expert:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFeatured = async (id: string, currentFeatured: boolean) => {
        try {
            const response = await fetch(`/api/experts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isFeatured: !currentFeatured }),
            });

            if (response.ok) {
                setExperts(experts.map(e => e.id === id ? { ...e, isFeatured: !currentFeatured } : e));
            }
        } catch (error) {
            console.error('Error toggling featured status:', error);
        }
    };

    const deleteExpert = async (id: string) => {
        if (!confirm('Are you sure you want to delete this expert?')) return;

        try {
            const response = await fetch(`/api/experts/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setExperts(experts.filter(e => e.id !== id));
            }
        } catch (error) {
            console.error('Error deleting expert:', error);
        }
    };

    const filteredExperts = experts.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Health Experts</h1>
                    <p className="text-gray-500">Manage health experts and doctors for your platform</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Expert Form */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" /> Add New Expert
                    </h2>
                    <form onSubmit={handleAddExpert} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expert Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Dr. Pauline J. Jose"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                            <input
                                type="text"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Specialist in Family Medicine"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={specializationInput}
                                    onChange={(e) => setSpecializationInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addSpecialization();
                                        }
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add a specialization"
                                />
                                <button
                                    type="button"
                                    onClick={addSpecialization}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {specializations.map((spec) => (
                                    <span key={spec} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                                        {spec}
                                        <button type="button" onClick={() => removeSpecialization(spec)} className="hover:text-red-500">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image Upload</label>
                            <div className="relative">
                                <input
                                    id="image-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".svg,.png,.jpg,.jpeg,.webp"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {uploading && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative flex items-center gap-4">
                            <div className="h-px bg-gray-100 flex-1"></div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">OR</span>
                            <div className="h-px bg-gray-100 flex-1"></div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://example.com/dr-image.svg"
                                    required
                                />
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Display in Featured Section</label>
                        </div>

                        {imageUrl && (
                            <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex flex-col items-center gap-2">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Image Preview</p>
                                <div className="relative w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center p-2 overflow-hidden border-2 border-blue-100">
                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Expert'}
                        </button>
                    </form>
                </div>

                {/* Experts List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search experts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                            {filteredExperts.length} Experts
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
                            {isFetching ? (
                                <div className="col-span-full p-12 flex flex-col items-center gap-4 bg-white">
                                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                    <p className="text-gray-500 font-medium">Loading experts...</p>
                                </div>
                            ) : filteredExperts.length === 0 ? (
                                <div className="col-span-full p-12 flex flex-col items-center gap-4 bg-white">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                        <User className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No experts found</p>
                                </div>
                            ) : (
                                filteredExperts.map((expert) => (
                                    <div key={expert.id} className="bg-white p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 rounded-full border border-gray-100 flex items-center justify-center relative overflow-hidden">
                                                <img src={expert.imageUrl} alt={expert.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{expert.name}</h4>
                                                <p className="text-[10px] text-gray-500 font-medium">{expert.designation}</p>
                                                <p className="text-[10px] text-gray-400">Added on {new Date(expert.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => toggleFeatured(expert.id, expert.isFeatured)}
                                                className={`p-2 rounded-lg transition-colors ${expert.isFeatured ? 'bg-yellow-50 text-yellow-500' : 'hover:bg-gray-100 text-gray-400'}`}
                                                title={expert.isFeatured ? "Unfeature" : "Feature"}
                                            >
                                                <Star className={`w-5 h-5 ${expert.isFeatured ? 'fill-current' : ''}`} />
                                            </button>
                                            <button
                                                onClick={() => deleteExpert(expert.id)}
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
