import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Permit Pilot <noreply@permitpilot.online>';
const BASE_URL = process.env.FRONTEND_URL || 'https://permitpilot.online';

function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; padding: 0; background: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 560px; margin: 40px auto; padding: 0 20px; }
    .card { background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; }
    .logo { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 32px; }
    .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #22d3ee, #6366f1); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #020617; font-weight: 800; font-size: 14px; }
    .logo-text { color: #fff; font-weight: 600; font-size: 18px; }
    h1 { color: #fff; font-size: 24px; font-weight: 700; margin: 0 0 16px; }
    p { color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #22d3ee, #6366f1); color: #020617 !important; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 10px; text-decoration: none; margin: 8px 0 24px; }
    .small { color: #475569; font-size: 13px; }
    .divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0; }
    .footer { text-align: center; margin-top: 24px; color: #334155; font-size: 12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="logo">
        <div class="logo-icon">PP</div>
        <div class="logo-text">Permit Pilot</div>
      </div>
      ${content}
      <hr class="divider">
      <p class="small">Permit Pilot · Wylie, TX · <a href="https://permitpilot.online" style="color:#22d3ee">permitpilot.online</a></p>
      <p class="small">This email was sent to you because you have an account with Permit Pilot. If you didn't request this, you can safely ignore it.</p>
    </div>
    <div class="footer">© 2025 Permit Pilot · A Quantum Surety product</div>
  </div>
</body>
</html>`;
}

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${BASE_URL}/verify-email?token=${token}`;
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verify your Permit Pilot account',
    html: baseTemplate(`
      <h1>Welcome to Permit Pilot! 👋</h1>
      <p>You're almost ready to start identifying permits for your projects. Just verify your email address to activate your account.</p>
      <a href="${link}" class="btn">Verify Email Address</a>
      <p class="small">This link expires in 24 hours.</p>
      <p class="small">Or copy this link: <a href="${link}" style="color:#22d3ee">${link}</a></p>
    `),
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `${BASE_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your Permit Pilot password',
    html: baseTemplate(`
      <h1>Reset your password</h1>
      <p>We received a request to reset your Permit Pilot password. Click the button below to choose a new one.</p>
      <a href="${link}" class="btn">Reset Password</a>
      <p class="small">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
      <p class="small">Or copy this link: <a href="${link}" style="color:#22d3ee">${link}</a></p>
    `),
  });
}

export async function sendWelcomeEmail(email: string, name?: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Your Permit Pilot account is ready',
    html: baseTemplate(`
      <h1>You're all set${name ? ', ' + name : ''}! 🎉</h1>
      <p>Your email is verified and your Permit Pilot account is fully activated. You can now:</p>
      <ul style="color:#94a3b8; padding-left:20px; margin:0 0 24px;">
        <li style="margin-bottom:8px">Analyze permit requirements for any DFW project</li>
        <li style="margin-bottom:8px">Get AI-powered permit identification across 24 jurisdictions</li>
        <li style="margin-bottom:8px">Download compliance checklists and pre-filled forms</li>
        <li>Track permit status and share with clients</li>
      </ul>
      <a href="${BASE_URL}/projects/new" class="btn">Start Your First Project</a>
    `),
  });
}

export async function sendAnalysisCompleteEmail(email: string, projectName: string, projectId: string) {
  const link = `${BASE_URL}/projects/${projectId}`;
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Permit analysis ready: ${projectName}`,
    html: baseTemplate(`
      <h1>Your analysis is ready ✅</h1>
      <p>The AI permit analysis for <strong style="color:#fff">${projectName}</strong> has completed. We've identified all required permits, fee estimates, and a compliance timeline.</p>
      <a href="${link}" class="btn">View Permit Analysis</a>
      <p class="small">Log in to view required permits, download your checklist, and share the results with your client.</p>
    `),
  });
}
