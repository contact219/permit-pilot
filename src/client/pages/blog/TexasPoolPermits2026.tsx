import { useEffect } from "react";

export default function BlogPoolPermits() {
  useEffect(() => {
    document.title = "Do I Need a Permit for a Pool in Texas? DFW Cities Compared 2026 | Permit Pilot";
  }, []);

  const cities = [
    { city: "Dallas", permit: "Yes", fee: "Valuation-based", timeline: "10-25 days", notes: "Building + electrical + plumbing permits required. Apply via DallasNow portal." },
    { city: "Fort Worth", permit: "Yes", fee: "Valuation-based", timeline: "7 days", notes: "Building permit required for all pools. Trade permits separate. Apply via Accela." },
    { city: "Frisco", permit: "Yes", fee: "$100 above-ground / $200+ in-ground", timeline: "7-10 days", notes: "Apply via eTRAKiT. HOA approval required in most Frisco subdivisions." },
    { city: "Plano", permit: "Yes", fee: "Valuation-based", timeline: "10 days", notes: "Building + electrical + plumbing. Apply via Plano online portal." },
    { city: "McKinney", permit: "Yes", fee: "Valuation-based", timeline: "10 days", notes: "Requires site plan and engineering drawings for in-ground pools." },
    { city: "Allen", permit: "Yes", fee: "Valuation-based", timeline: "7-10 days", notes: "All pools require permit. Barrier/fence inspection required at completion." },
    { city: "Arlington", permit: "Yes", fee: "Valuation-based", timeline: "10 days", notes: "Building + MEP permits. Pool barrier inspection required before fill." },
    { city: "Wylie", permit: "Yes", fee: "Valuation-based", timeline: "7-10 days", notes: "All pools require permit. Check HOA requirements in addition to city." },
    { city: "Denton", permit: "Yes", fee: "Valuation-based", timeline: "10 days", notes: "Building and trade permits required. Apply online." },
    { city: "Grapevine", permit: "Yes", fee: "Valuation-based", timeline: "7-10 days", notes: "All pools require permit including above-ground." },
    { city: "Flower Mound", permit: "Yes", fee: "Valuation-based", timeline: "10 days", notes: "HOA approval typically required before permit in Flower Mound subdivisions." },
    { city: "Mansfield", permit: "Yes", fee: "Valuation-based", timeline: "10 days", notes: "All pools and spas require permits." },
  ];

  return (
    <article className="max-w-3xl mx-auto pb-16 space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 text-xs font-medium border border-cyan-400/20">Texas</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium">Pool Permits</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium">DFW 2026</span>
        </div>
        <h1 className="text-4xl font-bold text-white leading-tight">Do I Need a Permit for a Pool in Texas? DFW Cities Compared (2026)</h1>
        <p className="text-lg text-slate-300">Yes — every DFW city requires a building permit for swimming pool construction, both above-ground and in-ground. Here is everything pool contractors need to know.</p>
        <div className="flex items-center gap-4 text-sm text-slate-400 pt-2 border-t border-white/10">
          <span>By Permit Pilot</span><span>Updated April 2026</span><span>9 min read</span>
        </div>
      </header>

      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-6">
        <p className="text-sm text-cyan-200 font-medium mb-2">Short Answer</p>
        <p className="text-slate-200 text-sm leading-relaxed">Yes, you need a permit for a pool in Texas. Every DFW city requires a building permit for in-ground pools. Most also require permits for above-ground pools. Dallas led Texas with over 2,900 new pool permits in 2025, making DFW the most active pool construction market in the state.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Why Every Pool Needs a Permit in Texas</h2>
        <p className="text-slate-300 leading-relaxed">Texas state law and municipal building codes require permits for swimming pool construction to ensure safety compliance. Pool permits exist to verify structural integrity, electrical bonding and grounding, proper drainage, required safety barriers and fencing, and plumbing connections.</p>
        <p className="text-slate-300 leading-relaxed">Building a pool without a permit can result in daily fines averaging $200-$1,000, mandatory pool removal at the owner's expense, and serious complications when selling the property. Title companies now routinely check for unpermitted pools.</p>

        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-5">
          <p className="font-semibold text-amber-200 mb-2">Pool Barrier Law — Required in Every Texas City</p>
          <p className="text-sm text-slate-300">Texas requires pool barriers (fencing) around all residential pools. The barrier must be at least 48 inches high, have self-closing and self-latching gates, and completely enclose the pool to prevent unsupervised access by children. A barrier inspection is required before the pool can be filled with water in most DFW cities.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">What Permits Does a Pool Require?</h2>
        <p className="text-slate-300">Most DFW cities require multiple permits for a pool project:</p>
        <div className="space-y-3">
          {[
            { permit: "Building Permit", required: true, desc: "Required for the pool structure itself — gunite/shotcrete shell, excavation, decking. This is the primary permit." },
            { permit: "Electrical Permit", required: true, desc: "Required for pool lighting, pump motors, GFCI protection, bonding and grounding. All pool electrical work requires a separate electrical permit and inspection." },
            { permit: "Plumbing Permit", required: true, desc: "Required for water supply and drain connections. If the pool includes a spa or water features with plumbing, a plumbing permit is required." },
            { permit: "Mechanical Permit", required: false, desc: "Required if the pool includes a gas heater. A separate mechanical permit covers the gas line and heater installation." },
            { permit: "Fence/Barrier Permit", required: false, desc: "Some cities require a separate permit for the pool barrier/fence. Others include it with the building permit." },
          ].map(item => (
            <div key={item.permit} className={"rounded-xl border p-4 " + (item.required ? "border-emerald-400/20 bg-emerald-400/5" : "border-amber-400/20 bg-amber-400/5")}>
              <div className="flex items-center gap-3 mb-1">
                <p className="font-semibold text-white text-sm">{item.permit}</p>
                <span className={"px-2 py-0.5 rounded-full text-xs " + (item.required ? "bg-emerald-400/20 text-emerald-300" : "bg-amber-400/20 text-amber-300")}>{item.required ? "Always Required" : "Often Required"}</span>
              </div>
              <p className="text-slate-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Pool Permit Requirements by DFW City</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/10 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Permit Required</th>
                <th className="px-4 py-3 text-left">Fee Basis</th>
                <th className="px-4 py-3 text-left">Review Time</th>
                <th className="px-4 py-3 text-left">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {cities.map(c => (
                <tr key={c.city} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-white">{c.city}</td>
                  <td className="px-4 py-3 text-emerald-300">{c.permit}</td>
                  <td className="px-4 py-3">{c.fee}</td>
                  <td className="px-4 py-3">{c.timeline}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{c.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">HOA Approval — The Step Most Pool Contractors Miss</h2>
        <p className="text-slate-300 leading-relaxed">In most DFW subdivisions, HOA approval is required before the city will accept your pool permit application. This is the most common cause of pool permit delays. The HOA reviews pool placement, deck materials, fence style, and landscaping impacts.</p>
        <p className="text-slate-300 leading-relaxed">HOA approval typically takes 2-4 weeks and must be obtained before submitting city permits in subdivisions that require it. Frisco, McKinney, Allen, Plano, and Flower Mound have the highest HOA density in DFW — most homes in these cities are in HOA-governed subdivisions.</p>
        <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/10 p-4 text-sm">
          <p className="text-indigo-200 font-medium mb-1">Use Permit Pilot HOA Lookup</p>
          <p className="text-slate-300">Permit Pilot's HOA Lookup tool checks whether a project address is in an HOA, identifies the management company, and provides typical approval requirements — before you even start the permit process. <a href="/projects/new" className="text-cyan-300 underline">Try it on your next pool project.</a></p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Pool Permit Inspection Stages</h2>
        <p className="text-slate-300">Most DFW cities require inspections at each of these stages for a pool project:</p>
        <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside">
          {["Pre-gunite/pre-shotcrete inspection (steel and plumbing rough-in)", "Bonding and grounding inspection (electrical)", "Deck inspection (before pouring concrete deck)", "Barrier/fence inspection (before filling with water)", "Final electrical inspection", "Final pool inspection and Certificate of Completion"].map(item => (
            <li key={item} className="flex items-start gap-2 list-none"><span className="text-cyan-400 shrink-0">+</span>{item}</li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Never Miss a Pool Permit Again</h2>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">Permit Pilot identifies every permit required for pool projects across all 24 DFW jurisdictions — building, electrical, plumbing, mechanical, and barrier permits — plus HOA requirements.</p>
        <a href="/projects/new" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold hover:opacity-90 transition">Analyze My Pool Project Free</a>
        <p className="text-xs text-slate-500">Disclaimer: Requirements vary by city and project. Always verify current permit requirements with your local building department before starting construction.</p>
      </section>
    </article>
  );
}
