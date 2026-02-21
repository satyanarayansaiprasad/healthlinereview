import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';

export async function POST(req: Request) {
    console.log('--- Upload API Start ---');
    try {
        // 1. Check Content-Type
        const contentType = req.headers.get('content-type') || '';
        if (!contentType.includes('multipart/form-data')) {
            return NextResponse.json({ error: 'Invalid Content-Type' }, { status: 400 });
        }

        // 2. Parse FormData
        let formData: FormData;
        try {
            formData = await req.formData();
            console.log('FormData parsed successfully');
        } catch (parseErr: any) {
            console.error('Error parsing FormData:', parseErr);
            return NextResponse.json({ error: 'Failed to parse form data', details: parseErr.message }, { status: 400 });
        }

        // 3. Extract File and Folder
        const file = formData.get('file');
        const folder = (formData.get('folder') as string) || 'brands';
        console.log(`Folder: ${folder}`);

        if (!file || !(file instanceof Blob)) {
            console.error('No file found or not a Blob');
            return NextResponse.json({ error: 'No file uploaded or invalid file format' }, { status: 400 });
        }

        // 4. Extract metadata safely
        const fileNameOriginal = (file as any).name || 'upload.bin';
        const fileSize = file.size;
        console.log(`Original Name: ${fileNameOriginal}, Size: ${fileSize}`);

        // 5. Convert to Buffer
        let buffer: Buffer;
        try {
            const bytes = await file.arrayBuffer();
            buffer = Buffer.from(bytes);
            console.log('Buffer created successfully');
        } catch (bufErr: any) {
            console.error('Buffer conversion error:', bufErr);
            return NextResponse.json({ error: 'Failed to process file data', details: bufErr.message }, { status: 500 });
        }

        // 6. Define and Ensure Directory
        const root = process.cwd();
        const uploadDir = join(root, 'public', 'uploads', folder);
        console.log(`Upload Directory: ${uploadDir}`);

        try {
            if (!fs.existsSync(uploadDir)) {
                console.log('Creating directory...');
                await mkdir(uploadDir, { recursive: true });
                console.log('Directory created');
            } else {
                console.log('Directory already exists');
            }
        } catch (dirErr: any) {
            console.error('Directory error:', dirErr);
            return NextResponse.json({ error: 'Failed to create upload directory', details: dirErr.message }, { status: 500 });
        }

        // 7. Generate Random Name
        const ext = fileNameOriginal.includes('.') ? fileNameOriginal.split('.').pop() : 'bin';
        const newFileName = `${randomUUID()}.${ext}`;
        const finalPath = join(uploadDir, newFileName);
        console.log(`Final Path: ${finalPath}`);

        // 8. Write File
        try {
            await writeFile(finalPath, buffer);
            console.log('File written to disk');
        } catch (writeErr: any) {
            console.error('Write error:', writeErr);
            return NextResponse.json({ error: 'Failed to write file to disk', details: writeErr.message }, { status: 500 });
        }

        // 9. Return URL
        const publicUrl = `/uploads/${folder}/${newFileName}`;
        console.log(`Success: ${publicUrl}`);

        return NextResponse.json({ url: publicUrl });

    } catch (globalErr: any) {
        console.error('CRITICAL UNHANDLED UPLOAD ERROR:', globalErr);
        return NextResponse.json({
            error: 'Unexpected server error',
            details: globalErr.message,
            stack: globalErr.stack
        }, { status: 500 });
    }
}
