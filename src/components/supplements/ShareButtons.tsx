'use client';

import { Facebook, Twitter, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
    title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleFacebookShare = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const handleTwitterShare = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="sticky top-32 space-y-4 flex lg:flex-col gap-4 items-center">
            <span className="hidden lg:block text-[10px] font-black text-gray-300 uppercase [writing-mode:vertical-rl] [text-orientation:mixed] tracking-widest mb-4">Share</span>

            <button
                onClick={handleFacebookShare}
                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                title="Share on Facebook"
            >
                <Facebook className="w-5 h-5" />
            </button>

            <button
                onClick={handleTwitterShare}
                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                title="Share on Twitter"
            >
                <Twitter className="w-5 h-5" />
            </button>

            <button
                onClick={handleCopyLink}
                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-green-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
                title="Copy Link"
            >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <LinkIcon className="w-5 h-5" />}
                {copied && (
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap">
                        Copied!
                    </span>
                )}
            </button>
        </div>
    );
}
