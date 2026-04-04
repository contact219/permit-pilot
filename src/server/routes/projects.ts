import { Router } from 'express';
import { db } from '../db.js';
import { projects, projectPermits, jurisdictions, permitTypes, inspectionReminders } from '../../../db/schema.js';
import { eq, and, desc, sql } from 'drizzle-orm';
import { analyzeProject, parseNaturalLanguageProject, generateApplicationPacket } from '../services/claude.js';
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

    const rate = await checkRateLimit(userId, req.user.planTier || 'free');
    if (!rate.allowed) return res.status(429).json({ error: 'Rate limit exceeded', resetAt: new Date(rate.resetAt).toISOString() });

    const { name, description, projectType, jurisdictionId, squareFootage, estimatedValue, address } = req.body;
    const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, jurisdictionId));
    if (!jurisdiction) return res.status(404).json({ error: 'Jurisdiction not found' });

    const [project] = await db.insert(projects).values({
      userId, name, description, projectType, jurisdictionId, squareFootage, estimatedValue, address, status: 'draft', intakeData: req.body,
    }).returning();

    const analysis = await analyzeProject({ description, projectType, squareFootage, address, jurisdiction: jurisdiction.name, estimatedValue, isCommercial: projectType?.includes('commercial') || false, existingStructure: true }, jurisdiction);
    await db.update(projects).set({ aiSummary: analysis.plainEnglishSummary }).where(eq(projects.id, project.id));

    console.log('Claude returned permits:', JSON.stringify(analysis.requiredPermits));
    for (const permit of analysis.requiredPermits) {
      const [pt] = await db.select().from(permitTypes).where(and(eq(permitTypes.jurisdictionId, jurisdictionId), sql`lower(${permitTypes.code}) = lower(${permit.code})`));
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
    console.log('PROJECT:', project ? project.id : 'NOT FOUND');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, project.jurisdictionId!));
    console.log('JURISDICTION:', jurisdiction ? jurisdiction.name : 'NOT FOUND');
    const permits = await db.select({ pp: projectPermits, pt: permitTypes }).from(projectPermits).leftJoin(permitTypes, eq(projectPermits.permitTypeId, permitTypes.id)).where(eq(projectPermits.projectId, req.params.id));
    res.json({ project, jurisdiction, permits });
  } catch (e) { res.status(500).json({ error: 'Failed to fetch project' }); }
});

router.post('/:id/analyze', requireAuth, async (req: any, res: any) => {
  try {
    console.log('ANALYZE START for project:', req.params.id);
    const rate = await checkRateLimit(req.user.id, req.user.planTier || 'free');
    console.log('RATE LIMIT:', JSON.stringify(rate));
    if (!rate.allowed) return res.status(429).json({ error: 'Rate limit exceeded', resetAt: new Date(rate.resetAt).toISOString() });
    const [project] = await db.select().from(projects).where(and(eq(projects.id, req.params.id), eq(projects.userId, req.user.id)));
    console.log('PROJECT:', project ? project.id : 'NOT FOUND');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, project.jurisdictionId!));
    console.log('JURISDICTION:', jurisdiction ? jurisdiction.name : 'NOT FOUND');
    const analysis = await analyzeProject({ description: project.description as string, projectType: project.projectType as string, squareFootage: project.squareFootage as number | undefined, address: project.address as string, jurisdiction: jurisdiction.name, estimatedValue: project.estimatedValue as unknown as number | undefined, isCommercial: (project.projectType as string | null)?.includes('commercial') || false, existingStructure: true }, jurisdiction as any);
    await db.update(projects).set({
      aiSummary: analysis.plainEnglishSummary,
      bidEstimate: analysis.bidEstimate || null,
      conflictAnalysis: analysis.conflictAnalysis || null,
      redFlags: analysis.redFlags || [],
      timelinePrediction: analysis.timelinePrediction || null,
    }).where(eq(projects.id, req.params.id));
    await db.delete(projectPermits).where(eq(projectPermits.projectId, req.params.id));
    console.log('Claude returned permits:', JSON.stringify(analysis.requiredPermits));
    for (const permit of analysis.requiredPermits) {
      const [pt] = await db.select().from(permitTypes).where(and(
        eq(permitTypes.jurisdictionId, project.jurisdictionId!),
        sql`lower(${permitTypes.code}) = lower(${permit.code})`
      ));
      if (pt) {
        await db.insert(projectPermits).values({ projectId: req.params.id, permitTypeId: pt.id, status: 'not_started', notes: `Priority: ${permit.priority}. ${permit.reason}` });
        console.log('Inserted permit:', pt.name);
      } else {
        console.log('No DB match for code:', permit.code);
      }
    }
    res.json({ analysis, rateLimit: rate });
  } catch (e) { console.error('Analysis error:', e); res.status(500).json({ error: 'Analysis failed' }); }
});

