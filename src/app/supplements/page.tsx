import { Pill, Search, Filter } from 'lucide-react';

export default function SupplementsPage() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                <div className="max-w-2xl">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Expert Supplement Guides</h1>
                    <p className="text-xl text-gray-500">
                        Scientifically backed reviews and comparisons of the highest quality supplements on the market.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-xl font-bold text-gray-900 border border-gray-100">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                    { name: 'Omega-3 Purity Guide', desc: 'The best fish oil supplements for heart and brain health.' },
                    { name: 'Vegan Protein Powders', desc: 'Top-rated plant-based proteins compared side-by-side.' },
                    { name: 'Mushroom Extracts 2024', desc: 'Analyzing the efficacy of lions mane and reishi supplements.' },
                    { name: 'Magnesium for Sleep', desc: 'Which forms of magnesium are best for deep recovery?' },
                ].map((guide) => (
                    <div key={guide.name} className="flex gap-8 p-10 bg-white border border-gray-100 rounded-[40px] hover:shadow-2xl transition-all group cursor-pointer">
                        <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-colors">
                            <Pill className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{guide.name}</h3>
                            <p className="text-gray-500 leading-relaxed">{guide.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
