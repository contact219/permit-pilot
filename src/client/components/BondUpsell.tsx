import { useQuery } from "@tanstack/react-query";

interface Props {
  project: any;
  user: any;
  jurisdiction: any;
  permits: any[];
}

const BOND_CODES = ["BLDG", "ELEC", "PLMB", "MECH", "POOL", "DEMO", "COMM"];

function bondLikelyNeeded(permits: any[]): boolean {
  if (!permits?.length) return false;
  return permits.some((p: any) => BOND_CODES.includes(p.pt?.code));
}

function buildUrl(project: any, user: any, jurisdiction: any): string {
  const base = "https://quantumsurety.bond/bonds/contractor-license";
  const p: Record<string, string> = { source: "permit-pilot", bond_type: "contractor_license", bond_amount: "25000" };
  if (user?.companyName) p.company = user.companyName;
  if (user?.email) p.email = user.email;
  if (project?.address) p.address = project.address;
  if (jurisdiction?.state) p.state = jurisdiction.state;
  if (jurisdiction?.city) p.city = jurisdiction.city;
  if (project?.name) p.project = project.name;
  return base + "?" + new URLSearchParams(p).toString();
}

export default function BondUpsell({ project, user, jurisdiction, permits }: Props) {
  if (!bondLikelyNeeded(permits)) return null;

  const url = buildUrl(project, user, jurisdiction);

  return (
    <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/10 to-orange-500/10 p-6">
      <div className="flex flex-wrap items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-slate-950 text-xl">
          B
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="font-bold text-white">Contractor License Bond Required</h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-xs font-medium border border-amber-400/30">
              Powered by Quantum Surety
            </span>
          </div>
          <p className="text-sm text-slate-300 mb-4">
            Most {jurisdiction?.name || "DFW"} jurisdictions require a{" "}
            <strong className="text-white">$25,000 Contractor License Bond</strong>{" "}
            before accepting a permit application. Get an instant quote from Quantum Surety.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <a href={url} target="_blank" rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold text-sm hover:opacity-90 transition">
              Get Instant Bond Quote
            </a>
            <div className="flex flex-wrap gap-4 text-xs">
              <span className="text-emerald-400">Texas licensed</span>
              <span className="text-emerald-400">Same-day approval</span>
              <span className="text-emerald-400">approx $175/year</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
