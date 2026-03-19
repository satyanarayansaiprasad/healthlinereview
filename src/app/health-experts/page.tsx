import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { User, Award, Stethoscope, ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HealthExpertsDirectory() {
    const experts = await prisma.healthExpert.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <Link href="/health-topics" className="inline-flex items-center text-blue-600 font-bold mb-6 hover:gap-2 transition-all">
                        <ChevronLeft className="w-5 h-5" /> Back to Health Topics
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Meet Our <span className="text-blue-600">Health Experts</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl">
                        Our team of board-certified physicians, specialists, and health professionals who ensure our content remains accurate and trustworthy.
                    </p>
                </div>
            </header>

            {/* List */}
            <main className="container mx-auto px-4 md:px-6 py-16">
                {experts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {experts.map((expert) => (
                            <div key={expert.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full bg-blue-50 mb-6 overflow-hidden border-4 border-white shadow-md group-hover:border-blue-100 transition-all flex flex-shrink-0 items-center justify-center">
                                    <img src={expert.imageUrl} alt={expert.name} className="w-full h-full object-cover" />
                                </div>

                                <h3 className="text-2xl font-extrabold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {expert.name}
                                </h3>
                                <p className="text-blue-600 font-bold text-sm mb-4">
                                    {expert.designation}
                                </p>

                                {expert.specializations.length > 0 && (
                                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                                        {expert.specializations.map((spec) => (
                                            <span key={spec} className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-extrabold uppercase tracking-wider rounded-full border border-gray-100">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-auto w-full pt-6 border-t border-gray-50 flex items-center justify-center gap-6 text-gray-400">
                                    <div className="flex flex-col items-center gap-1">
                                        <Award className="w-5 h-5 text-blue-300" />
                                        <span className="text-[10px] font-bold uppercase">Certified</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Stethoscope className="w-5 h-5 text-blue-300" />
                                        <span className="text-[10px] font-bold uppercase">Expert</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                            <User className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            Our team is currently <span className="text-blue-600">expanding.</span>
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We're currently assembling our pool of experts. Please check back soon!
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
