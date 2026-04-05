export default function Features() {
  const features = [
    {
      category: "Permit Intelligence",
      icon: "🧭",
      color: "from-cyan-400/20 to-indigo-500/20",
      border: "border-cyan-400/20",
      items: [
        {
          title: "AI-Powered Permit Analysis",
          description: "Describe your project in plain English and our AI instantly identifies every permit required across all 24 DFW jurisdictions. No more guessing or calling city offices.",
          badge: "Core Feature",
        },
        {
          title: "Natural Language Project Input",
          description: "Just type what you're building — our AI extracts project type, square footage, and scope automatically. No forms to fill out.",
          badge: "AI-Powered",
        },
        {
          title: "Address Autocomplete + Auto-Jurisdiction",
          description: "Start typing any DFW address and we automatically detect the correct city jurisdiction, flood zone status, and applicable building codes.",
          badge: "Smart",
        },
        {
          title: "Red Flag Scanner",
          description: "Automatically flags complications before you submit — setback requirements, HOA approvals, historic district rules, survey requirements, and flood zone issues.",
          badge: "Risk Detection",
        },
        {
          title: "Conflict Detector",
          description: "AI analyzes your full permit set and flags conflicts between permits — like inspection sequence issues that cause costly delays.",
          badge: "AI-Powered",
        },
      ],
    },
    {
      category: "Compliance & Documentation",
      icon: "📋",
      color: "from-emerald-400/20 to-teal-500/20",
      border: "border-emerald-400/20",
      items: [
        {
          title: "PDF Compliance Checklist",
          description: "Download a professional PDF checklist with every required permit, fee estimate, required documents, inspection stages, and direct links to official city portals.",
          badge: "Export",
        },
        {
          title: "Pre-filled Permit Forms",
          description: "We pre-fill official permit application forms with your project data and bundle them into a downloadable ZIP package ready for submission.",
          badge: "Export",
        },
        {
          title: "Application Packet Builder",
          description: "Generate a complete submission packet — cover sheet, document checklist, fee payment instructions, and submission steps for any DFW jurisdiction.",
          badge: "Premium",
        },
        {
          title: "Bid Fee Estimator",
          description: "Get an AI-estimated permit fee breakdown before you bid. Know your total permit costs upfront so you never leave money on the table.",
          badge: "AI-Powered",
        },
      ],
    },
    {
      category: "Project Management",
      icon: "📊",
      color: "from-violet-400/20 to-purple-500/20",
      border: "border-violet-400/20",
      items: [
        {
          title: "Kanban Permit Status Tracking",
          description: "Track every permit through its lifecycle — Not Started, Applied, In Review, Approved — with a single click toggle for each permit.",
          badge: "Tracking",
        },
        {
          title: "Project Notes",
          description: "Log submission dates, inspector contacts, correction requests, and approval details directly on each permit. Never lose track of where things stand.",
          badge: "Organization",
        },
        {
          title: "Timeline Prediction",
          description: "AI predicts your realistic week-by-week timeline from application to final inspection based on jurisdiction averages and project complexity.",
          badge: "AI-Powered",
        },
        {
          title: "Inspection Reminders",
          description: "Set reminders for upcoming inspections and follow-ups. Get email notifications so nothing falls through the cracks on busy job sites.",
          badge: "Automation",
        },
        {
          title: "Client Share Links",
          description: "Generate a read-only share link for each project. Send it to your homeowner client so they can see permit status without calling you.",
          badge: "Client Portal",
        },
      ],
    },
    {
      category: "Local Intelligence",
      icon: "🗺️",
      color: "from-amber-400/20 to-orange-500/20",
      border: "border-amber-400/20",
      items: [
        {
          title: "HOA Lookup",
          description: "AI-powered check for HOA status, management company contact info, architectural approval requirements, and typical approval timelines by neighborhood.",
          badge: "Unique Feature",
        },
        {
          title: "Live Permit Status Lookup",
          description: "Search city open data in real time for Dallas, Fort Worth, and Arlington. Look up any permit by number or address to see current status.",
          badge: "Real-Time",
        },
        {
          title: "24 DFW Jurisdictions",
          description: "Complete coverage of Allen, Arlington, Bedford, Coppell, Dallas, Denton, Euless, Fort Worth, Frisco, Grand Prairie, Grapevine, Flower Mound, Haltom City, Hurst, Mansfield, McKinney, NRH, Pantego, Plano, Richland Hills, Watauga, Westlake, Wylie, and Dalworthington Gardens.",
          badge: "Coverage",
        },
        {
          title: "Permit Runner Marketplace",
          description: "Connect with verified local permit expediters who can physically submit your applications and track approvals — starting at $125 per permit.",
          badge: "Marketplace",
        },
      ],
    },
    {
      category: "Surety & Bonding",
      icon: "🔒",
      color: "from-rose-400/20 to-pink-500/20",
      border: "border-rose-400/20",
      items: [
        {
          title: "Contractor Bond Integration",
          description: "Permit Pilot automatically detects when your project requires a Contractor License Bond and connects you to Quantum Surety for an instant quote — approval in minutes, ~$175/year.",
          badge: "Powered by Quantum Surety",
        },
        {
          title: "Bond Requirement Detection",
          description: "Most DFW cities require proof of a $25,000 contractor license bond before accepting permit applications. We flag this automatically so you never get rejected at the counter.",
          badge: "Compliance",
        },
      ],
    },
    {
      category: "Enterprise & API",
      icon: "⚡",
      color: "from-indigo-400/20 to-blue-500/20",
      border: "border-indigo-400/20",
      items: [
        {
          title: "White-Label API",
          description: "Integrate Permit Pilot's permit intelligence directly into your own platform. RESTful API with endpoints for jurisdiction data, permit types, and AI analysis.",
          badge: "Agency Plan",
        },
        {
          title: "Progressive Web App",
          description: "Install Permit Pilot on your phone like a native app. Works on iOS and Android — add to home screen for quick access from job sites.",
          badge: "Mobile",
        },
        {
          title: "Team Seats",
          description: "Agency plan includes 5 user seats so your whole team can manage projects, track permits, and share checklists from one account.",
          badge: "Agency Plan",
        },
      ],
    },
  ];

  const badgeColor = (badge: string) => {
    if (badge === "AI-Powered") return "bg-violet-400/20 text-violet-200 border-violet-400/30";
    if (badge === "Unique Feature") return "bg-amber-400/20 text-amber-200 border-amber-400/30";
    if (badge === "Agency Plan") return "bg-indigo-400/20 text-indigo-200 border-indigo-400/30";
    if (badge === "Premium") return "bg-cyan-400/20 text-cyan-200 border-cyan-400/30";
    if (badge === "Real-Time") return "bg-emerald-400/20 text-emerald-200 border-emerald-400/30";
    if (badge.includes("Quantum")) return "bg-amber-400/20 text-amber-200 border-amber-400/30";
    return "bg-white/10 text-slate-300 border-white/10";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-16">

      <section className="text-center space-y-4">
        <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
          Everything Permit Pilot can do
        </p>
        <h1 className="text-4xl font-bold text-white md:text-5xl">
          The complete permit intelligence platform for DFW contractors
        </h1>
        <p className="text-lg text-slate-300 max-w-3xl mx-auto">
          From first address lookup to final inspection sign-off, Permit Pilot covers every step of the permitting process across all 24 DFW jurisdictions.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a href="/auth" className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold hover:opacity-90 transition">
            Start Free
          </a>
          <a href="/#pricing" className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition">
            View Pricing
          </a>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: "24", label: "DFW Jurisdictions" },
          { value: "AI", label: "Permit Analysis" },
          { value: "30s", label: "Analysis Time" },
          { value: "Free", label: "To Get Started" },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </section>

      {features.map(category => (
        <section key={category.category} className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{category.icon}</span>
            <h2 className="text-2xl font-bold text-white">{category.category}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {category.items.map(item => (
              <div key={item.title}
                className={"rounded-2xl border p-6 bg-gradient-to-br " + category.color + " " + category.border}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-white text-lg leading-snug">{item.title}</h3>
                  <span className={"shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border " + badgeColor(item.badge)}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 p-10 text-center space-y-6">
        <h2 className="text-3xl font-bold text-white">Ready to know every permit before you break ground?</h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Join contractors across the DFW metroplex who use Permit Pilot to win more bids, avoid stop-work orders, and close projects on time.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/auth" className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-lg hover:opacity-90 transition">
            Get Started Free
          </a>
          <a href="/about" className="px-8 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition">
            Learn More
          </a>
        </div>
        <p className="text-xs text-slate-500">No credit card required. Free tier includes 2 projects and 3 AI analyses per day.</p>
      </section>

    </div>
  );
}
