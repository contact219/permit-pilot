import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, patch, del } from '../../lib/api';
import AdminLayout from './Layout';

export default function AdminJurisdictions() {
  const queryClient = useQueryClient();
  const { data: jurisdictions, isLoading } = useQuery({ queryKey: ['admin', 'jurisdictions'], queryFn: () => get<any[]>('/api/admin/jurisdictions') });

  const createMutation = useMutation({ mutationFn: (data: any) => post('/api/admin/jurisdictions', data), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'jurisdictions'] }) });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => patch(`/api/admin/jurisdictions/${id}`, data), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'jurisdictions'] }) });
  const deleteMutation = useMutation({ mutationFn: (id: string) => del(`/api/admin/jurisdictions/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'jurisdictions'] }) });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Jurisdiction Management</h1>
        {isLoading ? <div className="text-slate-300">Loading...</div> : (
          <div className="grid gap-3">
            {jurisdictions?.map((j: any) => (
              <div key={j.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white">{j.name}</h3>
                <p className="text-sm text-slate-300">{j.city}, {j.state} • <a href={j.portalUrl} target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">Portal</a></p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => updateMutation.mutate({ id: j.id, data: { avgReviewDays: (j.avgReviewDays || 0) + 1 } })} className="rounded-lg bg-amber-500/20 px-3 py-1 text-amber-100">+1 Review Day</button>
                  <button onClick={() => deleteMutation.mutate(j.id)} className="rounded-lg bg-rose-500/20 px-3 py-1 text-rose-100">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => createMutation.mutate({ name: 'New Jurisdiction', state: 'TX', city: 'City', portalUrl: 'https://', submissionMethod: 'online', avgReviewDays: 7 })} className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950 hover:bg-emerald-400">Add Jurisdiction</button>
      </div>
    </AdminLayout>
  );
}
