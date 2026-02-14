'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const topics = [
    {
        id: 1,
        title: 'Dietitian-Approved Foods To Boost Testosterone Naturally',
        image: '/topic-low-carb.png', // Reusing placeholder for demo
        link: '/article/testosterone-foods'
    },
    {
        id: 2,
        title: 'Best Low-Carb Vegetables, Recommended By Dietitians',
        image: '/topic-low-carb.png',
        link: '/article/low-carb-vegetables'
    },
    {
        id: 3,
        title: 'List Of Low-Calorie Foods – Nutritious Way For Healthy Diet',
        image: '/topic-fat-burning.png', // Reusing placeholder for demo
        link: '/article/low-calorie-foods'
    },
    {
        id: 4,
        title: '10 Fat-Burning Foods To Support Metabolism And Weight Loss',
        image: '/topic-fat-burning.png',
        link: '/article/fat-burning-foods'
    },
    {
        id: 5,
        title: 'Healthy Snacks For Quick Energy Boost',
        image: '/topic-low-carb.png', // Reusing placeholder
        link: '/article/healthy-snacks'
    }
];

export default function FeaturedTopics() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { clientWidth } = scrollContainerRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="container mx-auto px-4 md:px-6 py-20 border-t border-gray-100">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase tracking-tight">
                    Featured Topic
                </h2>
                <Link href="/topics" className="text-orange-500 font-bold hover:text-orange-600 inline-flex items-center gap-1 uppercase text-sm tracking-wide">
                    View All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="relative group">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}

                {/* Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {topics.map((topic) => (
                        <Link
                            key={topic.id}
                            href={topic.link}
                            className="min-w-[280px] md:min-w-[320px] snap-start group/card"
                        >
                            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden mb-4">
                                <Image
                                    src={topic.image}
                                    alt={topic.title}
                                    fill
                                    className="object-cover group-hover/card:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="font-bold text-gray-900 leading-tight group-hover/card:text-blue-600 transition-colors">
                                {topic.title}
                            </h3>
                        </Link>
                    ))}
                </div>

                {/* Right Arrow */}
                {showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                )}
            </div>
        </section>
    );
}
