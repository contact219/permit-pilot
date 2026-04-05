import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "../lib/api";

interface Props {
  projectId: string;
  jurisdictionName: string;
  projectAddress?: string;
}

const SUPPORTED_CITIES = ["Dallas, TX", "Fort Worth, TX", "Arlington, TX"];

export default function PermitStatusLookup({ projectId, jurisdictionName, projectAddress }: Props) {
  const [permitNumber, setPermitNumber] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const supported = SUPPORTED_CITIES.includes(jurisdictionName);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["permit-status", projectId, searchTrigger],
    queryFn: () => {
      const params = permitNumber ? "?permitNumber=" + encodeURIComponent(permitNumber) : "";
      return get<any>("/api/projects/" + projectId + "/permit-status" + params);
    },
    enabled: supported && searchTrigger > 0,
  });

  if (!supported) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white mb-2">Permit Status Lookup</h2>
        <p className="text-sm text-slate-400">
          Live permit status lookup is available for Dallas, Fort Worth, and Arlington.
          For {jurisdictionName}, check the{" "}
          <a href="#" className="text-cyan-300 hover:underline">official city portal</a> directly.
        </p>
      </div>
    );
  }

  const statusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("issued") || s.includes("approved") || s.includes("final")) return "text-emerald-300 bg-emerald-400/10";
    if (s.includes("review") || s.includes("pending") || s.includes("plan")) return "text-amber-300 bg-amber-400/10";
    if (s.includes("expired") || s.includes("void") || s.includes("cancel")) return "text-rose-300 bg-rose-400/10";
    return "text-slate-300 bg-white/10";
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Live Permit Status</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
          {jurisdictionName} Open Data
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={permitNumber}
          onChange={e => setPermitNumber(e.target.value)}
          placeholder="Enter permit number (or leave blank to search by address)"
          className="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <button
          onClick={() => setSearchTrigger(t => t + 1)}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium text-sm hover:bg-cyan-400 disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {data?.stats && (
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-center">
            <p className="text-lg font-bold text-white">{data.stats.totalThisYear}+</p>
            <p className="text-xs text-slate-400">Permits this year</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{data.stats.avgDaysToApproval}</p>
            <p className="text-xs text-slate-400">Avg days to approval</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-cyan-300">{jurisdictionName.split(",")[0]}</p>
            <p className="text-xs text-slate-400">Jurisdiction</p>
          </div>
        </div>
      )}

      {data?.results?.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">{data.results.length} permit record(s) found</p>
          {data.results.map((r: any, i: number) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-medium text-white">{r.permitNumber || "N/A"}</p>
                  <p className="text-xs text-slate-400">{r.permitType}</p>
                </div>
                <span className={"px-2 py-1 rounded-full text-xs font-medium " + statusColor(r.status)}>
                  {r.status || "Unknown"}
                </span>
              </div>
              {r.address && <p className="text-sm text-slate-300 mb-1">Address: {r.address}</p>}
              {r.description && <p className="text-sm text-slate-400 mb-1">{r.description}</p>}
              {r.contractor && <p className="text-sm text-slate-400">Contractor: {r.contractor}</p>}
              {r.issueDate && <p className="text-xs text-slate-500 mt-2">Date: {new Date(r.issueDate).toLocaleDateString()}</p>}
              <p className="text-xs text-slate-500 mt-1">Source: {r.source}</p>
            </div>
          ))}
        </div>
      ) : searchTrigger > 0 && !isLoading ? (
        <div className="text-center py-6">
          <p className="text-slate-400 text-sm">No permit records found.</p>
          <p className="text-slate-500 text-xs mt-1">Try entering a specific permit number or check the city portal directly.</p>
        </div>
      ) : null}
    </div>
  );
}
