import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';

export async function POST(req: Request) {
    console.log('[API/Upload] Started POST request');

    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const folder = (formData.get('folder') as string) || 'uploads';

        // 1. Validate File existence
        if (!file) {
            console.error('[API/Upload] No file found in FormData');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 2. Safely extract metadata (handles both File and Blob)
        // File objects have .name, Blobs might not.
        const originalName = (file as any).name || 'upload.png';
        const fileExt = originalName.includes('.') ? originalName.split('.').pop() : 'png';

        // 3. Convert to ArrayBuffer -> Buffer
        let buffer: Buffer;
        if (file instanceof Blob) {
            const bytes = await file.arrayBuffer();
            buffer = Buffer.from(bytes);
        } else {
            console.error('[API/Upload] Provided file is not a valid Blob/File');
            return NextResponse.json({ error: 'Invalid file object' }, { status: 400 });
        }

        // 4. Resolve Absolute Upload Directory
        const rootDir = process.cwd();
        const uploadDir = join(rootDir, 'public', 'uploads', folder);
        console.log(`[API/Upload] Target directory: ${uploadDir}`);

        // 5. Ensure directory exists with recursive flag
        try {
            if (!fs.existsSync(uploadDir)) {
                console.log(`[API/Upload] Directory does not exist, creating: ${uploadDir}`);
                await mkdir(uploadDir, { recursive: true });
            }
        } catch (dirError: any) {
            console.error(`[API/Upload] Directory creation failed: ${dirError.message}`);
            // We continue as writeFile might still work if the OS handles the race condition
        }

        // 6. Generate Unique Path
        const fileName = `${randomUUID()}.${fileExt}`;
        const finalDest = join(uploadDir, fileName);

        // 7. Write to Filesystem
        await writeFile(finalDest, buffer);
        console.log(`[API/Upload] File written successfully: ${finalDest}`);

        // 8. Construct Public URL
        const publicUrl = `/uploads/${folder}/${fileName}`;

        return NextResponse.json({
            success: true,
            url: publicUrl
        });

    } catch (error: any) {
        console.error('[API/Upload] Global Upload Error:', error);
        return NextResponse.json({
            error: 'Internal server error during upload',
            details: error.message
        }, { status: 500 });
    }
}
