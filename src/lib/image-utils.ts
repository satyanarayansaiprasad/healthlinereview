/**
 * Standard health/wellness local images for consistent thematic fallbacks.
 * Using verified assets from the public directory.
 */
export const FALLBACK_IMAGES: Record<string, string> = {
    'supplements': '/images/supplements-hero.png',
    'joint-pain': '/cat-joint-pain.png',
    'weight-loss': '/cat-weight-loss.png',
    'vitamins': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    'wellness': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    'mental-health': 'https://images.unsplash.com/photo-1523348834469-65fc06be220f?auto=format&fit=crop&q=80&w=800',
    'fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
    'nutrition': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800',
    'skincare': '/cat-anti-aging.png',
    'generic-medical': 'https://images.unsplash.com/photo-1505751172107-573225a46320?auto=format&fit=crop&q=80&w=800',
    'generic-product': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    'expert': 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=600&h=600',
    'brain-health': '/cat-brain-health.png',
    'mens-health': '/cat-mens-health.png',
    'eye-cream': '/cat-eye-cream.png'
};

/**
 * Returns a high-quality local or Unsplash image URL based on category or type.
 * @param type Category slug or generic type (e.g., 'supplements', 'expert')
 * @returns Image URL path
 */
export function getPlaceholderImage(type?: string): string {
    if (!type) return FALLBACK_IMAGES['generic-medical'];
    
    // Normalize slug
    const slug = type.toLowerCase().replace(/\s+/g, '-');
    
    // Exact match
    if (FALLBACK_IMAGES[slug]) return FALLBACK_IMAGES[slug];
    
    // Fuzzy match for common health terms
    if (slug.includes('joint') || slug.includes('bone') || slug.includes('move')) return FALLBACK_IMAGES['joint-pain'];
    if (slug.includes('weight') || slug.includes('keto') || slug.includes('fat')) return FALLBACK_IMAGES['weight-loss'];
    if (slug.includes('vitamin') || slug.includes('supplement') || slug.includes('pill') || slug.includes('health')) return FALLBACK_IMAGES['supplements'];
    if (slug.includes('brain') || slug.includes('mind') || slug.includes('mood') || slug.includes('mental')) return FALLBACK_IMAGES['brain-health'] || FALLBACK_IMAGES['mental-health'];
    if (slug.includes('skin') || slug.includes('beauty') || slug.includes('face') || slug.includes('hair') || slug.includes('biotin') || slug.includes('aging')) return FALLBACK_IMAGES['skincare'];
    if (slug.includes('men')) return FALLBACK_IMAGES['mens-health'];
    if (slug.includes('eye')) return FALLBACK_IMAGES['eye-cream'];
    if (slug.includes('fit') || slug.includes('gym') || slug.includes('muscle') || slug.includes('cardio') || slug.includes('testosterone')) return FALLBACK_IMAGES['fitness'];
    if (slug.includes('nutrition') || slug.includes('food') || slug.includes('tea') || slug.includes('gut') || slug.includes('diet')) return FALLBACK_IMAGES['nutrition'];
    if (slug.includes('wellness') || slug.includes('lifestyle')) return FALLBACK_IMAGES['wellness'];
    
    return FALLBACK_IMAGES['generic-medical'];
}
