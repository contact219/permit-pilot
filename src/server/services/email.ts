import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const FROM = '"Permit Pilot" <no-reply@permit-pilot.com>';
const BASE_URL = process.env.FRONTEND_URL || 'http://192.168.4.122:7842';

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${BASE_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: FROM, to: email,
    subject: 'Verify your Permit Pilot account',
    html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2 style="color:#2563eb">Welcome to Permit Pilot</h2>
      <p>Please verify your email address to activate your account.</p>
      <a href="${link}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0">Verify Email Address</a>
      <p style="color:#6b7280;font-size:14px">This link expires in 24 hours.</p>
      <p style="color:#6b7280;font-size:12px">Or copy: ${link}</p>
    </div>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `${BASE_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: FROM, to: email,
    subject: 'Reset your Permit Pilot password',
    html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2 style="color:#2563eb">Reset your password</h2>
      <p>We received a request to reset your Permit Pilot password.</p>
      <a href="${link}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0">Reset Password</a>
      <p style="color:#6b7280;font-size:14px">This link expires in 1 hour.</p>
      <p style="color:#6b7280;font-size:12px">Or copy: ${link}</p>
    </div>`,
  });
}

export async function sendWelcomeEmail(email: string, name?: string) {
  await transporter.sendMail({
    from: FROM, to: email,
    subject: 'Your Permit Pilot account is ready',
    html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2 style="color:#2563eb">You're all set${name ? ', ' + name : ''}!</h2>
      <p>Your Permit Pilot account is verified. Start your first project:</p>
      <a href="${BASE_URL}/projects/new" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0">Create a Project</a>
    </div>`,
  });
}