router.patch('/:id/permits/:permitId', requireAuth, async (req: any, res: any) => {
  try {
    const { status, notes } = req.body;
    const update: any = {};
    if (status !== undefined) update.status = status;
    if (notes !== undefined) update.notes = notes;
    if (Object.keys(update).length === 0) return res.status(400).json({ error: 'Nothing to update' });

    // Verify project belongs to user
    const [project] = await db.select().from(projects).where(and(eq(projects.id, req.params.id), eq(projects.userId, req.user.id)));
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const [updated] = await db.update(projectPermits)
      .set(update)
      .where(eq(projectPermits.id, req.params.permitId))
      .returning();

    res.json(updated);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Update failed' }); }
});


// ── Natural Language Parse ────────────────────────────────────────────────────
router.post('/parse', requireAuth, async (req: any, res: any) => {
  try {
    const { input, jurisdictionId } = req.body;
    if (!input) return res.status(400).json({ error: 'Input required' });
    const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, jurisdictionId || ''));
    const jurisdictionName = jurisdiction?.name || 'DFW, TX';
    const parsed = await parseNaturalLanguageProject(input, jurisdictionName);
    res.json(parsed);
  } catch (e) { console.error('Parse error:', e); res.status(500).json({ error: 'Failed to parse project description' }); }
});

// ── Share Token ───────────────────────────────────────────────────────────────
router.post('/:id/share', requireAuth, async (req: any, res: any) => {
  try {
    const [project] = await db.select().from(projects).where(and(eq(projects.id, req.params.id), eq(projects.userId, req.user.id)));
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const crypto = await import('crypto');
    const token = crypto.randomBytes(16).toString('hex');
    await db.update(projects).set({ shareToken: token }).where(eq(projects.id, req.params.id));
    res.json({ shareToken: token, shareUrl: `${process.env.FRONTEND_URL || ''}/share/${token}` });
  } catch (e) { res.status(500).json({ error: 'Failed to generate share link' }); }
});

// ── Application Packet ────────────────────────────────────────────────────────
router.post('/:id/packet', requireAuth, async (req: any, res: any) => {
  try {
    const [project] = await db.select().from(projects).where(and(eq(projects.id, req.params.id), eq(projects.userId, req.user.id)));
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const [jurisdiction] = await db.select().from(jurisdictions).where(eq(jurisdictions.id, project.jurisdictionId!));
    const permits = await db.select({ pp: projectPermits, pt: permitTypes }).from(projectPermits)
      .leftJoin(permitTypes, eq(projectPermits.permitTypeId, permitTypes.id))
      .where(eq(projectPermits.projectId, req.params.id));
    const packet = await generateApplicationPacket(project, permits, jurisdiction);
    res.json(packet);
  } catch (e) { console.error('Packet error:', e); res.status(500).json({ error: 'Failed to generate packet' }); }
});

// ── Set Inspection Reminder ───────────────────────────────────────────────────
router.post('/:id/permits/:permitId/reminder', requireAuth, async (req: any, res: any) => {
  try {
    const { remindAt, reminderType } = req.body;
    if (!remindAt) return res.status(400).json({ error: 'remindAt required' });
    const [project] = await db.select().from(projects).where(and(eq(projects.id, req.params.id), eq(projects.userId, req.user.id)));
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const [reminder] = await db.insert(inspectionReminders).values({
      projectId: req.params.id,
      projectPermitId: req.params.permitId,
      userId: req.user.id,
      reminderType: reminderType || 'follow_up',
      remindAt: new Date(remindAt),
      email: req.user.email,
    }).returning();
    await db.update(projectPermits).set({ inspectionReminderAt: new Date(remindAt) }).where(eq(projectPermits.id, req.params.permitId));
    res.json(reminder);
  } catch (e) { res.status(500).json({ error: 'Failed to set reminder' }); }
});


router.delete('/:id', requireAuth, async (req: any, res: any) => {
  try {
    const deleted = await db.delete(projects).where(and(eq(projects.id, req.params.id), eq(projects.userId, req.user.id))).returning({ id: projects.id });
    if (deleted.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'Failed to delete project' }); }
});

export default router;
