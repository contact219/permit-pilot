import { Router } from 'express';
import { db } from '../db.js';
import { projects, projectPermits, jurisdictions, permitTypes } from '../../../db/schema.js';
import { eq, and, desc, sql } from 'drizzle-orm';
import { analyzeProject } from '../services/claude.js';
import { checkRateLimit } from '../services/rate-limit.js';

const router = Router();
const requireAuth = (req: any, res: any, next: any) => { if (!req.user) return res.status(401).json({ error: 'Unauthorized' }); next(); };

const checkPlanLimit = async (userId: string, planTier: string) => {
  if (planTier === 'free') {
    const result = await db.select({ count: sql<number>`count(*)` }).from(projects).where(eq(projects.userId, userId));
    if (Number(result[0]?.count) >= 2) return { allowed: false, message: 'Free tier limited to 2 projects.' };
  }
  return { allowed: true };
};

router.post('/', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const limit = await checkPlanLimit(userId, req.user.planTier || 'free');
    if (!limit.allowed) return res.status(403).json({ error: 'Project limit exceeded', message: limit.message });

    const rate = await checkRateLimit(userId);
    if (!rate.allowed) return res.status(429).json({ error: 'Rate limit exceeded', resetAt: new Date(rate.resetAt).toISOString() });

    const { name, description, projectType, jurisdictionId, squareFootage, estimatedValue, address } = req.body;
    const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, jurisdictionId));
    if (!jurisdiction) return res.status(404).json({ error: 'Jurisdiction not found' });

    const [project] = await db.insert(projects).values({
      userId, name, description, projectType, jurisdictionId, squareFootage, estimatedValue, address, status: 'draft', intakeData: req.body,
    }).returning();

    const analysis = await analyzeProject({ description, projectType, squareFootage, address, jurisdiction: jurisdiction.name, estimatedValue, isCommercial: projectType?.includes('commercial') || false, existingStructure: true }, jurisdiction);
    await db.update(projects).set({ aiSummary: analysis.plainEnglishSummary }).where(eq(projects.id, project.id));

    for (const permit of analysis.requiredPermits) {
      const [pt] = await db.select().from(permitTypes).where(and(eq(permitTypes.jurisdictionId, jurisdictionId), eq(permitTypes.code, permit.code)));
      if (pt) await db.insert(projectPermits).values({ projectId: project.id, permitTypeId: pt.id, status: 'not_started', notes: `Priority: ${permit.priority}. ${permit.reason}` });
    }

    res.status(201).json({ project, analysis, rateLimit: rate });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to create project' }); }
});

router.get('/', requireAuth, async (req: any, res: any) => {
  try {
    const rows = await db.select().from(projects).where(eq(projects.userId, req.user.id)).orderBy(desc(projects.createdAt));
    res.json(rows);
  } catch (e) { res.status(500).json({ error: 'Failed to fetch projects' }); }
});

router.get('/:id', requireAuth, async (req: any, res: any) => {
  try {
    const [project] = await db.select().from(projects).where(and(eq(projects.id, req.params.id), eq(projects.userId, req.user.id)));
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, project.jurisdictionId!));
    const permits = await db.select({ pp: projectPermits, pt: permitTypes }).from(projectPermits).leftJoin(permitTypes, eq(projectPermits.permitTypeId, permitTypes.id)).where(eq(projectPermits.projectId, req.params.id));
    res.json({ project, jurisdiction, permits });
  } catch (e) { res.status(500).json({ error: 'Failed to fetch project' }); }
});

router.post('/:id/analyze', requireAuth, async (req: any, res: any) => {
  try {
    const rate = await checkRateLimit(req.user.id);
    if (!rate.allowed) return res.status(429).json({ error: 'Rate limit exceeded', resetAt: new Date(rate.resetAt).toISOString() });
    const [project] = await db.select().from(projects).where(and(eq(projects.id, req.params.id), eq(projects.userId, req.user.id)));
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, project.jurisdictionId!));
    const analysis = await analyzeProject({ description: project.description as string, projectType: project.projectType as string, squareFootage: project.squareFootage as number | undefined, address: project.address as string, jurisdiction: jurisdiction.name, estimatedValue: project.estimatedValue as unknown as number | undefined, isCommercial: (project.projectType as string | null)?.includes('commercial') || false, existingStructure: true }, jurisdiction as any);
    await db.update(projects).set({ aiSummary: analysis.plainEnglishSummary }).where(eq(projects.id, req.params.id));
    res.json({ analysis, rateLimit: rate });
  } catch (e) { res.status(500).json({ error: 'Analysis failed' }); }
});

router.delete('/:id', requireAuth, async (req: any, res: any) => {
  try {
    const deleted = await db.delete(projects).where(and(eq(projects.id, req.params.id), eq(projects.userId, req.user.id))).returning({ id: projects.id });
    if (deleted.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'Failed to delete project' }); }
});

export default router;
