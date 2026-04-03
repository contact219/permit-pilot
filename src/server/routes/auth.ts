import { Router } from 'express';
import { db } from '../db.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const router = Router();

router.get('/me', (req: any, res: any) => {
  if (!req.user) return res.status(401).json({ user: null });
  res.json({ user: req.user });
});

router.post('/register', async (req: any, res: any) => {
  try {
    const { email, password, role = 'contractor', companyName } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) return res.status(409).json({ error: 'User already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const [newUser] = await db.insert(users).values({ email, passwordHash, role, companyName, planTier: 'free' })
      .returning({ id: users.id, email: users.email, role: users.role, companyName: users.companyName, planTier: users.planTier });
    (req.session as any).user = newUser;
    res.status(201).json({ user: newUser });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = existing[0];
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const safeUser = { id: user.id, email: user.email, role: user.role, companyName: user.companyName, planTier: user.planTier };
    (req.session as any).user = safeUser;
    res.json({ user: safeUser });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req: any, res: any) => {
  req.session.destroy(() => res.json({ ok: true }));
});

export default router;
