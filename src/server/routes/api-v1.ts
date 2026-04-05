/**
 * Permit Pilot Public API v1
 * White-label API for title companies, lenders, and enterprise customers
 * Auth: Bearer token (API key stored in users table)
 */
import { Router } from 'express';
import { db } from '../db.js';
import { users, jurisdictions, permitTypes, projects, projectPermits } from '../../../db/schema.js';
import { eq, ilike } from 'drizzle-orm';
import crypto from 'crypto';

const router = Router();

// API Key auth middleware
const requireApiKey = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing API key. Use Authorization: Bearer YOUR_API_KEY' });
  }
  const apiKey = authHeader.replace('Bearer ', '');
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

  // Look up user by API key hash
  const [user] = await db.select().from(users).where(eq(users.verificationToken, keyHash)).limit(1);
  if (!user || user.planTier === 'free') {
    return res.status(403).json({ error: 'Invalid API key or plan does not include API access' });
  }
  req.apiUser = user;
  next();
};

// GET /api/v1/jurisdictions - list all jurisdictions
router.get('/jurisdictions', requireApiKey, async (req: any, res: any) => {
  try {
    const rows = await db.select().from(jurisdictions).where(eq(jurisdictions.isActive, true));
    res.json({ data: rows, count: rows.length });
  } catch (e) { res.status(500).json({ error: 'Failed to fetch jurisdictions' }); }
});

// GET /api/v1/permits?jurisdiction=Dallas, TX - get permit types for jurisdiction
router.get('/permits', requireApiKey, async (req: any, res: any) => {
  try {
    const { jurisdiction } = req.query;
    if (!jurisdiction) return res.status(400).json({ error: 'jurisdiction parameter required' });

    const [jur] = await db.select().from(jurisdictions).where(ilike(jurisdictions.name, `%${jurisdiction}%`)).limit(1);
    if (!jur) return res.status(404).json({ error: 'Jurisdiction not found' });

    const permits = await db.select().from(permitTypes).where(eq(permitTypes.jurisdictionId, jur.id));
    res.json({ jurisdiction: jur, permits, count: permits.length });
  } catch (e) { res.status(500).json({ error: 'Failed to fetch permits' }); }
});

// POST /api/v1/analyze - analyze a project
router.post('/analyze', requireApiKey, async (req: any, res: any) => {
  try {
    const { address, description, projectType, jurisdictionName, squareFootage, estimatedValue, isCommercial } = req.body;
    if (!description || !jurisdictionName) {
      return res.status(400).json({ error: 'description and jurisdictionName required' });
    }

    const [jurisdiction] = await db.select().from(jurisdictions).where(ilike(jurisdictions.name, `%${jurisdictionName}%`)).limit(1);
    if (!jurisdiction) return res.status(404).json({ error: 'Jurisdiction not found' });

    const { analyzeProject } = await import('../services/claude.js');
    const analysis = await analyzeProject({
      description, projectType: projectType || 'other', squareFootage,
      address: address || '', jurisdiction: jurisdiction.name,
      estimatedValue, isCommercial: isCommercial || false, existingStructure: true,
    }, jurisdiction);

    res.json({
      jurisdiction: { id: jurisdiction.id, name: jurisdiction.name, portalUrl: jurisdiction.portalUrl, avgReviewDays: jurisdiction.avgReviewDays },
      analysis,
      meta: { apiVersion: 'v1', source: 'Permit Pilot API' },
    });
  } catch (e: any) { console.error('API analyze error:', e); res.status(500).json({ error: 'Analysis failed' }); }
});

// GET /api/v1/me - get API user info
router.get('/me', requireApiKey, async (req: any, res: any) => {
  res.json({
    id: req.apiUser.id,
    email: req.apiUser.email,
    companyName: req.apiUser.companyName,
    planTier: req.apiUser.planTier,
    apiVersion: 'v1',
  });
});

export default router;
