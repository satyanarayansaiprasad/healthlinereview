'use client';

import { useState, useEffect } from 'react';
import {
    Mail, Phone, MapPin, Save, Loader2, ArrowLeft,
    MessageSquare, CheckCircle, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ContactUsAdmin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [footerTagline, setFooterTagline] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data) {
                setEmail(data.contactEmail || '');
                setPhone(data.contactPhone || '');
                setAddress(data.address || '');
                setFooterTagline(data.footerTagline || '');
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setStatus(null);

        try {
            const res = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contactEmail: email,
                    contactPhone: phone,
                    address: address,
                    footerTagline: footerTagline,
                }),
            });

            if (res.ok) {
                setStatus({ type: 'success', message: 'Contact details updated successfully!' });
            } else {
                throw new Error('Failed to update settings');
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
                        <p className="text-gray-500">Update your public contact info and brand messages</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {status && (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <p className="font-bold text-sm">{status.message}</p>
                    </div>
                )}

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 flex items-center gap-2">
                                <Mail className="w-3 h-3 text-blue-500" /> Official Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                                placeholder="contact@healthlinereview.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 flex items-center gap-2">
                                <Phone className="w-3 h-3 text-green-500" /> Phone Number
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-red-500" /> Head Office Address
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows={3}
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 resize-none"
                            placeholder="Street, City, Country, Zip"
                        />
                    </div>

                    <div className="pt-6 border-t border-gray-50 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 flex items-center gap-2">
                            <MessageSquare className="w-3 h-3 text-purple-500" /> Footer Tagline
                        </label>
                        <input
                            type="text"
                            value={footerTagline}
                            onChange={(e) => setFooterTagline(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                            placeholder="Ensuring clinical accuracy in every review."
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
