import { useEffect } from "react";

export default function BlogFortWorthPermits() {
  useEffect(() => {
    document.title = "Fort Worth Building Permit Requirements 2026 — Complete Guide | Permit Pilot";
  }, []);

  return (
    <article className="max-w-3xl mx-auto pb-16 space-y-8">

      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 text-xs font-medium border border-cyan-400/20">Fort Worth</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium">Building Permits</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium">2026 Guide</span>
        </div>
        <h1 className="text-4xl font-bold text-white leading-tight">
          Fort Worth Building Permit Requirements 2026 — Complete Guide
        </h1>
        <p className="text-lg text-slate-300">
          Everything contractors and homeowners need to know about pulling permits in Fort Worth, TX — what requires a permit, how much it costs, how long it takes, and how to apply online.
        </p>
        <div className="flex items-center gap-4 text-sm text-slate-400 pt-2 border-t border-white/10">
          <span>By Permit Pilot</span>
          <span>Updated April 2026</span>
          <span>12 min read</span>
        </div>
      </header>

      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-6">
        <p className="text-sm text-cyan-200 font-medium mb-2">Quick Answer</p>
        <p className="text-slate-200 text-sm leading-relaxed">
          Fort Worth building permits are applied for online at Accela Citizen Access. Residential permits typically take 7 business days to review. Fees are calculated based on project valuation. All work that changes walls, floors, electrical, mechanical, or plumbing requires a permit — cosmetic work does not.
        </p>
      </div>

      <nav className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="font-semibold text-white mb-3">Table of Contents</p>
        <ol className="space-y-1 text-sm text-cyan-300 list-decimal list-inside">
          <li><a href="#what-requires" className="hover:underline">What requires a permit in Fort Worth</a></li>
          <li><a href="#what-doesnt" className="hover:underline">What does NOT require a permit</a></li>
          <li><a href="#fees" className="hover:underline">Permit fees and costs</a></li>
          <li><a href="#how-to-apply" className="hover:underline">How to apply for a permit</a></li>
          <li><a href="#timeline" className="hover:underline">How long does it take</a></li>
          <li><a href="#inspections" className="hover:underline">Inspections</a></li>
          <li><a href="#contractor-requirements" className="hover:underline">Contractor requirements</a></li>
          <li><a href="#faq" className="hover:underline">Frequently asked questions</a></li>
        </ol>
      </nav>

      <section id="what-requires" className="space-y-4">
        <h2 className="text-2xl font-bold text-white">What Requires a Building Permit in Fort Worth?</h2>
        <p className="text-slate-300 leading-relaxed">
          Fort Worth requires building permits for any work that changes, moves, or repairs structural elements of a home. The city enforces the 2021 International Building Code with local amendments. Here is a complete breakdown by project type:
        </p>
        <div className="space-y-3">
          {[
            { title: "Additions", req: true, desc: "All additions require building permits with no exceptions. This includes room additions, garage conversions, sunroom enclosures, and any expansion of the living space footprint. Zoning setback and impervious cover rules also apply." },
            { title: "Interior Remodels and Repairs", req: true, desc: "Changing, moving, or repairing walls or floors requires a permit if the total drywall area is 16 square feet or more. Smaller patches do not require a permit." },
            { title: "Detached Garages and Carports", req: true, desc: "All detached garages require building permits. All carports — including fabric carports — require building permits. Front yard carports also require a special exception from the Zoning Board of Adjustment." },
            { title: "Pools and Spas", req: true, desc: "All swimming pools, above-ground and in-ground, require building permits. Gazebos, outdoor fireplaces, and fountains with plumbing also require permits." },
            { title: "Decks", req: true, desc: "Any platform, walkway, or deck more than 6 inches above grade requires a building permit." },
            { title: "Electrical Work", req: true, desc: "Changing, moving, or repairing electrical equipment — including panels — requires an electrical permit." },
            { title: "HVAC and Mechanical", req: true, desc: "Replacing or repairing a central heating and air conditioning system, ductwork, or exhaust fans requires a mechanical permit." },
            { title: "Plumbing", req: true, desc: "Installing, moving, or repairing plumbing — including water heaters and shower pans — requires a plumbing permit. New irrigation systems also require permits." },
            { title: "Fences", req: false, desc: "Solid fences taller than 7 feet require a permit. Open fences taller than 8 feet require a permit. Front yard fences are limited to 4 feet open picket style — chain link is prohibited in front yards." },
            { title: "Roofing", req: false, desc: "Shingle replacement does not require a permit (subject to layer limits). Replacement of decking, sheathing, rafters, or ridge boards does require a building permit." },
            { title: "Doors and Windows", req: true, desc: "Replacement or addition of exterior doors, windows, or burglar bars requires a building permit." },
            { title: "Storage Buildings", req: true, desc: "All storage buildings including shipping containers require a building permit with zoning requirements for location and square footage." },
            { title: "Demolition", req: true, desc: "Demolition of interior walls or removal of a building from the property requires a permit." },
            { title: "Foundations", req: true, desc: "All foundation repairs or new foundations require building permits and engineered building plans." },
          ].map(item => (
            <div key={item.title} className={"rounded-xl border p-4 " + (item.req ? "border-emerald-400/20 bg-emerald-400/5" : "border-amber-400/20 bg-amber-400/5")}>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                <span className={"px-2 py-0.5 rounded-full text-xs " + (item.req ? "bg-emerald-400/20 text-emerald-300" : "bg-amber-400/20 text-amber-300")}>
                  {item.req ? "Permit Required" : "Conditional"}
                </span>
              </div>
              <p className="text-slate-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="what-doesnt" className="space-y-4">
        <h2 className="text-2xl font-bold text-white">What Does NOT Require a Permit in Fort Worth?</h2>
        <ul className="space-y-2 text-slate-300 text-sm">
          {["Painting and wallpaper", "Flooring replacement (no structural work)", "Cabinet and countertop replacement", "Shelving installation", "Shingle replacement (subject to layer limits)", "Plumbing fixture replacement without moving supply or drain lines", "Driveway flatwork on private property", "Freestanding above-ground storm shelters bolted to foundation without utilities"].map(item => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-slate-500 mt-0.5">—</span><span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-200">
          Homeowners may apply for permits on their primary residence without a contractor license, provided they have a homestead exemption on file with the appraisal district.
        </div>
      </section>

      <section id="fees" className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Fort Worth Building Permit Fees</h2>
        <p className="text-slate-300 leading-relaxed">
          Fort Worth permit fees are calculated based on project valuation using a tiered fee schedule last updated October 2024 under Ordinance No. 27191-09-2024. Each trade permit (electrical, mechanical, plumbing) is a separate fee on top of the building permit fee.
        </p>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/10 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">Permit Type</th>
                <th className="px-4 py-3 text-left">Fee Basis</th>
                <th className="px-4 py-3 text-left">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {[
                ["Residential Building", "Project valuation", "Includes plan check fee"],
                ["Electrical", "Project valuation", "Separate permit required"],
                ["Mechanical (HVAC)", "Project valuation", "Separate permit required"],
                ["Plumbing", "Project valuation", "Separate permit required"],
                ["Pool/Spa", "Project valuation", "Building + electrical + plumbing"],
                ["Expedited Review", "Additional fee", "Available for faster review"],
              ].map(([type, fee, note]) => (
                <tr key={type}><td className="px-4 py-3 font-medium text-white">{type}</td><td className="px-4 py-3">{fee}</td><td className="px-4 py-3 text-slate-400">{note}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-slate-400">Use the <a href="https://cfwpermit.fortworthtexas.gov/" target="_blank" rel="noreferrer" className="text-cyan-300 underline">CFW Permit Tool</a> for an accurate fee estimate, or run a free Permit Pilot analysis to get a bid-ready fee breakdown.</p>
      </section>

      <section id="how-to-apply" className="space-y-4">
        <h2 className="text-2xl font-bold text-white">How to Apply for a Building Permit in Fort Worth</h2>
        <ol className="space-y-4">
          {[
            { step: "1", title: "Determine what permits you need", desc: "Use the CFW Permit Tool at cfwpermit.fortworthtexas.gov to identify required permits, estimated costs, and zoning compliance for your project." },
            { step: "2", title: "Register as a contractor or homeowner", desc: "Contractors must have valid city contractor registration on file. Homeowners can apply under a homestead permit for their primary residence." },
            { step: "3", title: "Submit your application online", desc: "Apply through Accela Citizen Access at aca-prod.accela.com/CFW. Upload site plans, construction drawings, and engineering plans where required." },
            { step: "4", title: "Pay permit fees", desc: "Fees are paid online at application. The amount is calculated based on your project valuation." },
            { step: "5", title: "Wait for plan review", desc: "Residential and commercial permits target 7 business days for review. Complex projects may take longer." },
            { step: "6", title: "Receive permit and begin work", desc: "Once approved, download and post the permit visibly at the job site. Schedule inspections at each milestone online." },
          ].map(item => (
            <li key={item.step} className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-cyan-400/20 text-cyan-300 font-bold text-sm flex items-center justify-center border border-cyan-400/30">{item.step}</span>
              <div><p className="font-semibold text-white mb-1">{item.title}</p><p className="text-slate-300 text-sm">{item.desc}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section id="timeline" className="space-y-4">
        <h2 className="text-2xl font-bold text-white">How Long Does a Fort Worth Building Permit Take?</h2>
        <p className="text-slate-300">Fort Worth targets 7 business days for residential and commercial building permit reviews — one of the faster turnaround times in the DFW metroplex.</p>
        <div className="space-y-2">
          {[
            { phase: "Application submitted", days: "Day 1" },
            { phase: "Plan review", days: "Days 2-9 (7 business days)" },
            { phase: "Corrections if needed", days: "+3-5 days" },
            { phase: "Permit issued", days: "Day 10-12 typical" },
            { phase: "Inspections during construction", days: "Schedule online" },
            { phase: "Final inspection", days: "Project completion" },
          ].map(item => (
            <div key={item.phase} className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
              <span className="text-white font-medium text-sm flex-1">{item.phase}</span>
              <span className="text-cyan-300 text-sm">{item.days}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="inspections" className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Building Inspections in Fort Worth</h2>
        <p className="text-slate-300">Inspections are scheduled online through Accela by permit type. Do not cover or conceal any work until it has been inspected and approved.</p>
        <ul className="grid grid-cols-2 gap-2 text-sm text-slate-300">
          {["Foundation", "Framing", "Rough electrical", "Rough plumbing", "Rough mechanical", "Insulation", "Drywall", "Final building", "Final electrical", "Final plumbing", "Final mechanical"].map(item => (
            <li key={item} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />{item}</li>
          ))}
        </ul>
      </section>

      <section id="contractor-requirements" className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Contractor Requirements in Fort Worth</h2>
        <p className="text-slate-300">Contractors pulling permits in Fort Worth must have valid city contractor registration. Homeowners may perform work on their primary homestead residence with a homestead permit.</p>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-5 space-y-2">
          <p className="font-semibold text-amber-200">Contractor License Bond Requirement</p>
          <p className="text-sm text-slate-300">Most Fort Worth permit applications require contractors to carry a <strong className="text-white">$25,000 Contractor License Bond</strong>. This protects homeowners if the contractor fails to complete work or violates code. Getting bonded typically costs around $175-200 per year.</p>
          <a href="https://quantumsurety.bond/quote" target="_blank" rel="noreferrer" className="inline-block mt-2 text-sm text-cyan-300 underline">Get an instant bond quote from Quantum Surety</a>
        </div>
      </section>

      <section id="faq" className="space-y-3">
        <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
        {[
          { q: "Can I do my own electrical work in Fort Worth?", a: "Homeowners may perform electrical work on their primary residence with a homestead permit. Rental properties require a licensed electrician." },
          { q: "How do I check my permit status?", a: "Check status online at aca-prod.accela.com/CFW using your permit number or address. Fort Worth also has a permit locations map at fortworthtexas.gov." },
          { q: "What happens if I build without a permit?", a: "Unpermitted work can result in stop-work orders, fines, and forced removal of the work. It can also complicate or kill a property sale when discovered during a home inspection." },
          { q: "Do I need a permit to replace my roof in Fort Worth?", a: "Shingle replacement does not require a permit. But replacing structural components like decking, sheathing, rafters, or ridge boards does require a building permit." },
          { q: "How do I schedule an inspection?", a: "Inspections are scheduled online through the Accela portal at least one business day in advance by permit type." },
          { q: "What is the CFW Permit Tool?", a: "The CFW Permit Tool at cfwpermit.fortworthtexas.gov helps contractors and homeowners determine which permits a project requires, estimate costs, and check zoning compliance." },
        ].map(item => (
          <details key={item.q} className="rounded-xl border border-white/10 bg-white/5 group">
            <summary className="p-4 cursor-pointer font-medium text-white text-sm">{item.q}</summary>
            <div className="px-4 pb-4 text-sm text-slate-300">{item.a}</div>
          </details>
        ))}
      </section>

      <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Know Every Permit Before You Break Ground</h2>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">Permit Pilot analyzes your Fort Worth project in seconds — identifying every required permit, estimating fees, flagging red flags, and generating a compliance checklist.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/projects/new" className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold hover:opacity-90 transition">Analyze My Project Free</a>
          <a href="/features" className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition">See All Features</a>
        </div>
        <p className="text-xs text-slate-500">Disclaimer: This guide is for informational purposes only. Always verify current requirements directly with the City of Fort Worth Development Services Department before submitting permit applications.</p>
      </section>

    </article>
  );
}
