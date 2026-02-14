import {
    CheckCircle,
    XCircle,
    MessageSquare,
    Clock,
    Trash2,
    ExternalLink
} from 'lucide-react';

export default function CommentsAdmin() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Comment Moderation</h1>
                    <p className="text-gray-500">Approve or reject reader discussions</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold hover:bg-green-100 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Bulk Approve
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-6 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                        John Peterson <span className="text-xs text-gray-400 font-normal">john@example.com</span>
                                    </h4>
                                    <p className="text-xs text-blue-500 font-medium flex items-center gap-1 mt-1">
                                        On: The Science of Sleep <ExternalLink className="w-3 h-3" />
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                    <Clock className="w-3 h-3" /> Pending
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                "I've been trying the 4-7-8 breathing technique mentioned in this article, and it actually works! However, I wonder if it's safe for people with asthma?"
                            </p>
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-gray-400 font-medium">Oct 25, 2024 • 2:30 PM</span>
                                <div className="flex gap-2">
                                    <button className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors">
                                        Approve
                                    </button>
                                    <button className="px-4 py-1.5 bg-white border border-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors">
                                        Reject
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center py-10">
                <button className="text-blue-600 font-bold text-sm hover:underline">Load More Comments</button>
            </div>
        </div>
    );
}
