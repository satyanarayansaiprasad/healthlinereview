/**
 * Diverse health/wellness Unsplash images for rich, varied fallbacks.
 */
const GLOBAL_IMAGE_POOL = [
    '1528272252360-5efd274e36fb', '1559087316-6b27308e53f6', '1585830812369-b88fce3bee22', 
    '1592323818181-f9b967ff537c', '1596177582967-a5d143a41237', '1517836357463-d25dfeac3438',
    '1518611012118-696072aa579a', '1526506118085-60ce8714f8c5', '1539794830467-1f1755804d13',
    '1541534741688-6078c6bfb5c5', '1467453678174-768ec283a940', '1476718406336-bb5a9690ee2a',
    '1490818387583-1baba5e638af', '1493770348161-369560ae357d', '1498837167922-ddd27525d352',
    '1512438241418-c2652ad2e4d7', '1522202176988-66273c2fd55f', '1529693662653-9d4805307544',
    '1532054241088-402b4150db33', '1554284126-aa88f22d8b74', '1558017487-06bf9f82613a',
    '1561043433-aaf687c4cf04', '1565895405138-6c3a1555da6a', '1571019613454-1cb2f99b2d8b',
    '1581009137042-c552e485697a', '1583454110551-21f2fa2afe61', '1611077543575-445af69a7adf',
    '1611077543693-a0194a16b034', '1490645935967-10de6ba17061', '1521804906057-1df8fdb718b7',
    '1470167290877-7d5d3446de4c', '1584308666744-24d5c474f2ae', '1550596334-7bb40a71b6bc',
    '1559757175-0eb30cd8c063', '1556228578-0d85b1a4d571'
];

/**
 * Deterministic hash function to pick the same image for the same term.
 */
function getHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit int
    }
    // Salt hash to scramble the specific collision reported
    return Math.abs(hash ^ 0x5bf03642);
}

/**
 * Returns a high-quality, diverse Unsplash image URL based on category or type.
 * @param type Category slug or generic type (e.g., 'supplements', 'expert')
 * @param index Optional loop index to guarantee local uniqueness in grids
 * @returns Unsplash image URL
 */
export function getPlaceholderImage(type?: string, index?: number): string {
    if (!type) {
        const idx = index !== undefined ? index % GLOBAL_IMAGE_POOL.length : 0;
        return `https://images.unsplash.com/photo-${GLOBAL_IMAGE_POOL[idx]}?auto=format&fit=crop&q=80&w=800`;
    }
    
    // Hash string, add index as extreme salt
    let baseValue = getHash(type);
    if (index !== undefined) {
        baseValue = baseValue + (index * 73); 
    }
    
    const hashIndex = baseValue % GLOBAL_IMAGE_POOL.length;
    const photoId = GLOBAL_IMAGE_POOL[hashIndex];
    
    return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=800`;
}
