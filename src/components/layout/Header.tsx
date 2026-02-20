import { getSiteSettings, getNavLinks } from '@/lib/site';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const [settings, navLinks] = await Promise.all([getSiteSettings(), getNavLinks()]);
  return (
    <HeaderClient
      logoUrl={settings.logoUrl}
      brandName={settings.brandName}
      navLinks={navLinks}
    />
  );
}
