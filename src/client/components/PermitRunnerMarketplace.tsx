import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface Runner {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  website?: string;
  jurisdictions?: string[];
  specialties?: string[];
  ratePerPermit?: number;
  rateType?: string;
  bio?: string;
  verified?: boolean;
}

interface Props {
  jurisdictionName: string;
  projectId: string;
  projectAddress?: string;
  userName?: string;
  userEmail?: string;
}

export default function PermitRunnerMarketplace({ jurisdictionName, projectId, projectAddress, userName, userEmail }: Props) {
  const [contactingId, setContactingId] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ name: userName || "", email: userEmail || "", phone: "", description: "" });
  const [sent, setSent] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const { data: runners, isLoading } = useQuery({
    queryKey: ["permit-runners", jurisdictionName],
    queryFn: () => fetch("/api/permit-runners?jurisdiction=" + encodeURIComponent(jurisdictionName), { credentials: "include" }).then(r => r.json()),
  });

  const handleContact = async (runner: Runner) => {
    setSending(true);
    try {
      const res = await fetch("/api/permit-runners/" + runner.id + "/contact", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contactForm,
          projectDescription: "Project at " + (projectAddress || "address on file") + ". Jurisdiction: " + jurisdictionName,
          jurisdiction: jurisdictionName,
        }),
      });
      if (res.ok) {
        setSent(runner.id);
        setContactingId(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (isLoading) return null;
  if (!runners?.length) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Permit Runners</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Local permit expediters who can submit your applications and track approvals in {jurisdictionName}
        </p>
      </div>

      <div className="space-y-3">
        {runners.map((runner: Runner) => (
          <div key={runner.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{runner.name}</h3>
                  {runner.verified && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs border border-emerald-400/20">
                      Verified
                    </span>
                  )}
                </div>
                {runner.company && <p className="text-sm text-slate-400">{runner.company}</p>}
                {runner.bio && <p className="text-sm text-slate-300 mt-2">{runner.bio}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  {runner.specialties?.map((s: string) => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-xs">{s}</span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                {runner.ratePerPermit && (
                  <p className="text-lg font-bold text-white">${runner.ratePerPermit}</p>
                )}
                <p className="text-xs text-slate-400">per permit</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {sent === runner.id ? (
                <span className="text-sm text-emerald-300">Inquiry sent!</span>
              ) : contactingId === runner.id ? (
                <div className="w-full space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})}
                      placeholder="Your name" className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400" />
                    <input value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})}
                      placeholder="Your email" className="px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400" />
                  </div>
                  <input value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})}
                    placeholder="Your phone (optional)" className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400" />
                  <div className="flex gap-2">
                    <button onClick={() => handleContact(runner)} disabled={sending || !contactForm.name || !contactForm.email}
                      className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium text-sm hover:bg-cyan-400 disabled:opacity-50">
                      {sending ? "Sending..." : "Send Inquiry"}
                    </button>
                    <button onClick={() => setContactingId(null)} className="px-4 py-2 rounded-lg bg-white/10 text-slate-300 text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button onClick={() => setContactingId(runner.id)}
                    className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400">
                    Contact Runner
                  </button>
                  {runner.phone && (
                    <a href={"tel:" + runner.phone} className="px-4 py-2 rounded-lg bg-white/10 text-slate-200 text-sm hover:bg-white/20">
                      {runner.phone}
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Permit runners are independent contractors. Permit Pilot does not guarantee their services.
        Always verify credentials before engaging.
      </p>
    </div>
  );
}
