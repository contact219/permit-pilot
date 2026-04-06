export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="text-slate-400 text-sm">Last updated: April 2026</p>
      </header>
      <div className="space-y-6 text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Information We Collect</h2>
          <p>When you create an account, we collect your email address, company name, and any project information you enter. We use this information solely to provide permit analysis and related services.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">How We Use Your Information</h2>
          <p>We use your information to provide AI permit analysis, send transactional emails (verification, password reset, analysis results), process payments via Stripe, and improve our service. We do not sell your personal information to third parties.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Data Storage</h2>
          <p>Your data is stored securely on servers located in the United States. Project data and permit analyses are retained for the duration of your account. You may request deletion of your account and associated data at any time by contacting us.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Cookies</h2>
          <p>We use session cookies to keep you logged in. We do not use third-party advertising cookies. We may use analytics cookies to understand how the application is used.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Third-Party Services</h2>
          <p>We use Stripe for payment processing, Resend for transactional email, Google Maps for address autocomplete, and Anthropic Claude for AI analysis. Each of these services has its own privacy policy governing their use of data.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Contact</h2>
          <p>For privacy-related questions or data deletion requests, contact us at <a href="mailto:administrator@quantumsurety.bond" className="text-cyan-300 underline">administrator@quantumsurety.bond</a> or call <a href="tel:+19723799216" className="text-cyan-300 underline">(972) 379-9216</a>.</p>
        </section>
      </div>
    </div>
  );
}
