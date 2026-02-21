'use client';

import { useState, useEffect } from 'react';
import {
    Plus, HelpCircle, Save, Loader2, ArrowLeft,
    Trash2, Edit2, CheckCircle, AlertCircle, X,
    ChevronUp, ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    order: number;
    isActive: boolean;
}

export default function FAQsAdmin() {
    const router = useRouter();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Form states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [order, setOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const res = await fetch('/api/faqs');
            const data = await res.json();
            if (Array.isArray(data)) {
                setFaqs(data);
            }
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenForm = (faq?: FAQ) => {
        if (faq) {
            setEditingFaq(faq);
            setQuestion(faq.question);
            setAnswer(faq.answer);
            setOrder(faq.order);
            setIsActive(faq.isActive);
        } else {
            setEditingFaq(null);
            setQuestion('');
            setAnswer('');
            setOrder(faqs.length);
            setIsActive(true);
        }
        setIsFormOpen(true);
        setStatus(null);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingFaq(null);
        setQuestion('');
        setAnswer('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setStatus(null);

        const method = editingFaq ? 'PATCH' : 'POST';
        const body = editingFaq
            ? { id: editingFaq.id, question, answer, order: Number(order), isActive }
            : { question, answer, order: Number(order), isActive };

        try {
            const res = await fetch('/api/faqs', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setStatus({ type: 'success', message: `FAQ ${editingFaq ? 'updated' : 'created'} successfully!` });
                fetchFaqs();
                setTimeout(handleCloseForm, 1000);
            } else {
                throw new Error('Failed to save FAQ');
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            const res = await fetch(`/api/faqs?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setFaqs(faqs.filter(f => f.id !== id));
                setStatus({ type: 'success', message: 'FAQ deleted successfully!' });
            } else {
                throw new Error('Failed to delete FAQ');
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Could not delete FAQ.' });
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
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
                        <p className="text-gray-500">Manage global frequently asked questions</p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Add New FAQ
                </button>
            </div>

            {status && !isFormOpen && (
                <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-bold text-sm">{status.message}</p>
                </div>
            )}

            <div className="grid gap-4">
                {faqs.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                        <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold">No FAQs found. Create your first one!</p>
                    </div>
                ) : (
                    faqs.map((faq) => (
                        <div key={faq.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    <span className="font-black text-lg">{faq.order}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{faq.question}</h3>
                                    <p className="text-gray-500 line-clamp-1 text-sm font-medium">{faq.answer}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() => handleOpenForm(faq)}
                                    className="p-3 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(faq.id)}
                                    className="p-3 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-in-top">
                        <div className="p-8 md:p-12 space-y-8">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-black text-gray-900">{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h2>
                                <button onClick={handleCloseForm} className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {status && (
                                <div className={`p-4 rounded-2xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <p className="font-bold text-sm">{status.message}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Question</label>
                                    <input
                                        type="text"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        className="w-full px-8 py-5 bg-gray-50 border border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                                        placeholder="e.g., How do you review products?"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Answer</label>
                                    <textarea
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        rows={5}
                                        className="w-full px-8 py-5 bg-gray-50 border border-transparent focus:border-blue-600 focus:bg-white rounded-[2rem] outline-none transition-all font-bold text-gray-900 resize-none"
                                        placeholder="Provide a detailed clinical or editorial answer..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Display Order</label>
                                        <input
                                            type="number"
                                            value={order}
                                            onChange={(e) => setOrder(Number(e.target.value))}
                                            className="w-full px-8 py-5 bg-gray-50 border border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Status</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsActive(!isActive)}
                                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border ${isActive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
                                        >
                                            {isActive ? 'Active' : 'Hidden'}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
