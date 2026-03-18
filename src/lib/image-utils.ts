/**
 * Standard health/wellness Unsplash images for consistent thematic fallbacks.
 */
export const FALLBACK_IMAGES: Record<string, string> = {
    'supplements': 'https://images.unsplash.com/photo-1471864190281-a93a3072467a?auto=format&fit=crop&q=80&w=800',
    'joint-pain': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=800',
    'weight-loss': 'https://images.unsplash.com/photo-1517861962386-353ba039d67e?auto=format&fit=crop&q=80&w=800',
    'vitamins': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    'wellness': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    'mental-health': 'https://images.unsplash.com/photo-1523348834469-65fc06be220f?auto=format&fit=crop&q=80&w=800',
    'fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
    'nutrition': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800',
    'skincare': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    'generic-medical': 'https://images.unsplash.com/photo-1505751172107-573225a46320?auto=format&fit=crop&q=80&w=800',
    'generic-product': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    'expert': 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=600&h=600'
};

/**
 * Returns a high-quality Unsplash image URL based on category or type.
 * @param type Category slug or generic type (e.g., 'supplements', 'expert')
 * @returns Unsplash image URL
 */
export function getPlaceholderImage(type?: string): string {
    if (!type) return FALLBACK_IMAGES['generic-medical'];
    
    // Exact match
    if (FALLBACK_IMAGES[type]) return FALLBACK_IMAGES[type];
    
    // Fuzzy match for common health terms
    const lowerType = type.toLowerCase();
    if (lowerType.includes('joint') || lowerType.includes('bone') || lowerType.includes('move')) return FALLBACK_IMAGES['joint-pain'];
    if (lowerType.includes('weight') || lowerType.includes('keto') || lowerType.includes('fat')) return FALLBACK_IMAGES['weight-loss'];
    if (lowerType.includes('vitamin') || lowerType.includes('supplement') || lowerType.includes('pill') || lowerType.includes('health')) return FALLBACK_IMAGES['supplements'];
    if (lowerType.includes('brain') || lowerType.includes('mind') || lowerType.includes('mood') || lowerType.includes('mental')) return FALLBACK_IMAGES['mental-health'];
    if (lowerType.includes('skin') || lowerType.includes('beauty') || lowerType.includes('face') || lowerType.includes('hair') || lowerType.includes('biotin')) return FALLBACK_IMAGES['skincare'];
    if (lowerType.includes('fit') || lowerType.includes('gym') || lowerType.includes('muscle') || lowerType.includes('cardio') || lowerType.includes('testosterone')) return FALLBACK_IMAGES['fitness'];
    if (lowerType.includes('nutrition') || lowerType.includes('food') || lowerType.includes('tea') || lowerType.includes('gut') || lowerType.includes('diet')) return FALLBACK_IMAGES['nutrition'];
    if (lowerType.includes('wellness') || lowerType.includes('lifestyle')) return FALLBACK_IMAGES['wellness'];
    
    return FALLBACK_IMAGES['generic-medical'];
}
