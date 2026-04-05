export default function ApiDocs() {
  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/me",
      description: "Get your API account info and plan details",
      auth: true,
      response: `{
  "id": "uuid",
  "email": "you@company.com",
  "companyName": "Your Company",
  "planTier": "agency",
  "apiVersion": "v1"
}`,
      example: null,
    },
    {
      method: "GET",
      path: "/api/v1/jurisdictions",
      description: "List all 24 DFW jurisdictions with portal URLs, submission methods, and average review days",
      auth: true,
      response: `{
  "data": [
    {
      "id": "uuid",
      "name": "Frisco, TX",
      "state": "TX",
      "city": "Frisco",
      "portalUrl": "https://etrakit.friscotexas.gov/",
      "submissionMethod": "online",
      "avgReviewDays": 10
    }
  ],
  "count": 24
}`,
      example: `curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://permitpilot.online/api/v1/jurisdictions`,
    },
    {
      method: "GET",
      path: "/api/v1/permits",
      description: "Get all permit types for a specific jurisdiction",
      auth: true,
      params: [{ name: "jurisdiction", type: "string", required: true, description: "City name e.g. Dallas, TX" }],
      response: `{
  "jurisdiction": { "id": "uuid", "name": "Dallas, TX", ... },
  "permits": [
    {
      "id": "uuid",
      "name": "Residential Building Permit",
      "code": "BLDG",
      "feeBase": "150.00",
      "feePerSqft": "0.89",
      "notes": "Required for structural work"
    }
  ],
  "count": 12
}`,
      example: `curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://permitpilot.online/api/v1/permits?jurisdiction=Dallas%2C%20TX"`,
    },
    {
      method: "POST",
      path: "/api/v1/analyze",
      description: "Run AI permit analysis on a project. Returns required permits, red flags, timeline prediction, and fee estimates.",
      auth: true,
      body: [
        { name: "description", type: "string", required: true, description: "Project description in plain English" },
        { name: "jurisdictionName", type: "string", required: true, description: "City name e.g. McKinney, TX" },
        { name: "address", type: "string", required: false, description: "Project address" },
        { name: "projectType", type: "string", required: false, description: "room_addition | pool | fence | etc." },
        { name: "squareFootage", type: "number", required: false, description: "Project square footage" },
        { name: "estimatedValue", type: "number", required: false, description: "Project value in dollars" },
        { name: "isCommercial", type: "boolean", required: false, description: "Default false" },
      ],
      response: `{
  "jurisdiction": {
    "name": "McKinney, TX",
    "portalUrl": "https://www.mckinneytexas.org/...",
    "avgReviewDays": 10
  },
  "analysis": {
    "projectClassification": "Residential Pool Installation",
    "requiredPermits": [
      { "name": "Pool Permit", "code": "POOL", "priority": "required", "reason": "..." },
      { "name": "Electrical Permit", "code": "ELEC", "priority": "required", "reason": "..." }
    ],
    "redFlags": ["Survey required within 90 days", "HOA approval likely needed"],
    "estimatedTimeline": "3-4 weeks",
    "plainEnglishSummary": "...",
    "bidEstimate": { "totalFees": 475, "breakdown": [...] },
    "conflictAnalysis": { "hasConflicts": false, "conflicts": [] }
  }
}`,
      example: `curl -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Installing a 15x30 inground pool with spa",
    "jurisdictionName": "McKinney, TX",
    "address": "123 Main St, McKinney, TX",
    "squareFootage": 450
  }' \
  https://permitpilot.online/api/v1/analyze`,
    },
  ];

  const methodColor = (method: string) => {
    if (method === "GET") return "bg-emerald-400/20 text-emerald-300 border-emerald-400/30";
    if (method === "POST") return "bg-cyan-400/20 text-cyan-300 border-cyan-400/30";
    if (method === "DELETE") return "bg-rose-400/20 text-rose-300 border-rose-400/30";
    return "bg-white/10 text-slate-300 border-white/10";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">

      <section className="space-y-3">
        <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
          Developer Documentation
        </p>
        <h1 className="text-4xl font-bold text-white">Permit Pilot API</h1>
        <p className="text-lg text-slate-300">
          Integrate DFW permit intelligence into your platform. Available on Agency plan.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Authentication</h2>
        <p className="text-slate-300 text-sm">All API requests require a Bearer token in the Authorization header.</p>
        <pre className="rounded-xl bg-slate-900 border border-white/10 p-4 text-sm text-cyan-300 overflow-x-auto">
{`Authorization: Bearer YOUR_API_KEY`}
        </pre>
        <div className="rounded-xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-200">
          API access is included with the <strong>Agency plan ($99/mo)</strong>. Contact{" "}
          <a href="mailto:support@permitpilot.online" className="underline">support@permitpilot.online</a>{" "}
          to get your API key.
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
        <h2 className="text-xl font-bold text-white">Base URL</h2>
        <pre className="rounded-xl bg-slate-900 border border-white/10 p-4 text-sm text-cyan-300">
{`https://permitpilot.online/api/v1`}
        </pre>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-medium text-white mb-1">Rate Limits</p>
            <p className="text-slate-400">100 requests/minute per API key</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-medium text-white mb-1">Response Format</p>
            <p className="text-slate-400">JSON — all endpoints return JSON</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Endpoints</h2>
        {endpoints.map((ep, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className={"px-2 py-1 rounded text-xs font-mono font-bold border " + methodColor(ep.method)}>
                  {ep.method}
                </span>
                <code className="text-white font-mono text-sm">{ep.path}</code>
                {ep.auth && (
                  <span className="px-2 py-0.5 rounded-full bg-violet-400/20 text-violet-300 text-xs border border-violet-400/20">
                    Auth Required
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-sm">{ep.description}</p>
            </div>

            {ep.params && (
              <div className="p-5 border-b border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Query Parameters</p>
                <div className="space-y-2">
                  {ep.params.map((p: any) => (
                    <div key={p.name} className="flex flex-wrap gap-3 text-sm">
                      <code className="text-cyan-300">{p.name}</code>
                      <span className="text-slate-500">{p.type}</span>
                      {p.required && <span className="text-rose-400 text-xs">required</span>}
                      <span className="text-slate-400">{p.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ep.body && (
              <div className="p-5 border-b border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Request Body</p>
                <div className="space-y-2">
                  {ep.body.map((p: any) => (
                    <div key={p.name} className="flex flex-wrap gap-3 text-sm">
                      <code className="text-cyan-300">{p.name}</code>
                      <span className="text-slate-500">{p.type}</span>
                      {p.required && <span className="text-rose-400 text-xs">required</span>}
                      <span className="text-slate-400">{p.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ep.example && (
              <div className="p-5 border-b border-white/10">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Example Request</p>
                <pre className="rounded-xl bg-slate-900 border border-white/10 p-4 text-xs text-slate-300 overflow-x-auto whitespace-pre">
                  {ep.example}
                </pre>
              </div>
            )}

            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Response</p>
              <pre className="rounded-xl bg-slate-900 border border-white/10 p-4 text-xs text-emerald-300 overflow-x-auto whitespace-pre">
                {ep.response}
              </pre>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Error Codes</h2>
        <div className="space-y-2 text-sm">
          {[
            { code: "200", desc: "Success" },
            { code: "400", desc: "Bad Request — missing or invalid parameters" },
            { code: "401", desc: "Unauthorized — missing or invalid API key" },
            { code: "403", desc: "Forbidden — plan does not include API access" },
            { code: "404", desc: "Not Found — jurisdiction or resource not found" },
            { code: "429", desc: "Rate Limited — too many requests" },
            { code: "500", desc: "Server Error — try again or contact support" },
          ].map(e => (
            <div key={e.code} className="flex gap-4 py-2 border-b border-white/5">
              <code className={"w-12 shrink-0 font-mono font-bold " + (e.code.startsWith("2") ? "text-emerald-300" : e.code.startsWith("4") ? "text-amber-300" : "text-rose-300")}>
                {e.code}
              </code>
              <span className="text-slate-300">{e.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-6 text-center space-y-3">
        <h2 className="text-xl font-bold text-white">Ready to integrate?</h2>
        <p className="text-slate-300 text-sm">API access is included with the Agency plan. Contact us to get started.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="mailto:support@permitpilot.online"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-sm hover:opacity-90 transition">
            Get API Access
          </a>
          <a href="/#pricing" className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-sm hover:bg-white/10 transition">
            View Pricing
          </a>
        </div>
      </section>

    </div>
  );
}
