import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';

export default function SharedProject() {
  const { token } = useParams<{ token: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['share', token],
    queryFn: async () => {
      const res = await fetch(`/api/share/${token}`);
      if (!res.ok) throw new Error('Not found');
      return res.json();
    },
    enabled: !!token,
  });

  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !data) return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <p className="text-4xl mb-4">🔗</p>
      <h2 className="text-2xl font-bold text-white mb-2">Link not found</h2>
      <p className="text-slate-400">This share link may have expired or been removed.</p>
    </div>
  );

  const { project, jurisdiction, permits } = data;

  const STATUS_COLORS: Record<string, string> = {
    not_started: 'bg-slate-700 text-slate-200',
    applied: 'bg-amber-500/20 text-amber-200',
    in_review: 'bg-blue-500/20 text-blue-200',
    approved: 'bg-emerald-500/20 text-emerald-200',
  };
  const STATUS_LABELS: Record<string, string> = {
    not_started: 'Not Started', applied: 'Applied', in_review: 'In Review', approved: 'Approved',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">Permit Status Report</p>
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            <p className="text-slate-300 mt-1">{project.address}</p>
            <p className="text-sm text-slate-400">Jurisdiction: {jurisdiction?.name}</p>
          </div>
          <span className="shrink-0 rounded-full bg-cyan-400/10 border border-cyan-400/30 px-3 py-1 text-xs text-cyan-200">
            Shared via Permit Pilot
          </span>
        </div>
      </div>

      {project.aiSummary && (
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Project Summary</h2>
          <p className="text-slate-200">{project.aiSummary}</p>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Permit Status</h2>
        {permits?.length > 0 ? permits.map((item: any) => (
          <div key={item.pp.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-white">{item.pt?.name}</h3>
                <p className="text-xs text-slate-400">Code: {item.pt?.code}</p>
              </div>
              <span className={'px-3 py-1 rounded-full text-xs font-medium ' + (STATUS_COLORS[item.pp.status] || STATUS_COLORS.not_started)}>
                {STATUS_LABELS[item.pp.status] || item.pp.status}
              </span>
            </div>
            {item.pt?.feeBase && (
              <p className="mt-2 text-sm text-slate-300">💰 Fee: ${item.pt.feeBase} base</p>
            )}
            {item.pp.notes && (
              <p className="mt-2 text-sm text-slate-400 border-t border-white/10 pt-2">{item.pp.notes}</p>
            )}
          </div>
        )) : <p className="text-slate-400">No permits identified yet.</p>}
      </div>

      <div className="rounded-xl border border-amber-300/20 bg-amber-400/10 p-4 text-xs text-amber-200">
        This permit status report is shared by your contractor via Permit Pilot. Information is for reference only — verify all requirements with your local permitting authority.
      </div>
    </div>
  );
}
