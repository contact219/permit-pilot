import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, patch } from '../../lib/api';

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({ queryKey: ['admin', 'users'], queryFn: () => get<any[]>('/api/admin/users') });

  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => patch(`/api/admin/users/${id}`, data), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }) });

  if (isLoading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Plan Tier</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Stripe Customer ID</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => (
              <tr key={u.id}>
                <td className="border px-4 py-2 text-sm">{u.id.substring(0, 8)}...</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">
                  <select value={u.planTier || 'free'} onChange={(e) => updateMutation.mutate({ id: u.id, data: { planTier: e.target.value } })} className="border rounded">
                    <option value="free">Free</option>
                    <option value="contractor">Contractor</option>
                    <option value="homeowner">Homeowner</option>
                  </select>
                </td>
                <td className="border px-4 py-2">
                  <select value={u.role || 'user'} onChange={(e) => updateMutation.mutate({ id: u.id, data: { role: e.target.value } })} className="border rounded">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="border px-4 py-2 text-sm">{u.stripeCustomerId?.substring(0, 10) || '-'}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => { if (confirm('Update user?')) updateMutation.mutate({ id: u.id, data: { planTier: u.planTier, role: u.role } }) }} className="px-2 py-1 bg-blue-100 border rounded">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}