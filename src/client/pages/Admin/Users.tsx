import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, patch } from '../../lib/api';
import AdminLayout from './Layout';

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({ queryKey: ['admin', 'users'], queryFn: () => get<any[]>('/api/admin/users') });

  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => patch(`/api/admin/users/${id}`, data), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }) });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">User & Billing Management</h1>
        {isLoading ? <div className="text-slate-300">Loading users...</div> : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full text-sm">
              <thead className="bg-white/10 text-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Plan</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Stripe Customer</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u: any) => (
                  <tr key={u.id} className="border-t border-white/10 text-slate-100">
                    <td className="px-4 py-2">
                      <p>{u.email}</p>
                      <p className="text-xs text-slate-400">{u.id.substring(0, 8)}...</p>
                    </td>
                    <td className="px-4 py-2">
                      <select value={u.planTier || 'free'} onChange={(e) => updateMutation.mutate({ id: u.id, data: { planTier: e.target.value } })} className="rounded border border-white/20 bg-slate-800 px-2 py-1">
                        <option value="free">Free</option>
                        <option value="contractor">Contractor</option>
                        <option value="homeowner">Homeowner</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <select value={u.role || 'user'} onChange={(e) => updateMutation.mutate({ id: u.id, data: { role: e.target.value } })} className="rounded border border-white/20 bg-slate-800 px-2 py-1">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-300">{u.stripeCustomerId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
