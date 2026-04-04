import { useState } from 'react';
import { useLocation } from 'wouter';

const features = [
  { title: 'Find Permits Fast', description: 'AI + live jurisdiction data pinpoints every required permit before work starts.', icon: '🧭', color: 'from-cyan-400/30 to-indigo-500/30' },
  { title: 'Pre-fill Permit Forms', description: 'Generate pre-filled PDFs and downloadable form ZIP packages ready to submit.', icon: '🧾', color: 'from-emerald-400/30 to-teal-500/30' },
  { title: 'Track Compliance', description: 'Kanban-style permit status tracking with notes and checklist completion.', icon: '📈', color: 'from-fuchsia-400/30 to-purple-500/30' },
];

const plans = [
  {
    name: 'Free', price: '$0', period: '/mo', border: 'border-white/10', badge: '',
    features: ['2 projects', '3 AI analyses/day', 'All 24 DFW jurisdictions', 'PDF checklist exports', '1 user seat'],
    cta: 'Get Started Free', ctaClass: 'bg-white/10 text-white hover:bg-white/20', href: '/auth',
  },
  {
    name: 'Contractor', price: '$29', period: '/mo', border: 'border-cyan-400/50', badge: 'Most Popular',
    features: ['Unlimited projects', 'Unlimited AI analyses', 'All 24 DFW jurisdictions', 'PDF + ZIP exports', '1 user seat', 'Priority support'],
    cta: 'Start Free Trial', ctaClass: 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold hover:opacity-90', href: '/auth',
  },
  {
    name: 'Agency', price: '$99', period: '/mo', border: 'border-indigo-400/30', badge: '',
    features: ['Unlimited projects', 'Unlimited AI analyses', 'All 24 DFW jurisdictions', 'PDF + ZIP exports', '5 user seats', 'White label reports', 'Priority support'],
    cta: 'Contact Sales', ctaClass: 'bg-indigo-500/80 text-white hover:bg-indigo-500', href: '/auth',
  },
];

export default function Home() {
  const [address, setAddress] = useState('');
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/auth');
  };

  return (
    <div className="space-y-16 pb-16">

      <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 shadow-2xl shadow-cyan-500/10 backdrop-blur md:px-14">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">DFW-focused permitting intelligence</p>
          <h1 className="mb-5 text-4xl font-bold leading-tight text-white md:text-6xl">Know every permit before you break ground.</h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-300">Permit Pilot helps contractors identify permit requirements, generate compliance checklists, and download pre-filled permit forms for all 24 DFW jurisdictions — in minutes.</p>
          <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-slate-900/80 p-3 sm:flex-row">
              <input type="text" placeholder="Enter your project address" value={address} onChange={(e) => setAddress(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
              <button type="submit" className="rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-3 font-semibold text-slate-950 transition hover:opacity-90">Analyze Project</button>
            </div>
          </form>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map((item) => (
          <div key={item.title} className={'rounded-2xl border border-white/10 bg-gradient-to-br ' + item.color + ' p-6 backdrop-blur'}>
            <div className="mb-4 text-3xl">{item.icon}</div>
            <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
            <p className="text-slate-200">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-6 text-sm text-amber-100 sm:grid-cols-4">
        <div><p className="text-2xl font-bold text-white">24</p><p>DFW jurisdictions covered</p></div>
        <div><p className="text-2xl font-bold text-white">ZIP + PDF</p><p>Checklist and pre-fill exports</p></div>
        <div><p className="text-2xl font-bold text-white">AI-powered</p><p>Claude-based permit analysis</p></div>
        <div><p className="text-2xl font-bold text-white">Free to start</p><p>No credit card required</p></div>
      </section>

      <section id="pricing">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-3 text-slate-400">Start free. Upgrade when you need more.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={'relative rounded-2xl border ' + plan.border + ' bg-white/5 p-8 backdrop-blur flex flex-col'}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-1 text-xs font-bold text-slate-950">{plan.badge}</span>
              )}
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">{plan.name}</p>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="mb-1 text-slate-400">{plan.period}</span>
                </div>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href={plan.href} className={'block rounded-xl px-6 py-3 text-center text-sm transition ' + plan.ctaClass}>{plan.cta}</a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">All plans include access to all 24 DFW jurisdictions. Verify all permit requirements directly with your local permitting authority.</p>
      </section>

    </div>
  );
}
