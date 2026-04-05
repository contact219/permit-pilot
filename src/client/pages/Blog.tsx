export default function Blog() {
  const posts = [
    {
      slug: "fort-worth-building-permit-requirements-2026",
      title: "Fort Worth Building Permit Requirements 2026 — Complete Guide",
      excerpt: "Everything contractors and homeowners need to know about pulling permits in Fort Worth, TX — what requires a permit, how much it costs, how long it takes, and how to apply online.",
      tags: ["Fort Worth", "Building Permits", "2026 Guide"],
      date: "April 2026",
      readTime: "12 min read",
    },
    {
      slug: "how-long-does-a-building-permit-take-dfw-2026",
      title: "How Long Does a Building Permit Take in DFW? All 24 Cities Compared (2026)",
      excerpt: "Permit review times vary dramatically across the DFW metroplex. A complete city-by-city comparison of residential permit timelines — from Fort Worth's 7 days to Dallas's 10-25 days.",
      tags: ["DFW", "Permit Timelines", "All Cities"],
      date: "April 2026",
      readTime: "8 min read",
    },
    {
      slug: "pool-permit-requirements-texas-dfw-2026",
      title: "Do I Need a Permit for a Pool in Texas? DFW Cities Compared (2026)",
      excerpt: "Yes — every DFW city requires building permits for pool construction. Here is a complete guide to pool permits, required inspections, HOA approvals, and fees across 12 DFW cities.",
      tags: ["Pool Permits", "Texas", "DFW 2026"],
      date: "April 2026",
      readTime: "9 min read",
    },
    {
      slug: "dfw-contractor-license-bond-requirements-2026",
      title: "DFW Contractor License Bond Requirements by City 2026",
      excerpt: "Every DFW city requires contractors to carry a license bond before permits are issued. Complete breakdown of bond amounts ($25,000 in most cities), annual costs ($175-250), and how to get bonded fast.",
      tags: ["Surety Bonds", "DFW Contractors", "2026"],
      date: "April 2026",
      readTime: "7 min read",
    },
    {
      slug: "room-addition-permit-requirements-frisco-mckinney-allen-plano-2026",
      title: "Room Addition Permit Requirements in Frisco, McKinney, Allen, and Plano (2026)",
      excerpt: "Complete permit guide for room additions in Collin County's four largest cities — required documents, HOA approval processes, timelines, and tips to avoid correction cycles.",
      tags: ["Room Additions", "Collin County", "Frisco McKinney Allen Plano"],
      date: "April 2026",
      readTime: "10 min read",
    },
  ];

  const tagColor = (tag: string) => {
    if (tag.includes("Fort Worth") || tag.includes("DFW") || tag.includes("Texas")) return "bg-cyan-400/10 text-cyan-300 border-cyan-400/20";
    if (tag.includes("Bond") || tag.includes("Surety")) return "bg-amber-400/10 text-amber-300 border-amber-400/20";
    if (tag.includes("Pool")) return "bg-blue-400/10 text-blue-300 border-blue-400/20";
    if (tag.includes("Collin") || tag.includes("Frisco") || tag.includes("McKinney")) return "bg-violet-400/10 text-violet-300 border-violet-400/20";
    return "bg-white/10 text-slate-300 border-white/10";
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-10">
      <section className="space-y-3">
        <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
          Permit Pilot Blog
        </p>
        <h1 className="text-4xl font-bold text-white">DFW Permit Guides and Resources</h1>
        <p className="text-lg text-slate-300 max-w-2xl">
          In-depth guides on building permit requirements across all 24 DFW jurisdictions. Written for contractors, homeowners, and real estate professionals.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {posts.map(post => (
          <a key={post.slug} href={"/blog/" + post.slug}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-cyan-400/30 transition space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className={"px-2 py-0.5 rounded-full text-xs border " + tagColor(tag)}>{tag}</span>
              ))}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition leading-snug mb-2">{post.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{post.excerpt}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/10">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
          </a>
        ))}
      </section>

      <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Stop Guessing. Start Knowing.</h2>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">Use Permit Pilot to instantly identify every permit your project needs across all 24 DFW jurisdictions — no research required.</p>
        <a href="/projects/new" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold hover:opacity-90 transition">Analyze My Project Free</a>
      </section>
    </div>
  );
}
