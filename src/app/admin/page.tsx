import {
    FileText,
    Users,
    ShoppingBag,
    TrendingUp,
    Activity,
    Plus,
    Settings,
    Megaphone
} from 'lucide-react';
import Link from 'next/link';

const stats = [
    { label: 'Total Articles', value: '1,280', icon: FileText, trend: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Product Reviews', value: '450', icon: ShoppingBag, trend: '+5%', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Users', value: '52,430', icon: Users, trend: '+18%', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Monthly Visitors', value: '1.2M', icon: TrendingUp, trend: '+25%', color: 'text-orange-600', bg: 'bg-orange-50' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Welcome back, Super Admin</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/articles/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700">
                        <Plus className="w-4 h-4" /> New Article
                    </Link>
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

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="font-bold text-gray-900">Recent Articles</h2>
                        <Link href="/admin/articles" className="text-blue-600 text-sm hover:underline font-medium">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">Understanding Insulin Resistance</h4>
                                        <p className="text-xs text-gray-500">Author: Sarah J. • 2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">Published</span>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <Settings className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Megaphone className="w-10 h-10 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Campaign Performance</h3>
                        <p className="text-sm text-gray-500 mb-6">Your latest health campaign is reaching 4.2k people today.</p>
                        <button className="w-full btn-primary py-3">View Report</button>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 mb-6">System Health</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Database', status: 'Online', color: 'bg-green-500' },
                                { label: 'Storage', status: '92% Full', color: 'bg-orange-500' },
                                { label: 'API Endpoints', status: 'Online', color: 'bg-green-500' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{item.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-900">{item.status}</span>
                                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
