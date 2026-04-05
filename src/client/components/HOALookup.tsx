import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface Props {
  projectId: string;
  projectAddress?: string;
}

export default function HOALookup({ projectId, projectAddress }: Props) {
  const [triggered, setTriggered] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["hoa", projectId],
    queryFn: () => fetch("/api/projects/" + projectId + "/hoa", { credentials: "include" }).then(r => r.json()),
    enabled: triggered,
    staleTime: 1000 * 60 * 60, // cache 1 hour
  });

  const confidenceColor = (c: string) => {
    if (c === "high") return "text-emerald-300";
    if (c === "medium") return "text-amber-300";
    return "text-slate-400";
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">HOA Lookup</h2>
          <p className="text-sm text-slate-400 mt-0.5">Check if HOA approval is needed before submitting permits</p>
        </div>
        {!triggered && (
          <button
            onClick={() => setTriggered(true)}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400"
          >
            Check HOA Status
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 py-4">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-300">Analyzing HOA status for {projectAddress}...</p>
        </div>
      )}

      {data && !isLoading && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {data.hasHOA === true ? (
              <span className="px-3 py-1.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 font-medium text-sm">
                HOA Detected
              </span>
            ) : data.hasHOA === false ? (
              <span className="px-3 py-1.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 font-medium text-sm">
                No HOA Found
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/30 font-medium text-sm">
                HOA Status Unknown
              </span>
            )}
            {data.approvalRequired && (
              <span className="px-3 py-1.5 rounded-full bg-rose-400/20 text-rose-200 border border-rose-400/30 font-medium text-sm">
                Approval Required
              </span>
            )}
            <span className={"text-xs " + confidenceColor(data.confidence)}>
              {data.confidence} confidence
            </span>
          </div>

          {data.hoaName && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
              <h3 className="font-semibold text-white">{data.hoaName}</h3>
              {data.managementCompany && <p className="text-sm text-slate-300">Managed by: {data.managementCompany}</p>}
              <div className="flex flex-wrap gap-4 text-sm">
                {data.phone && <a href={"tel:" + data.phone} className="text-cyan-300 hover:underline">{data.phone}</a>}
                {data.email && <a href={"mailto:" + data.email} className="text-cyan-300 hover:underline">{data.email}</a>}
                {data.website && <a href={data.website} target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">HOA Website</a>}
              </div>
            </div>
          )}

          {data.approvalNotes && (
            <div className="rounded-xl border border-amber-300/20 bg-amber-400/10 p-4">
              <p className="text-sm font-medium text-amber-200 mb-1">Approval Requirements</p>
              <p className="text-sm text-amber-100">{data.approvalNotes}</p>
              {data.typicalApprovalDays && (
                <p className="text-xs text-amber-200 mt-2">Typical approval time: {data.typicalApprovalDays} days</p>
              )}
            </div>
          )}

          {data.commonRestrictions && data.commonRestrictions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-300 mb-2">Common Restrictions</p>
              <div className="flex flex-wrap gap-2">
                {data.commonRestrictions.map((r: string, i: number) => (
                  <span key={i} className="px-2 py-1 rounded-full bg-white/10 text-slate-300 text-xs">{r}</span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500">Source: {data.source} - Verify directly with the HOA before submitting permits.</p>
        </div>
      )}
    </div>
  );
}
