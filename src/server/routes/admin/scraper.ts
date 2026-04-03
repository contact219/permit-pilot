import { Router } from 'express';
import { db } from '../../db.js';
import { jurisdictions, scraperJobs } from '../../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';

const router = Router();
const requireAdmin = (req: any, res: any, next: any) => { if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' }); next(); };

router.post('/run', requireAdmin, async (req: any, res: any) => {
  try {
    const { source = 'all' } = req.body;
    const jurList = await db.select().from(jurisdictions).where(eq(jurisdictions.isActive, true));
    const jobIds: string[] = [];
    for (const jur of jurList) {
      const [job] = await db.insert(scraperJobs).values({ source, status: 'pending', startedAt: null, completedAt: null, result: null, error: null }).returning({ id: scraperJobs.id });
      jobIds.push(job.id);
      console.log(`Queued job ${job.id} for jurisdiction ${jur.id}`);
    }
    res.status(201).json({ jobsCreated: jobIds.length, jobIds });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to start scraper job' }); }
});

router.get('/stats', requireAdmin, async (_: any, res: any) => {
  try {
    const count = async (where?: any) => {
      const q = db.select({ c: sql<number>`count(*)` }).from(scraperJobs);
      const r = where ? await q.where(where) : await q;
      return Number(r[0]?.c) || 0;
    };
    const [total, pending, success, failed] = await Promise.all([count(), count(eq(scraperJobs.status, 'pending')), count(eq(scraperJobs.status, 'completed')), count(eq(scraperJobs.status, 'failed'))]);
    res.json({ total, pending, success, failed });
  } catch (e) { res.status(500).json({ error: 'Failed to fetch stats' }); }
});

export default router;
