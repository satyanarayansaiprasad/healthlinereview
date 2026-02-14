import {
    Plus,
    Star,
    MapPin,
    ExternalLink,
    Edit,
    Trash2
} from 'lucide-react';
import Link from 'next/link';

export default function ProductReviewsAdmin() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
                    <p className="text-gray-500">Manage affiliate products and expert reviews</p>
                </div>
                <Link href="/admin/reviews/create" className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Product
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                        <div className="aspect-square bg-gray-50 flex items-center justify-center p-8 relative">
                            <div className="w-full h-full bg-green-50 rounded-xl" />
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-white rounded-lg shadow-sm text-gray-400 hover:text-blue-600 border border-gray-100">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-white rounded-lg shadow-sm text-gray-400 hover:text-red-600 border border-gray-100">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-1 text-yellow-500 mb-2">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-gray-900 font-bold">4.9</span>
                                <span className="text-gray-400 text-xs font-medium ml-1">(24 Reviews)</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Premium Fish Oil Omega-3</h3>
                            <p className="text-sm text-gray-500 mb-6 line-clamp-2">High-potency molecularly distilled fish oil for heart and brain health.</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="text-xs text-blue-600 font-bold flex items-center gap-1 uppercase tracking-wider">
                                    Affiliate Active
                                </div>
                                <a href="#" className="text-gray-400 hover:text-gray-600">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
