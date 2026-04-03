import archiver from 'archiver';

export async function createFormZip(files: Array<{ name: string; data: Buffer }>, res: any): Promise<void> {
  return new Promise((resolve, reject) => {
    res.set({ 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename="permit-forms.zip"' });
    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', (err: Error) => { if (!res.headersSent) res.status(500).json({ error: 'Failed to create ZIP' }); reject(err); });
    archive.on('end', () => resolve());
    archive.pipe(res);
    for (const file of files) archive.append(file.data, { name: file.name });
    archive.finalize();
  });
}
