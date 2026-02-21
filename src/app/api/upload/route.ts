import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
    console.log('--- Upload API Start ---');
    try {
        const formData = await req.formData();
        console.log('FormData parsed');

        const file = formData.get('file') as File;
        const folder = (formData.get('folder') as string) || 'brands';
        console.log(`Uploading to folder: ${folder}`);

        if (!file) {
            console.error('No file found in formData');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (typeof file === 'string') {
            console.error('File entry is a string, not a File object');
            return NextResponse.json({ error: 'Invalid file data' }, { status: 400 });
        }

        console.log(`File Name: ${file.name}`);
        console.log(`File Size: ${file.size} bytes`);
        console.log(`File Type: ${file.type}`);

        let buffer: Buffer;
        try {
            const bytes = await file.arrayBuffer();
            buffer = Buffer.from(bytes);
            console.log('File converted to buffer');
        } catch (bufErr: any) {
            console.error('Error converting file to buffer:', bufErr);
            throw new Error(`Buffer conversion failed: ${bufErr.message}`);
        }

        // Define upload directory
        const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
        console.log(`Target Directory: ${uploadDir}`);

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
            console.log('Target directory verified/created');
        } catch (dirErr: any) {
            console.error('Error ensuring directory exists:', dirErr);
            // Non-fatal if directory already exists but sometimes mkdir fails unexpectedly
        }

        // Generate unique filename
        const originalName = file.name || 'document.bin';
        const ext = originalName.split('.').pop() || 'bin';
        const fileName = `${randomUUID()}.${ext}`;
        const path = join(uploadDir, fileName);
        console.log(`Saving to path: ${path}`);

        // Save file
        try {
            await writeFile(path, buffer);
            console.log('File written to disk successfully');
        } catch (writeErr: any) {
            console.error('Error writing file to disk:', writeErr);
            throw new Error(`Disk write failed: ${writeErr.message}`);
        }

        // Return the public URL
        const publicUrl = `/uploads/${folder}/${fileName}`;
        console.log(`Public URL: ${publicUrl}`);
        console.log('--- Upload API Success ---');

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error('CRITICAL: Error uploading file:', error);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
