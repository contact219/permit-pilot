import { useEffect } from "react";

export default function BlogRoomAddition() {
  useEffect(() => {
    document.title = "Room Addition Permit Requirements in Frisco, McKinney, Allen and Plano 2026 | Permit Pilot";
  }, []);

  const cities = [
    {
      city: "Frisco",
      portal: "etrakit.friscotexas.gov",
      reviewDays: "7-10",
      permits: ["Building Permit", "Electrical Permit", "Mechanical Permit", "Plumbing Permit (if applicable)"],
      docs: ["Site plan / survey with addition marked", "Floor plans showing all affected rooms", "Exterior elevations", "Foundation plan (engineered for additions over 400 sq ft)", "Energy compliance documentation (Manual J)", "Structural framing plan"],
      hoa: "Very high — most Frisco subdivisions require HOA architectural approval before city permits",
      notes: "Frisco requires contractor registration via friscotexas.gov/contractors before permits can be issued.",
    },
    {
      city: "McKinney",
      portal: "mckinneytexas.org",
      reviewDays: "10",
      permits: ["Building Permit", "Electrical Permit", "Mechanical Permit", "Plumbing Permit (if applicable)"],
      docs: ["Site plan showing addition footprint and setbacks", "Floor plans and elevations", "Structural calculations for foundation and framing", "Energy compliance documentation", "HVAC load calculations"],
      hoa: "High — Stonebridge Ranch and most master-planned communities require HOA approval",
      notes: "McKinney requires engineered foundation plans for all room additions.",
    },
    {
      city: "Allen",
      portal: "cityofallen.org",
      reviewDays: "7-10",
      permits: ["Building Permit", "Electrical Permit", "Mechanical Permit", "Plumbing Permit (if applicable)"],
      docs: ["Survey with proposed addition shown", "Construction drawings (floor plan, elevations, sections)", "Foundation and framing plans", "Energy code compliance documentation"],
      hoa: "High — most Allen neighborhoods have active HOAs",
      notes: "Allen Building Inspections is known for thorough plan review. Submit complete sets to avoid correction cycles.",
    },
    {
      city: "Plano",
      portal: "plano.gov",
      reviewDays: "10",
      permits: ["Building Permit", "Electrical Permit", "Mechanical Permit", "Plumbing Permit (if applicable)"],
      docs: ["Site plan", "Floor plans and elevations", "Structural plans (engineered)", "Energy compliance", "HVAC calculations"],
      hoa: "Moderate — varies significantly by neighborhood age and location",
      notes: "Plano uses the 2021 IBC with local amendments. Older neighborhoods may have smaller setbacks that limit addition size.",
    },
  ];

  return (
    <article className="max-w-3xl mx-auto pb-16 space-y-8">
      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 text-xs font-medium border border-cyan-400/20">Collin County</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium">Room Additions</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium">2026 Guide</span>
        </div>
        <h1 className="text-4xl font-bold text-white leading-tight">Room Addition Permit Requirements in Frisco, McKinney, Allen, and Plano (2026)</h1>
        <p className="text-lg text-slate-300">Collin County is one of the fastest-growing regions in America. Here is a complete permit guide for room additions in the four largest cities — including what documents you need, HOA considerations, and how to avoid delays.</p>
        <div className="flex items-center gap-4 text-sm text-slate-400 pt-2 border-t border-white/10">
          <span>By Permit Pilot</span><span>Updated April 2026</span><span>10 min read</span>
        </div>
      </header>

      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-6">
        <p className="text-sm text-cyan-200 font-medium mb-2">Key Fact</p>
        <p className="text-slate-200 text-sm leading-relaxed">All room additions in Frisco, McKinney, Allen, and Plano require building permits with no exceptions. Most also require HOA approval before the city will accept a permit application. Plan for 3-6 weeks total from HOA submission to permit in hand for a standard room addition in Collin County.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">What Counts as a Room Addition?</h2>
        <p className="text-slate-300 leading-relaxed">A room addition is any construction that expands the living space footprint of an existing home — including bedroom additions, bathroom additions, garage conversions, sunroom enclosures, covered patio enclosures, and second-story additions. All require building permits in every Collin County city.</p>
        <p className="text-slate-300 leading-relaxed">Key zoning considerations for room additions in Collin County cities include: lot coverage limits (typically 40-50% of lot area), setback requirements (usually 5-10 feet side yard, 20-25 feet rear yard), maximum structure height, and impervious surface limits that include driveways and patios.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Required Permits for a Room Addition</h2>
        <p className="text-slate-300">Most room additions in Collin County require 3-4 separate permits:</p>
        <div className="space-y-3">
          {[
            { permit: "Building Permit", always: true, desc: "Required for all structural work — foundation extension, framing, roofing, exterior walls, windows, and doors. This is the primary permit that must be issued before trade permits." },
            { permit: "Electrical Permit", always: true, desc: "Required for any new circuits, outlets, switches, lighting, or panel upgrades needed for the addition. Even if the addition is small, new circuits require an electrical permit." },
            { permit: "Mechanical Permit", always: true, desc: "Required if the addition is conditioned space (heated/cooled). HVAC extension or new equipment for the addition requires a mechanical permit and HVAC load calculations." },
            { permit: "Plumbing Permit", always: false, desc: "Required only if the addition includes a bathroom, wet bar, laundry room, or other plumbing. Not required for a standard bedroom or family room addition without plumbing." },
          ].map(item => (
            <div key={item.permit} className={"rounded-xl border p-4 " + (item.always ? "border-emerald-400/20 bg-emerald-400/5" : "border-amber-400/20 bg-amber-400/5")}>
              <div className="flex items-center gap-3 mb-1">
                <p className="font-semibold text-white text-sm">{item.permit}</p>
                <span className={"px-2 py-0.5 rounded-full text-xs " + (item.always ? "bg-emerald-400/20 text-emerald-300" : "bg-amber-400/20 text-amber-300")}>{item.always ? "Always Required" : "Sometimes Required"}</span>
              </div>
              <p className="text-slate-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {cities.map(city => (
        <section key={city.city} className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Room Addition Permits in {city.city}</h2>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-lg font-bold text-white">{city.reviewDays}</p>
              <p className="text-xs text-slate-400">Business days to review</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-lg font-bold text-white">{city.permits.length}</p>
              <p className="text-xs text-slate-400">Permits typically required</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-lg font-bold text-amber-300">Online</p>
              <p className="text-xs text-slate-400">Submission method</p>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
            <div>
              <p className="font-medium text-slate-200 text-sm mb-2">Required Permits</p>
              <ul className="space-y-1">
                {city.permits.map(p => <li key={p} className="flex items-center gap-2 text-sm text-slate-300"><span className="text-emerald-400 shrink-0">+</span>{p}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-medium text-slate-200 text-sm mb-2">Required Documents</p>
              <ul className="space-y-1">
                {city.docs.map(d => <li key={d} className="flex items-center gap-2 text-sm text-slate-300"><span className="text-cyan-400 shrink-0">+</span>{d}</li>)}
              </ul>
            </div>
            <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-3">
              <p className="text-sm font-medium text-amber-200 mb-1">HOA Requirement</p>
              <p className="text-sm text-slate-300">{city.hoa}</p>
            </div>
            {city.notes && <p className="text-xs text-slate-400 italic">{city.notes}</p>}
          </div>
          <p className="text-sm text-slate-400">Apply online: <a href={"https://" + city.portal} target="_blank" rel="noreferrer" className="text-cyan-300 underline">{city.portal}</a></p>
        </section>
      ))}

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">The HOA Approval Process in Collin County</h2>
        <p className="text-slate-300 leading-relaxed">Collin County has one of the highest HOA densities in Texas. Frisco, McKinney, Allen, and Plano are dominated by master-planned communities — most homes in these cities fall under HOA governance. HOA approval for a room addition typically requires:</p>
        <ul className="space-y-2 text-slate-300 text-sm">
          {["Architectural Review Committee (ARC) application", "Exterior elevation drawings showing how the addition looks from the street", "Materials and color samples matching the existing home", "Site plan showing setbacks and lot coverage", "Review period of 2-4 weeks (varies by HOA)", "Written approval letter before city permit submission"].map(item => (
            <li key={item} className="flex items-start gap-2"><span className="text-amber-400 mt-0.5 shrink-0">+</span>{item}</li>
          ))}
        </ul>
        <p className="text-slate-300 text-sm">Get HOA contact information and approval requirements for any Collin County address using Permit Pilot's <a href="/projects/new" className="text-cyan-300 underline">HOA Lookup tool</a>.</p>
      </section>

      <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Plan Your Collin County Room Addition Right</h2>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">Permit Pilot identifies every permit, document, and HOA requirement for room additions in Frisco, McKinney, Allen, and Plano — so you submit complete the first time.</p>
        <a href="/projects/new" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold hover:opacity-90 transition">Analyze My Addition Project Free</a>
        <p className="text-xs text-slate-500">Disclaimer: Requirements change. Always verify current permit requirements and HOA guidelines with the applicable city and HOA before starting any project.</p>
      </section>
    </article>
  );
}
