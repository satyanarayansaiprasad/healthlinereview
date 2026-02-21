import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: Request) {
    console.log('[API/Upload] Request received');

    // Check Config early
    const config = {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    };

    if (!config.cloud_name || !config.api_key || !config.api_secret) {
        console.error('[API/Upload] MISSING CLOUDINARY CONFIG');
        return NextResponse.json({
            error: 'Server configuration error',
            details: 'Missing Cloudinary environment variables. Please check Vercel dashboard.',
            missing: {
                cloud_name: !config.cloud_name,
                api_key: !config.api_key,
                api_secret: !config.api_secret
            }
        }, { status: 500 });
    }

    cloudinary.config(config);

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const folder = (formData.get('folder') as string) || 'uploads';

        if (!file) {
            console.error('[API/Upload] No file provided');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        console.log(`[API/Upload] Processing file: ${file.name}, size: ${file.size}, folder: ${folder}`);

        // Convert to Base64 (More robust for some serverless environments than streams)
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        console.log('[API/Upload] Attempting Cloudinary upload...');

        const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
            folder: `healthline/${folder}`,
            resource_type: 'auto',
        });

        console.log(`[API/Upload] Cloudinary SUCCESS: ${uploadResponse.secure_url}`);

        return NextResponse.json({
            success: true,
            url: uploadResponse.secure_url
        });

    } catch (error: any) {
        console.error('[API/Upload] CRITICAL ERROR:', error);
        return NextResponse.json({
            error: 'Upload process failed',
            details: error.message,
            code: error.http_code || error.code || 'unknown'
        }, { status: 500 });
    }
}
