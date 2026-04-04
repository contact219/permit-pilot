export default function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 pb-16">

      <section className="rounded-3xl border border-white/10 bg-white/5 px-8 py-12 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        <p className="mb-3 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">About Permit Pilot</p>
        <h1 className="mb-4 text-4xl font-bold text-white">Built for DFW contractors who are tired of permit surprises.</h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          Permit Pilot is an AI-powered permit guidance platform covering all 24 DFW-area jurisdictions. We help contractors, builders, and homeowners identify permit requirements, estimate fees, and generate compliance checklists — before work begins.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: '1', title: 'Describe your project', desc: 'Tell us what you\'re building — room addition, pool, fence, HVAC replacement — and where.' },
            { step: '2', title: 'AI analyzes requirements', desc: 'Claude reviews your project against live jurisdiction data for all 24 DFW cities and identifies every required permit.' },
            { step: '3', title: 'Download your checklist', desc: 'Get a PDF compliance checklist with permit names, fees, required documents, and links to official city portals.' },
          ].map(item => (
            <div key={item.step} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-bold text-slate-950">{item.step}</div>
              <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">What we cover</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="mb-4 text-slate-300">Permit Pilot covers all 24 DFW-area jurisdictions including:</p>
          <div className="grid gap-1 text-sm text-slate-300 sm:grid-cols-3">
            {['Allen', 'Arlington', 'Bedford', 'Coppell', 'Dallas', 'Dalworthington Gardens', 'Denton', 'Euless', 'Flower Mound', 'Fort Worth', 'Grand Prairie', 'Grapevine', 'Frisco', 'Haltom City', 'Hurst', 'Mansfield', 'McKinney', 'North Richland Hills', 'Pantego', 'Plano', 'Richland Hills', 'Watauga', 'Westlake', 'Wylie'].map(city => (
              <div key={city} className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> {city}, TX
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Licensing & compliance</h2>
        <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/5 p-6 space-y-3 text-slate-300">
          <p>Permit Pilot is operated by <strong className="text-white">Quantum Surety</strong>, a Texas-licensed surety bond agency regulated by the Texas Department of Insurance (TDI).</p>
          <p>Our permit guidance platform is designed to complement — not replace — the expertise of licensed contractors and local permitting authorities. We provide AI-generated analysis based on publicly available jurisdiction data.</p>
          <p className="text-sm text-slate-400">Texas Department of Insurance licensing pending. Surety bond services provided under TDI General Lines P&C license.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Important disclaimer</h2>
        <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-6 text-amber-100 space-y-3">
          <p className="font-semibold">Permit Pilot provides informational guidance only.</p>
          <ul className="space-y-2 text-sm">
            <li>• All permit analyses are AI-generated and may not reflect the most current local requirements.</li>
            <li>• Permit requirements, fees, and processes change frequently at the jurisdiction level.</li>
            <li>• Always verify requirements directly with your local permitting authority before submitting any applications.</li>
            <li>• Permit Pilot is not responsible for errors, omissions, or outdated information in permit analyses.</li>
            <li>• This platform does not constitute legal, engineering, or professional permitting advice.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Contact</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300 space-y-2">
          <p>Questions about Permit Pilot or your permit analysis?</p>
          <p>📧 <a href="mailto:support@permit-pilot.com" className="text-cyan-300 hover:underline">support@permit-pilot.com</a></p>
          <p>🌐 <a href="https://quantumsurety.bond" target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">quantumsurety.bond</a></p>
          <p className="text-sm text-slate-400 pt-2">Permit Pilot is a product of Quantum Surety · Wylie, TX</p>
        </div>
      </section>

    </div>
  );
}
