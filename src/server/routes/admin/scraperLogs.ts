import { Router } from 'express';
import { db } from '../../db.js';
import { scraperJobs } from '../../../../db/schema.js';
import { eq, desc } from 'drizzle-orm';

const router = Router();
const requireAdmin = (req: any, res: any, next: any) => { if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' }); next(); };

router.get('/', requireAdmin, async (req: any, res: any) => {
  try {
    const { limit = '50', status } = req.query;
    const q = db.select().from(scraperJobs).orderBy(desc(scraperJobs.createdAt)).limit(Number(limit));
    res.json(status ? await q.where(eq(scraperJobs.status, status as string)) : await q);
  } catch (e) { res.status(500).json({ error: 'Failed to fetch logs' }); }
});

router.get('/:id', requireAdmin, async (req: any, res: any) => {
  try {
    const [job] = await db.select().from(scraperJobs).where(eq(scraperJobs.id, req.params.id));
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (e) { res.status(500).json({ error: 'Failed to fetch job' }); }
});

export default router;
