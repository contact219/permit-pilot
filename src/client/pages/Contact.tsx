export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-10">

      <section className="space-y-3">
        <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
          Get in Touch
        </p>
        <h1 className="text-4xl font-bold text-white">Contact Permit Pilot</h1>
        <p className="text-lg text-slate-300">
          Have a question about your permit analysis, your account, or our API? We are here to help.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/20 flex items-center justify-center text-xl">📞</div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-1">Phone</p>
            <a href="tel:+19723799216" className="text-xl font-bold text-white hover:text-cyan-300 transition">
              (972) 379-9216
            </a>
            <p className="text-sm text-slate-400 mt-1">Monday – Friday, 9am – 5pm CST</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-400/20 flex items-center justify-center text-xl">✉️</div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-1">Email</p>
            <a href="mailto:administrator@quantumsurety.bond" className="text-lg font-bold text-white hover:text-cyan-300 transition break-all">
              administrator@quantumsurety.bond
            </a>
            <p className="text-sm text-slate-400 mt-1">We respond within 1 business day</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-xl">📍</div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-1">Based In</p>
            <p className="text-lg font-bold text-white">Wylie, TX</p>
            <p className="text-sm text-slate-400 mt-1">Serving all 24 DFW jurisdictions</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center text-xl">🔒</div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-1">Surety Bonds</p>
            <a href="https://quantumsurety.bond" target="_blank" rel="noreferrer"
              className="text-lg font-bold text-white hover:text-cyan-300 transition">
              quantumsurety.bond
            </a>
            <p className="text-sm text-slate-400 mt-1">Contractor license bonds from our sister company</p>
          </div>
        </div>

      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">What can we help you with?</h2>
        <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-300">
          {[
            { icon: "📋", topic: "Permit analysis questions", desc: "Help understanding your AI permit results" },
            { icon: "🏙️", topic: "Jurisdiction coverage", desc: "Questions about specific DFW cities" },
            { icon: "💳", topic: "Billing and plans", desc: "Upgrades, cancellations, invoices" },
            { icon: "⚡", topic: "API access", desc: "White-label API keys for Agency plan" },
            { icon: "🔒", topic: "Contractor bonds", desc: "Bond quotes via Quantum Surety" },
            { icon: "🐛", topic: "Bug reports", desc: "Something not working right?" },
          ].map(item => (
            <div key={item.topic} className="flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
              <span className="text-lg shrink-0">{item.icon}</span>
              <div>
                <p className="font-medium text-white">{item.topic}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Ready to analyze your project?</h2>
        <p className="text-slate-300 text-sm">Get started free — no credit card required.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/projects/new"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold hover:opacity-90 transition">
            Start Free Analysis
          </a>
          <a href="mailto:administrator@quantumsurety.bond"
            className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition">
            Send Us an Email
          </a>
        </div>
      </section>

    </div>
  );
}
