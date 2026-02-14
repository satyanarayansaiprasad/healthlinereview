import {
    Plus,
    Search,
    UserPlus,
    Shield,
    Mail,
    MoreVertical,
    Edit,
    Trash2,
    Lock
} from 'lucide-react';

export default function UsersAdmin() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500">Manage editorial roles and permissions</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Add New User
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Articles</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {[
                            { name: 'Super Admin', email: 'admin@healthhub.pro', role: 'SUPER_ADMIN', count: 42, color: 'text-purple-600 bg-purple-50' },
                            { name: 'Sarah Johnson', email: 'sarah@healthhub.pro', role: 'EDITOR', count: 128, color: 'text-blue-600 bg-blue-50' },
                            { name: 'Mark Miller', email: 'mark@healthhub.pro', role: 'WRITER', count: 15, color: 'text-green-600 bg-green-50' },
                        ].map((user) => (
                            <tr key={user.email} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${user.color}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-medium">{user.count}</td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-blue-600 border border-transparent hover:border-gray-200">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-orange-600 border border-transparent hover:border-gray-200">
                                            <Lock className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-red-600 border border-transparent hover:border-gray-200">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
