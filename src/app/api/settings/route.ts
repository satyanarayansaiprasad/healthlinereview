import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        let settings = await prisma.siteSettings.findFirst();

        if (!settings) {
            // Create default settings if none exist
            settings = await prisma.siteSettings.create({
                data: {
                    brandName: 'Health Line Review',
                    contactEmail: 'contact@healthlinereview.com',
                    contactPhone: '+1 (555) 000-0000',
                    address: '123 Wellness Way, Medical District, NY 10001',
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { contactEmail, contactPhone, address, footerTagline } = body;

        let settings = await prisma.siteSettings.findFirst();

        if (settings) {
            settings = await prisma.siteSettings.update({
                where: { id: settings.id },
                data: {
                    contactEmail,
                    contactPhone,
                    address,
                    footerTagline,
                }
            });
        } else {
            settings = await prisma.siteSettings.create({
                data: {
                    contactEmail,
                    contactPhone,
                    address,
                    footerTagline,
                }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
