import { Router } from 'express';
import { db } from '../db.js';
import { projects, projectPermits, permitTypes } from '../../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { generateChecklist, prefillPermitForm, generateDataSheet } from '../services/pdf.js';
import { createFormZip } from '../services/zip.js';

const router = Router();
const requireAuth = (req: any, res: any, next: any) => { if (!req.user) return res.status(401).json({ error: 'Unauthorized' }); next(); };

router.get('/:id/checklist', requireAuth, async (req: any, res: any) => {
  try {
    const [project] = await db.select().from(projects).where(and(eq(projects.id, req.params.id), eq(projects.userId, req.user.id)));
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const permits = await db.select({ pp: projectPermits, pt: permitTypes }).from(projectPermits).leftJoin(permitTypes, eq(projectPermits.permitTypeId, permitTypes.id)).where(eq(projectPermits.projectId, req.params.id));
    const raw = await generateChecklist(project, permits);
    const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${(project as any).name}-checklist.pdf"`, 'Content-Length': buf.length });
    res.send(buf);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to generate checklist' }); }
});

router.get('/:id/forms', requireAuth, async (req: any, res: any) => {
  try {
    const [project] = await db.select().from(projects).where(and(eq(projects.id, req.params.id), eq(projects.userId, req.user.id)));
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const permits = await db.select({ pp: projectPermits, pt: permitTypes }).from(projectPermits).leftJoin(permitTypes, eq(projectPermits.permitTypeId, permitTypes.id)).where(eq(projectPermits.projectId, req.params.id));
    const withForms = permits.filter((i: any) => i.pt?.formUrls?.length > 0);
    if (withForms.length === 0) return res.status(404).json({ error: 'No forms available' });

    const p = project as any;
    const fieldData = { owner_name: p.intakeData?.companyName || 'Project Owner', project_address: p.address, project_description: p.description, sq_ft: p.squareFootage?.toString() || '', valuation: p.estimatedValue?.toString() || '', project_type: p.projectType || '' };
    const files: Array<{ name: string; data: Buffer }> = [];

    for (const item of withForms) {
      const permit = item.pt as any;
      const permitName = permit.name.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
      for (const formUrl of permit.formUrls) {
        try {
          let raw: any;
          try { raw = await prefillPermitForm(formUrl, fieldData); } catch { raw = await generateDataSheet(permit, fieldData, project); }
          const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
          const formName = formUrl.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'form';
          files.push({ name: `${permitName}_${formName}_prefilled.pdf`, data: buf });
        } catch (err) { console.error(`Error processing ${formUrl}:`, err); }
      }
    }

    await createFormZip(files, res);
  } catch (e) { if (!res.headersSent) res.status(500).json({ error: 'Failed to generate forms' }); }
});

export default router;
