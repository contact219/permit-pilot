import { useEffect } from "react";

export default function BlogContractorBond() {
  useEffect(() => {
    document.title = "DFW Contractor License Bond Requirements by City 2026 | Permit Pilot";
  }, []);

  const cities = [
    { city: "Fort Worth", amount: "$25,000", required: "Yes", notes: "Required for contractor registration with Development Services" },
    { city: "Dallas", amount: "$25,000", required: "Yes", notes: "Required for contractor registration. Apply via DallasNow portal." },
    { city: "Frisco", amount: "$25,000", required: "Yes", notes: "Required before permit issuance. Register at friscotexas.gov/contractors" },
    { city: "Plano", amount: "$25,000", required: "Yes", notes: "Required for all contractor types pulling permits" },
    { city: "McKinney", amount: "$25,000", required: "Yes", notes: "Required for contractor registration prior to permit application" },
    { city: "Allen", amount: "$25,000", required: "Yes", notes: "Required for general and specialty contractors" },
    { city: "Arlington", amount: "$25,000", required: "Yes", notes: "Required for all contractors performing permitted work" },
    { city: "Wylie", amount: "$10,000-$25,000", required: "Yes", notes: "Amount varies by contractor license type" },
    { city: "Denton", amount: "$25,000", required: "Yes", notes: "Required for contractor registration" },
    { city: "Grapevine", amount: "$25,000", required: "Yes", notes: "Required before permit issuance" },
    { city: "North Richland Hills", amount: "$10,000-$25,000", required: "Yes", notes: "Varies by trade type" },
    { city: "Flower Mound", amount: "$25,000", required: "Yes", notes: "Required for all permitted work" },
    { city: "Mansfield", amount: "$25,000", required: "Yes", notes: "Required for contractor registration" },
  ];

  return (
    <article className="max-w-3xl mx-auto pb-16 space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-medium border border-amber-400/20">Surety Bonds</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium">DFW Contractors</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium">2026 Guide</span>
        </div>
        <h1 className="text-4xl font-bold text-white leading-tight">DFW Contractor License Bond Requirements by City 2026</h1>
        <p className="text-lg text-slate-300">Every DFW city requires contractors to carry a license bond before permits are issued. Here is a complete breakdown of bond amounts, requirements, and costs by jurisdiction.</p>
        <div className="flex items-center gap-4 text-sm text-slate-400 pt-2 border-t border-white/10">
          <span>By Permit Pilot</span><span>Updated April 2026</span><span>7 min read</span>
        </div>
      </header>

      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-6">
        <p className="text-sm text-amber-200 font-medium mb-2">Key Fact</p>
        <p className="text-slate-200 text-sm leading-relaxed">Texas has no statewide contractor license. Instead, each city sets its own registration and bonding requirements. Most DFW cities require a $25,000 contractor license bond before a contractor can pull permits. The bond typically costs $175-250 per year depending on your credit.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">What Is a Contractor License Bond?</h2>
        <p className="text-slate-300 leading-relaxed">A contractor license bond — also called a contractor surety bond or license and permit bond — is a three-party agreement between the contractor (principal), a surety company, and the city or homeowner (obligee). It guarantees that the contractor will perform work according to code, fulfill contractual obligations, and comply with local regulations.</p>
        <p className="text-slate-300 leading-relaxed">If a contractor fails to complete work, violates building codes, or causes damages, the bond provides financial protection to the homeowner or city — up to the bond amount. The surety company pays the claim and then seeks reimbursement from the contractor.</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Typical Bond Amount", value: "$25,000", sub: "Most DFW cities" },
            { label: "Annual Premium", value: "$175-250", sub: "Good credit" },
            { label: "Approval Time", value: "Same Day", sub: "Most applicants" },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-300 mt-1">{stat.label}</p>
              <p className="text-xs text-slate-500">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Contractor Bond Requirements by DFW City</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/10 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Bond Amount</th>
                <th className="px-4 py-3 text-left">Required</th>
                <th className="px-4 py-3 text-left">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {cities.map(c => (
                <tr key={c.city} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-white">{c.city}</td>
                  <td className="px-4 py-3 text-amber-300 font-semibold">{c.amount}</td>
                  <td className="px-4 py-3 text-emerald-300">{c.required}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{c.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">How Much Does a Contractor Bond Cost in Texas?</h2>
        <p className="text-slate-300 leading-relaxed">The cost of a contractor license bond — called the bond premium — is a small percentage of the total bond amount. For a $25,000 bond, most contractors pay between $175-250 per year. The exact rate depends on your personal credit score:</p>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/10 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">Credit Score</th>
                <th className="px-4 py-3 text-left">Approximate Rate</th>
                <th className="px-4 py-3 text-left">Annual Cost ($25K Bond)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {[
                ["700+", "0.75% - 1%", "$188 - $250"],
                ["650-699", "1% - 2%", "$250 - $500"],
                ["600-649", "2% - 3%", "$500 - $750"],
                ["Below 600", "3% - 5%+", "$750+"],
              ].map(([score, rate, cost]) => (
                <tr key={score}><td className="px-4 py-3 font-medium text-white">{score}</td><td className="px-4 py-3">{rate}</td><td className="px-4 py-3 text-emerald-300">{cost}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">How to Get a Contractor Bond in Texas</h2>
        <ol className="space-y-3">
          {[
            { step: "1", title: "Determine your bond amount", desc: "Check with each city you plan to work in. Most DFW cities require $25,000, but amounts can vary by trade type or license class." },
            { step: "2", title: "Apply with a licensed surety", desc: "Apply with a Texas-licensed surety bond company. Most applications take less than 15 minutes and approval is same-day for most applicants." },
            { step: "3", title: "Pay the annual premium", desc: "Pay your first year's premium. You will receive your bond certificate within minutes to hours." },
            { step: "4", title: "Submit the bond with your contractor registration", desc: "Each city requires you to file the bond certificate as part of contractor registration. This is separate from the individual permit application." },
            { step: "5", title: "Renew annually", desc: "Most contractor bonds must be renewed annually. Set a reminder 60 days before expiration to avoid a lapse that could invalidate your contractor registration." },
          ].map(item => (
            <li key={item.step} className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 font-bold text-sm flex items-center justify-center border border-amber-400/30">{item.step}</span>
              <div><p className="font-semibold text-white mb-1">{item.title}</p><p className="text-slate-300 text-sm">{item.desc}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-orange-500/10 p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Get Your Contractor Bond in Minutes</h2>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">Quantum Surety offers instant contractor license bond quotes for Texas contractors. Same-day approval, Texas-licensed carrier, and AI-powered underwriting for faster results.</p>
        <a href="https://quantumsurety.bond/quote" target="_blank" rel="noreferrer" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold hover:opacity-90 transition">Get Instant Bond Quote</a>
        <p className="text-xs text-slate-500">Bond requirements vary by city and license type. Always verify current requirements directly with the applicable city before submitting contractor registration applications.</p>
      </section>
    </article>
  );
}
