import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';

export async function POST(req: Request) {
    const logBatch: string[] = [`[${new Date().toISOString()}] Upload Start`];

    const safeLog = (msg: string) => {
        console.log(msg);
        logBatch.push(msg);
    };

    try {
        // 1. Check Content-Type
        const contentType = req.headers.get('content-type') || '';
        if (!contentType.includes('multipart/form-data')) {
            return NextResponse.json({
                error: 'Invalid Content-Type',
                received: contentType
            }, { status: 400 });
        }

        // 2. Parse FormData
        let formData: FormData;
        try {
            formData = await req.formData();
            safeLog('Step 1: FormData parsed');
        } catch (parseErr: any) {
            safeLog(`Step 1 Failure: ${parseErr.message}`);
            return NextResponse.json({
                error: 'FormData parse failed',
                details: parseErr.message
            }, { status: 400 });
        }

        // 3. Extract File and Folder
        const file = formData.get('file');
        const folder = (formData.get('folder') as string) || 'uploads';
        safeLog(`Step 2: Folder identified as "${folder}"`);

        if (!file || !(file instanceof Blob)) {
            safeLog('Step 2 Failure: File is missing or not a Blob');
            return NextResponse.json({
                error: 'No file uploaded or invalid format',
                type: typeof file
            }, { status: 400 });
        }

        // 4. File Metadata
        const fileNameOriginal = (file as any).name || 'unnamed_file';
        const fileSize = file.size;
        safeLog(`Step 3: File metadata - Name: ${fileNameOriginal}, Size: ${fileSize}`);

        // 5. ArrayBuffer to Buffer
        let buffer: Buffer;
        try {
            const bytes = await file.arrayBuffer();
            buffer = Buffer.from(bytes);
            safeLog('Step 4: Buffer conversion success');
        } catch (bufErr: any) {
            safeLog(`Step 4 Failure: ${bufErr.message}`);
            return NextResponse.json({
                error: 'Buffer conversion failed',
                details: bufErr.message
            }, { status: 500 });
        }

        // 6. Directory Resolution
        let uploadDir: string;
        try {
            const root = process.cwd();
            uploadDir = resolve(root, 'public', 'uploads', folder);
            safeLog(`Step 5: Directory resolved to ${uploadDir}`);
        } catch (dirResErr: any) {
            safeLog(`Step 5 Failure: ${dirResErr.message}`);
            return NextResponse.json({
                error: 'Directory resolution failed',
                details: dirResErr.message
            }, { status: 500 });
        }

        // 7. Ensure Directory
        try {
            if (!fs.existsSync(uploadDir)) {
                safeLog('Step 6: Creating directory...');
                await mkdir(uploadDir, { recursive: true });
                safeLog('Step 6: Directory created successfully');
            } else {
                safeLog('Step 6: Directory already exists');
            }
        } catch (mkdirErr: any) {
            safeLog(`Step 6 Failure: ${mkdirErr.message}`);
            return NextResponse.json({
                error: 'Directory creation failed',
                details: mkdirErr.message,
                path: uploadDir
            }, { status: 500 });
        }

        // 8. Generate Name and Path
        const ext = fileNameOriginal.includes('.') ? fileNameOriginal.split('.').pop() : 'bin';
        const newFileName = `${randomUUID()}.${ext}`;
        const finalPath = join(uploadDir, newFileName);
        safeLog(`Step 7: Final path decided as ${finalPath}`);

        // 9. Write to Disk
        try {
            await writeFile(finalPath, buffer);
            safeLog('Step 8: File written to disk successfully');
        } catch (writeErr: any) {
            safeLog(`Step 8 Failure: ${writeErr.message}`);
            return NextResponse.json({
                error: 'Disk write failed',
                details: writeErr.message,
                path: finalPath,
                logs: logBatch
            }, { status: 500 });
        }

        // 10. Success Return
        const publicUrl = `/uploads/${folder}/${newFileName}`;
        safeLog(`Step 9: Upload successful - ${publicUrl}`);

        return NextResponse.json({
            success: true,
            url: publicUrl,
            metadata: { name: newFileName, size: fileSize }
        });

    } catch (globalErr: any) {
        console.error('CRITICAL UNHANDLED ERROR:', globalErr);
        return NextResponse.json({
            error: 'Unhandled server error',
            details: globalErr.message,
            logs: logBatch
        }, { status: 500 });
    }
}
