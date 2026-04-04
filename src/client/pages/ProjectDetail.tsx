import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { useState } from 'react';
import { get, post, del } from '../lib/api';
import StatusBadge from '../components/StatusBadge';
import ChecklistExport from '../components/ChecklistExport';
import FormZipExport from '../components/FormZipExport';

const PERMIT_STATUSES = ['not_started', 'applied', 'in_review', 'approved'] as const;
type PermitStatus = typeof PERMIT_STATUSES[number];

const STATUS_LABELS: Record<PermitStatus, string> = {
  not_started: 'Not Started', applied: 'Applied', in_review: 'In Review', approved: 'Approved',
};
const STATUS_ACTIVE: Record<PermitStatus, string> = {
  not_started: 'bg-slate-700 text-slate-200',
  applied: 'bg-amber-500/20 text-amber-200 border border-amber-400/30',
  in_review: 'bg-blue-500/20 text-blue-200 border border-blue-400/30',
  approved: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30',
};

async function patchPermit(projectId: string, permitId: string, body: object) {
  const res = await fetch(`/api/projects/${projectId}/permits/${permitId}`, {
    method: 'PATCH', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const { data, isLoading, error } = useQuery({ queryKey: ['project', id], queryFn: () => get<any>(`/api/projects/${id}`), enabled: !!id });
  const reanalyzeMutation = useMutation({ mutationFn: () => post<any>(`/api/projects/${id}/analyze`, {}), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', id] }) });
  const deleteMutation = useMutation({ mutationFn: () => del(`/api/projects/${id}`), onSuccess: () => navigate('/dashboard') });
  const statusMutation = useMutation({
    mutationFn: ({ permitId, status }: { permitId: string; status: string }) => patchPermit(id!, permitId, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', id] }),
  });
  const noteMutation = useMutation({
    mutationFn: ({ permitId, notes }: { permitId: string; notes: string }) => patchPermit(id!, permitId, { notes }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['project', id] }); setEditingNote(null); },
  });

  if (isLoading) return <div className="rounded-2xl border border-white/10 bg-white/5 p-8">Loading project...</div>;
  if (error || !data) return <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-200">Project not found</div>;

  const { project, jurisdiction, permits } = data as any;

  return (
    <div className="space-y-8">

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            <p className="text-slate-300">{project.address}</p>
            <p className="text-sm text-slate-400">Jurisdiction: {jurisdiction?.name || 'Unknown'}</p>
            {jurisdiction?.lastVerified && (
              <p className="mt-1 inline-flex rounded-full border border-cyan-200/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                Data last verified: {new Date(jurisdiction.lastVerified).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <ChecklistExport projectId={project.id} />
            <FormZipExport projectId={project.id} />
            <button onClick={() => reanalyzeMutation.mutate()} disabled={reanalyzeMutation.isPending}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 disabled:opacity-50">
              {reanalyzeMutation.isPending ? 'Analyzing...' : 'Re-run Analysis'}
            </button>
            <button onClick={async () => {
              const res = await fetch(`/api/projects/${id}/share`, { method: 'POST', credentials: 'include' });
              const data = await res.json();
              navigator.clipboard.writeText(data.shareUrl);
              alert('Share link copied to clipboard!');
            }} className="px-4 py-2 rounded-lg bg-indigo-500/80 text-white hover:bg-indigo-500">🔗 Share</button>
            <button onClick={() => deleteMutation.mutate()} className="px-4 py-2 rounded-lg bg-rose-500/80 text-white hover:bg-rose-500">Delete</button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-6">
        <h2 className="mb-2 text-xl font-semibold text-white">AI Analysis Summary</h2>
        <p className="whitespace-pre-wrap text-slate-100">{project.aiSummary || 'No summary yet. Click Re-run Analysis to generate.'}</p>
        <div className="mt-4 rounded-md border border-yellow-200/50 bg-yellow-50/10 p-4 text-sm text-yellow-200">
          <strong>Disclaimer:</strong> AI-generated for informational purposes only. Always verify directly with your local permitting authority before submitting applications.
        </div>
      </div>

      {/* Bid Estimate */}
      {(project.bidEstimate as any)?.totalFees && (
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-3">💰 Permit Fee Estimate</h2>
          <p className="text-3xl font-bold text-emerald-300 mb-4">${(project.bidEstimate as any).totalFees?.toLocaleString()}</p>
          <div className="space-y-2">
            {(project.bidEstimate as any).breakdown?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-300">{item.permit}</span>
                <span className="text-white font-medium">${item.fee?.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">Estimate only — verify fees with the jurisdiction before bidding.</p>
        </div>
      )}

      {/* Timeline Prediction */}
      {project.timelinePrediction && (
        <div className="rounded-2xl border border-indigo-300/20 bg-indigo-400/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-3">📅 Timeline Prediction</h2>
          <p className="text-slate-200 whitespace-pre-wrap text-sm">{project.timelinePrediction as string}</p>
        </div>
      )}

      {/* Conflict Analysis */}
      {(project.conflictAnalysis as any)?.hasConflicts && (
        <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-3">⚠️ Permit Conflicts Detected</h2>
          <div className="space-y-3">
            {(project.conflictAnalysis as any).conflicts?.map((c: any, i: number) => (
              <div key={i} className="rounded-xl bg-white/5 p-4">
                <p className="text-sm font-medium text-rose-200 mb-1">{c.issue}</p>
                <p className="text-xs text-slate-300"><strong>Permits:</strong> {c.permits?.join(', ')}</p>
                <p className="text-xs text-emerald-300 mt-1"><strong>Resolution:</strong> {c.resolution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags */}
      {Array.isArray(project.redFlags) && (project.redFlags as string[]).length > 0 && (
        <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-3">🚩 Red Flags</h2>
          <ul className="space-y-2">
            {(project.redFlags as string[]).map((flag: string, i: number) => (
              <li key={i} className="flex gap-2 text-sm text-amber-100">
                <span className="shrink-0">•</span> {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-white">Required Permits</h2>
          {permits?.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              {PERMIT_STATUSES.map(s => (
                <span key={s} className={'px-2 py-1 rounded-full ' + STATUS_ACTIVE[s]}>
                  {STATUS_LABELS[s]}: {permits.filter((p: any) => p.pp.status === s).length}
                </span>
              ))}
            </div>
          )}
        </div>

        {permits?.length > 0 ? permits.map((item: any) => (
          <div key={item.pp.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 flex flex-wrap justify-between items-start gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.pt?.name}</h3>
                <p className="text-sm text-slate-400">Code: {item.pt?.code}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {PERMIT_STATUSES.map(s => (
                  <button key={s}
                    onClick={() => statusMutation.mutate({ permitId: item.pp.id, status: s })}
                    className={'px-3 py-1 rounded-full text-xs font-medium transition ' + (item.pp.status === s ? STATUS_ACTIVE[s] : 'bg-white/5 text-slate-400 hover:bg-white/10')}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {item.pt?.feeBase && (
              <p className="mb-2 text-sm text-slate-300">
                <span className="font-medium text-slate-100">💰 Fee:</span> ${item.pt.feeBase} base{item.pt.feePerSqft ? ' + $' + item.pt.feePerSqft + '/sqft' : ''}
              </p>
            )}

            {jurisdiction?.portalUrl && (
              <p className="mb-2 text-sm">
                <span className="font-medium text-slate-100">🔗 Portal: </span>
                <a href={jurisdiction.portalUrl} target="_blank" rel="noreferrer" className="text-cyan-300 underline-offset-2 hover:underline">{jurisdiction.name} Permit Portal</a>
              </p>
            )}

            <div className="mt-4 border-t border-white/10 pt-4">
              {editingNote === item.pp.id ? (
                <div className="space-y-2">
                  <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3}
                    className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Add notes about this permit (submission date, inspector contact, etc.)" />
                  <div className="flex gap-2">
                    <button onClick={() => noteMutation.mutate({ permitId: item.pp.id, notes: noteText })}
                      className="px-3 py-1 rounded bg-cyan-500 text-slate-950 text-sm font-medium">Save</button>
                    <button onClick={() => setEditingNote(null)} className="px-3 py-1 rounded bg-white/10 text-slate-300 text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-slate-300 flex-1">{item.pp.notes || <span className="text-slate-500 italic">No notes yet.</span>}</p>
                  <button onClick={() => { setEditingNote(item.pp.id); setNoteText(item.pp.notes || ''); }}
                    className="shrink-0 rounded px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white">
                    ✏️ {item.pp.notes ? 'Edit' : 'Add note'}
                  </button>
                </div>
              )}
            </div>

            {item.pt?.lastVerified && (
              <p className="mt-2 text-xs text-slate-500">Data last verified: {new Date(item.pt.lastVerified).toLocaleDateString()}</p>
            )}
          </div>
        )) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-slate-300 mb-4">No permits identified yet.</p>
            <button onClick={() => reanalyzeMutation.mutate()} disabled={reanalyzeMutation.isPending}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 disabled:opacity-50">
              {reanalyzeMutation.isPending ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
