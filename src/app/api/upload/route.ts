import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    console.log('[API/Upload] Cloudinary upload started');

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const folder = (formData.get('folder') as string) || 'uploads';

        if (!file) {
            console.error('[API/Upload] No file found in FormData');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert File/Blob to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using a Promise-wrapped stream
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `healthline/${folder}`,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) {
                        console.error('[API/Upload] Cloudinary stream error:', error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            uploadStream.end(buffer);
        });

        const result = uploadResult as any;
        console.log(`[API/Upload] Cloudinary success: ${result.secure_url}`);

        return NextResponse.json({
            success: true,
            url: result.secure_url
        });

    } catch (error: any) {
        console.error('[API/Upload] Global Upload Error:', error);
        return NextResponse.json({
            error: 'Internal server error during cloud upload',
            details: error.message
        }, { status: 500 });
    }
}
