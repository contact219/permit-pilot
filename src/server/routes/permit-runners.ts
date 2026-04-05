import { Router } from 'express';
import { db } from '../db.js';
import { permitRunners } from '../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';

const router = Router();

// GET runners by jurisdiction
router.get('/', async (req: any, res: any) => {
  try {
    const { jurisdiction } = req.query;
    let runners;
    if (jurisdiction && typeof jurisdiction === 'string') {
      runners = await db.select().from(permitRunners)
        .where(sql`${permitRunners.active} = true AND ${jurisdiction} = ANY(${permitRunners.jurisdictions})`);
    } else {
      runners = await db.select().from(permitRunners).where(eq(permitRunners.active, true));
    }
    res.json(runners);
  } catch (e) { res.status(500).json({ error: 'Failed to fetch permit runners' }); }
});

// POST contact a runner (sends email)
router.post('/:id/contact', async (req: any, res: any) => {
  try {
    const { name, email, phone, projectDescription, jurisdiction } = req.body;
    const [runner] = await db.select().from(permitRunners).where(eq(permitRunners.id, req.params.id));
    if (!runner) return res.status(404).json({ error: 'Runner not found' });

    // Send contact email via Resend
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Permit Pilot <noreply@permitpilot.online>',
      to: runner.email,
      subject: `New permit runner inquiry from ${name}`,
      html: `
        <h2>New Inquiry via Permit Pilot</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Jurisdiction:</strong> ${jurisdiction}</p>
        <p><strong>Project:</strong> ${projectDescription}</p>
        <p><a href="mailto:${email}">Reply to ${name}</a></p>
      `,
    });

    // Also notify the contractor
    await resend.emails.send({
      from: 'Permit Pilot <noreply@permitpilot.online>',
      to: email,
      subject: `Your permit runner inquiry has been sent`,
      html: `
        <h2>Inquiry Sent!</h2>
        <p>Your inquiry has been sent to <strong>${runner.name}</strong> at ${runner.company || 'Independent'}.</p>
        <p>They typically respond within 24 hours. You can also reach them directly at <a href="tel:${runner.phone}">${runner.phone}</a>.</p>
        <p>Rate: $${runner.ratePerPermit} per permit</p>
      `,
    });

    res.json({ ok: true, message: 'Inquiry sent successfully' });
  } catch (e: any) { console.error('Contact runner error:', e); res.status(500).json({ error: 'Failed to send inquiry' }); }
});

export default router;
