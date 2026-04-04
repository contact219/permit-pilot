import { Router } from 'express';
import { db } from '../db.js';
import { users } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../services/email.js';

const router = Router();

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

router.get('/me', (req: any, res: any) => {
  if (!req.user) return res.status(401).json({ user: null });
  res.json({ user: req.user });
});

router.post('/register', async (req: any, res: any) => {
  try {
    const { email, password, role = 'contractor', companyName } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) return res.status(409).json({ error: 'An account with this email already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = generateToken();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const [newUser] = await db.insert(users).values({
      email, passwordHash, role, companyName, planTier: 'free',
      emailVerified: false, verificationToken, verificationExpiry,
    }).returning({ id: users.id, email: users.email, role: users.role, companyName: users.companyName, planTier: users.planTier, emailVerified: users.emailVerified });
    sendVerificationEmail(email, verificationToken).catch(err => console.error('Email error:', err.message));
    (req.session as any).user = newUser;
    res.status(201).json({ user: newUser, message: 'Account created! Please check your email to verify your account.' });
  } catch (e) { console.error('Register error:', e); res.status(500).json({ error: 'Registration failed' }); }
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
    const safeUser = { id: user.id, email: user.email, role: user.role, companyName: user.companyName, planTier: user.planTier, emailVerified: user.emailVerified };
    (req.session as any).user = safeUser;
    res.json({ user: safeUser });
  } catch (e) { console.error('Login error:', e); res.status(500).json({ error: 'Login failed' }); }
});

router.post('/logout', (req: any, res: any) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/verify-email', async (req: any, res: any) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token required' });
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token as string)).limit(1);
    if (!user) return res.status(400).json({ error: 'Invalid or expired verification link' });
    if (user.verificationExpiry && new Date() > user.verificationExpiry) {
      return res.status(400).json({ error: 'Verification link has expired. Please request a new one.' });
    }
    await db.update(users).set({ emailVerified: true, verificationToken: null, verificationExpiry: null }).where(eq(users.id, user.id));
    if ((req.session as any).user?.id === user.id) (req.session as any).user.emailVerified = true;
    sendWelcomeEmail(user.email, user.companyName || undefined).catch(() => {});
    res.json({ ok: true, message: 'Email verified successfully!' });
  } catch (e) { console.error('Verify email error:', e); res.status(500).json({ error: 'Verification failed' }); }
});

router.post('/resend-verification', async (req: any, res: any) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) return res.json({ ok: true });
    if (user.emailVerified) return res.status(400).json({ error: 'Email already verified' });
    const verificationToken = generateToken();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.update(users).set({ verificationToken, verificationExpiry }).where(eq(users.id, user.id));
    await sendVerificationEmail(email, verificationToken);
    res.json({ ok: true, message: 'Verification email sent' });
  } catch (e) { console.error('Resend error:', e); res.status(500).json({ error: 'Failed to resend' }); }
});

router.post('/forgot-password', async (req: any, res: any) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) return res.json({ ok: true, message: 'If that email exists, a reset link has been sent.' });
    const resetToken = generateToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await db.update(users).set({ resetToken, resetExpiry }).where(eq(users.id, user.id));
    await sendPasswordResetEmail(email, resetToken);
    res.json({ ok: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (e) { console.error('Forgot password error:', e); res.status(500).json({ error: 'Failed to send reset email' }); }
});

router.post('/reset-password', async (req: any, res: any) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and password required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    const [user] = await db.select().from(users).where(eq(users.resetToken, token)).limit(1);
    if (!user) return res.status(400).json({ error: 'Invalid or expired reset link' });
    if (user.resetExpiry && new Date() > user.resetExpiry) {
      return res.status(400).json({ error: 'Reset link has expired. Please request a new one.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await db.update(users).set({ passwordHash, resetToken: null, resetExpiry: null }).where(eq(users.id, user.id));
    res.json({ ok: true, message: 'Password reset successfully. You can now log in.' });
  } catch (e) { console.error('Reset password error:', e); res.status(500).json({ error: 'Password reset failed' }); }
});

export default router;
