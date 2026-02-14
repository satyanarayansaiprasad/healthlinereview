import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://healthlinereview.com';

    // In a real app, you would fetch all categories, articles, and reviews from DB
    const categories = ['wellness', 'nutrition', 'mental-health', 'fitness'];

    const categoryUrls = categories.map((slug) => ({
        url: `${baseUrl}/category/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...categoryUrls,
    ];
}
