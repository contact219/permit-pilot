import { useState } from 'react';
import { useLocation } from 'wouter';

const features = [
  {
    title: 'Find Permits Fast',
    description: 'AI + jurisdiction data pinpoints required permits before work starts.',
    icon: '🧭',
    color: 'from-cyan-400/30 to-indigo-500/30',
  },
  {
    title: 'Pre-fill Permit Forms',
    description: 'Generate pre-filled PDFs and downloadable form ZIP packages.',
    icon: '🧾',
    color: 'from-emerald-400/30 to-teal-500/30',
  },
  {
    title: 'Track Compliance',
    description: 'Monitor statuses, red flags, and checklist completion in one place.',
    icon: '📈',
    color: 'from-fuchsia-400/30 to-purple-500/30',
  },
];

export default function Home() {
  const [address, setAddress] = useState('');
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) navigate(`/projects/new?address=${encodeURIComponent(address.trim())}`);
  };

  return (
    <div className="space-y-12 pb-10">
      <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 shadow-2xl shadow-cyan-500/10 backdrop-blur md:px-14">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">DFW-focused permitting intelligence</p>
          <h1 className="mb-5 text-4xl font-bold leading-tight text-white md:text-6xl">Know every permit before you break ground.</h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-300">Permit Pilot helps contractors and homeowners identify permit requirements, generate compliance checklists, and download pre-filled permit forms in minutes.</p>
          <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-slate-900/80 p-3 sm:flex-row">
              <input
                type="text"
                placeholder="Enter your project address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button type="submit" className="rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-3 font-semibold text-slate-950 transition hover:opacity-90">Analyze Project</button>
            </div>
          </form>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map((item) => (
          <div key={item.title} className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.color} p-6 backdrop-blur`}>
            <div className="mb-4 text-3xl">{item.icon}</div>
            <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
            <p className="text-slate-200">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-6 text-sm text-amber-100 md:grid-cols-3">
        <div>
          <p className="text-2xl font-bold text-white">5+</p>
          <p>Seeded TX jurisdictions</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">ZIP + PDF</p>
          <p>Checklist and pre-fill exports</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">Informational only</p>
          <p>Verify all requirements directly with your local permitting authority.</p>
        </div>
      </section>
    </div>
  );
}
