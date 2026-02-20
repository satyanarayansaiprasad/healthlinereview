import { prisma } from '@/lib/prisma';

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    return {
      brandName: 'Health Line Review',
      logoUrl: '/logo.svg',
      tagline: 'Trusted Reviews, Honest Ratings and Quality Advice',
      primaryColor: '#0d9488',
      secondaryColor: '#1e293b',
      accentColor: '#0f766e',
      heroTitle: 'Trusted Reviews, Honest Ratings and Quality Advice',
      heroSubtitle: 'Health Line Review is your premier source for evidence-based health and wellness information and unbiased product reviews.',
      heroCtaPrimary: 'Explore Health Topics',
      heroCtaSecondary: 'Latest Reviews',
      footerTagline: 'Providing expert-reviewed health information, product reviews, and wellness tips.',
      contactEmail: 'contact@healthlinereview.com',
      contactPhone: '+1 (555) 123-4567',
      address: null as string | null,
    };
  }
  return {
    brandName: settings.brandName,
    logoUrl: settings.logoUrl,
    tagline: settings.tagline ?? undefined,
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    accentColor: settings.accentColor,
    heroTitle: settings.heroTitle ?? undefined,
    heroSubtitle: settings.heroSubtitle ?? undefined,
    heroCtaPrimary: settings.heroCtaPrimary ?? undefined,
    heroCtaSecondary: settings.heroCtaSecondary ?? undefined,
    footerTagline: settings.footerTagline ?? undefined,
    contactEmail: settings.contactEmail ?? undefined,
    contactPhone: settings.contactPhone ?? undefined,
    address: settings.address ?? null,
  };
}

export type NavLinkWithChildren = {
  id: string;
  label: string;
  href: string;
  order: number;
  children: { id: string; label: string; href: string; order: number }[];
};

export async function getNavLinks(): Promise<NavLinkWithChildren[]> {
  const links = await prisma.navLink.findMany({
    where: { parentId: null },
    orderBy: { order: 'asc' },
    include: {
      children: { orderBy: { order: 'asc' } },
    },
  });
  return links.map((l) => ({
    id: l.id,
    label: l.label,
    href: l.href,
    order: l.order,
    children: l.children.map((c) => ({
      id: c.id,
      label: c.label,
      href: c.href,
      order: c.order,
    })),
  }));
}

export type FooterLink = { label: string; href: string };
export type FooterSectionData = { title: string; links: FooterLink[] };

export async function getFooterSections(): Promise<FooterSectionData[]> {
  const sections = await prisma.footerSection.findMany({
    orderBy: { order: 'asc' },
  });
  return sections.map((s) => ({
    title: s.title,
    links: (s.links as FooterLink[]) ?? [],
  }));
}

export async function getPageContent(slug: string) {
  return prisma.pageContent.findUnique({
    where: { slug },
  });
}
