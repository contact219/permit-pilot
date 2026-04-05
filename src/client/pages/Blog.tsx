export default function Blog() {
  const posts = [
    {
      slug: "fort-worth-building-permit-requirements-2026",
      title: "Fort Worth Building Permit Requirements 2026 — Complete Guide",
      excerpt: "Everything contractors and homeowners need to know about pulling permits in Fort Worth, TX — what requires a permit, how much it costs, how long it takes, and how to apply online.",
      category: "Fort Worth",
      readTime: "12 min read",
      date: "April 2026",
      tags: ["Fort Worth", "Building Permits", "2026 Guide"],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-10">

      <section className="space-y-3">
        <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
          Permit Pilot Blog
        </p>
        <h1 className="text-4xl font-bold text-white">DFW Permit Guides & Resources</h1>
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
                <span key={tag} className="px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 text-xs border border-cyan-400/20">
                  {tag}
                </span>
              ))}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition leading-snug mb-2">
                {post.title}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">{post.excerpt}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/10">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
          </a>
        ))}

        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 flex flex-col items-center justify-center text-center space-y-2">
          <p className="text-slate-400 text-sm font-medium">More guides coming soon</p>
          <p className="text-slate-500 text-xs">DFW permit timeline comparison, pool permits in Texas, contractor bond requirements by city, and more.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Stop Guessing. Start Knowing.</h2>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">
          Use Permit Pilot to instantly identify every permit your project needs across all 24 DFW jurisdictions — no research required.
        </p>
        <a href="/projects/new"
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold hover:opacity-90 transition">
          Analyze My Project Free
        </a>
      </section>

    </div>
  );
}
