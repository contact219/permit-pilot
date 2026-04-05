import { useEffect } from "react";

export default function BlogDFWTimeline() {
  useEffect(() => {
    document.title = "How Long Does a Building Permit Take in DFW? All 24 Cities Compared 2026 | Permit Pilot";
  }, []);

  const cities = [
    { city: "Fort Worth", days: "7", method: "Online (Accela)", portal: "aca-prod.accela.com/CFW", tier: "fast" },
    { city: "Frisco", days: "7-10", method: "Online (eTRAKiT)", portal: "etrakit.friscotexas.gov", tier: "fast" },
    { city: "Allen", days: "7-10", method: "Online", portal: "cityofallen.org", tier: "fast" },
    { city: "Wylie", days: "7-10", method: "Online", portal: "wylietexas.gov", tier: "fast" },
    { city: "Grapevine", days: "7-10", method: "Online", portal: "grapevinetexas.gov", tier: "fast" },
    { city: "Coppell", days: "7-10", method: "Online", portal: "ci.coppell.tx.us", tier: "fast" },
    { city: "McKinney", days: "10", method: "Online", portal: "mckinneytexas.org", tier: "medium" },
    { city: "Plano", days: "10", method: "Online", portal: "plano.gov", tier: "medium" },
    { city: "Arlington", days: "10", method: "Online", portal: "arlingtontx.gov", tier: "medium" },
    { city: "Denton", days: "10", method: "Online", portal: "cityofdenton.com", tier: "medium" },
    { city: "North Richland Hills", days: "10", method: "Online", portal: "nrhtx.com", tier: "medium" },
    { city: "Hurst", days: "10", method: "Online", portal: "ci.hurst.tx.us", tier: "medium" },
    { city: "Euless", days: "10", method: "Online", portal: "eulesst.com", tier: "medium" },
    { city: "Bedford", days: "10", method: "Online", portal: "bedfordtx.gov", tier: "medium" },
    { city: "Mansfield", days: "10", method: "Online", portal: "mansfieldtexas.gov", tier: "medium" },
    { city: "Flower Mound", days: "10", method: "Online", portal: "flower-mound.com", tier: "medium" },
    { city: "Haltom City", days: "10-14", method: "Online/In-person", portal: "haltomcitytx.com", tier: "slower" },
    { city: "Richland Hills", days: "10-14", method: "Online/In-person", portal: "richlandhills.com", tier: "slower" },
    { city: "Watauga", days: "10-14", method: "Online/In-person", portal: "wataugatx.org", tier: "slower" },
    { city: "Grand Prairie", days: "10-14", method: "Online", portal: "gptx.org", tier: "slower" },
    { city: "Dallas", days: "10-25", method: "Online (DallasNow)", portal: "dallascityhall.com", tier: "variable" },
    { city: "Westlake", days: "10-14", method: "Online", portal: "westlaketx.gov", tier: "slower" },
    { city: "Pantego", days: "7-10", method: "In-person", portal: "ci.pantego.tx.us", tier: "fast" },
    { city: "Dalworthington Gardens", days: "7-10", method: "In-person", portal: "dwgcity.org", tier: "fast" },
  ];

  const tierColor = (tier: string) => {
    if (tier === "fast") return "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";
    if (tier === "medium") return "text-amber-300 bg-amber-400/10 border-amber-400/20";
    if (tier === "slower") return "text-orange-300 bg-orange-400/10 border-orange-400/20";
    return "text-rose-300 bg-rose-400/10 border-rose-400/20";
  };

  const tierLabel = (tier: string) => {
    if (tier === "fast") return "Fast";
    if (tier === "medium") return "Average";
    if (tier === "slower") return "Slower";
    return "Variable";
  };

  return (
    <article className="max-w-3xl mx-auto pb-16 space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 text-xs font-medium border border-cyan-400/20">DFW</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium">Permit Timelines</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium">2026 Comparison</span>
        </div>
        <h1 className="text-4xl font-bold text-white leading-tight">How Long Does a Building Permit Take in DFW? All 24 Cities Compared (2026)</h1>
        <p className="text-lg text-slate-300">Permit review times vary dramatically across the DFW metroplex. Here is a complete city-by-city comparison so you can plan your project timeline accurately.</p>
        <div className="flex items-center gap-4 text-sm text-slate-400 pt-2 border-t border-white/10">
          <span>By Permit Pilot</span><span>Updated April 2026</span><span>8 min read</span>
        </div>
      </header>

      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-6">
        <p className="text-sm text-cyan-200 font-medium mb-2">Key Takeaway</p>
        <p className="text-slate-200 text-sm leading-relaxed">Most DFW cities target 7-10 business days for residential permit review. Dallas is the outlier — complex commercial projects can take 10-25 business days with multiple correction cycles. Fort Worth and most suburban cities are the fastest at 7 business days.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">DFW Permit Review Times by City</h2>
        <p className="text-slate-300 text-sm">Times shown are for standard residential building permit review. Commercial projects, historic districts, and complex plans take longer. Always verify current times directly with the city.</p>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/10 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Review Time</th>
                <th className="px-4 py-3 text-left">Speed</th>
                <th className="px-4 py-3 text-left">Submission Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {cities.map(c => (
                <tr key={c.city} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-white">{c.city}</td>
                  <td className="px-4 py-3">{c.days} business days</td>
                  <td className="px-4 py-3">
                    <span className={"px-2 py-0.5 rounded-full text-xs border " + tierColor(c.tier)}>{tierLabel(c.tier)}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{c.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">What Affects Permit Review Time?</h2>
        <div className="space-y-3">
          {[
            { title: "Project Complexity", desc: "Simple fence or shed permits often clear in 2-3 days. Room additions with structural plans, MEP drawings, and energy calculations take the full review period." },
            { title: "Plan Completeness", desc: "The number one cause of delays is incomplete plan sets. Missing a site plan, structural calculations, or energy compliance documentation triggers a correction cycle that adds 5-10 business days per round." },
            { title: "Department Workload", desc: "Spring and early summer are peak permit season across DFW. Submitting in January or February typically gets faster review than submitting in April or May." },
            { title: "Corrections and Resubmittals", desc: "Most Dallas commercial projects go through 2-3 correction cycles. Each cycle adds days. Collin County suburban cities like Frisco and McKinney tend to have fewer correction cycles for well-prepared submittals." },
            { title: "Expedited Review", desc: "Most DFW cities offer expedited review for an additional fee — typically 50-100% of the base permit fee. Fort Worth, Dallas, Plano, and Frisco all offer expedited options." },
            { title: "Trade Permits", desc: "Building, electrical, mechanical, and plumbing permits are often reviewed simultaneously in most DFW cities, which helps. But in some smaller cities, trade permits are reviewed sequentially after the building permit." },
          ].map(item => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white mb-1">{item.title}</p>
              <p className="text-slate-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Tips to Speed Up Your DFW Permit</h2>
        <ul className="space-y-2 text-slate-300 text-sm">
          {[
            "Submit online whenever possible — online applications enter the queue immediately, while mailed or in-person submittals may wait for processing.",
            "Use the city's pre-application checklist — every DFW city publishes a submittal requirements document. Match it exactly before submitting.",
            "Submit a complete plan set the first time — a single missing document can trigger a correction cycle and add 5-10 days.",
            "Consider expedited review for time-sensitive projects — the premium is often worth it on large commercial jobs.",
            "Schedule your permit runner early — if you use a local permit expediter, engage them before you need the permit, not after.",
            "Run a Permit Pilot analysis before submitting — it identifies all required permits upfront so you do not miss a trade permit and have to go back.",
          ].map(tip => (
            <li key={tip} className="flex items-start gap-2">
              <span className="text-cyan-400 mt-0.5 shrink-0">+</span><span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Know What You Need Before You Submit</h2>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">Permit Pilot identifies every required permit for your DFW project in seconds — so you submit complete the first time and avoid correction cycles.</p>
        <a href="/projects/new" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold hover:opacity-90 transition">Analyze My Project Free</a>
        <p className="text-xs text-slate-500">Disclaimer: Review times are estimates based on city-published targets. Actual times vary by project complexity, department workload, and plan completeness. Always verify current timelines with the applicable city.</p>
      </section>
    </article>
  );
}
