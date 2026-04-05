import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { get, post, del } from '../../lib/api';
import AdminLayout from './Layout';

const PLANS = ['free', 'contractor', 'agency'];
const ROLES = ['contractor', 'admin'];

const PLAN_COLORS: Record<string, string> = {
  free: 'bg-slate-700 text-slate-200',
  contractor: 'bg-cyan-400/20 text-cyan-200',
  agency: 'bg-emerald-400/20 text-emerald-200',
};

async function patchUser(id: string, data: any) {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: 'PATCH', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'contractor', companyName: '', planTier: 'free' });
  const [addError, setAddError] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [search, setSearch] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => get<any[]>('/api/admin/users'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => patchUser(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }); setEditingId(null); },
  });

  const createMutation = useMutation({
    mutationFn: () => post<any>('/api/admin/users', newUser),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setShowAdd(false);
      setNewUser({ email: '', password: '', role: 'contractor', companyName: '', planTier: 'free' });
      if (data.tempPassword) setTempPassword(data.tempPassword);
      setAddError('');
    },
    onError: (e: any) => setAddError(e.message || 'Failed to create user'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del(`/api/admin/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });

  const filtered = users?.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.companyName || '').toLowerCase().includes(search.toLowerCase())
  ) || [];

  const startEdit = (u: any) => {
    setEditingId(u.id);
    setEditData({ role: u.role, planTier: u.planTier, companyName: u.companyName || '', emailVerified: u.emailVerified, password: '' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <button onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 text-sm">
            + Add User
          </button>
        </div>

        {/* Temp password display */}
        {tempPassword && (
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4">
            <p className="text-sm font-medium text-emerald-200 mb-1">User created! Temporary password:</p>
            <code className="text-emerald-300 font-mono text-lg">{tempPassword}</code>
            <p className="text-xs text-slate-400 mt-1">Share this with the user — it won't be shown again.</p>
            <button onClick={() => setTempPassword('')} className="mt-2 text-xs text-slate-400 hover:text-white">Dismiss</button>
          </div>
        )}

        {/* Add User Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Add New User</h2>
                <button onClick={() => { setShowAdd(false); setAddError(''); }} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
              </div>
              {addError && <div className="rounded-lg bg-rose-500/10 border border-rose-400/30 p-3 text-sm text-rose-200">{addError}</div>}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email *</label>
                  <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Password (leave blank to auto-generate)</label>
                  <input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Auto-generate if empty"
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
                  <input type="text" value={newUser.companyName} onChange={e => setNewUser({...newUser, companyName: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                    <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white focus:outline-none">
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Plan</label>
                    <select value={newUser.planTier} onChange={e => setNewUser({...newUser, planTier: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white focus:outline-none">
                      {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !newUser.email}
                  className="flex-1 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 disabled:opacity-50">
                  {createMutation.isPending ? 'Creating...' : 'Create User'}
                </button>
                <button onClick={() => { setShowAdd(false); setAddError(''); }}
                  className="px-4 py-2 rounded-lg bg-white/10 text-slate-300 hover:bg-white/20">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit User</h2>
                <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
                  <input type="text" value={editData.companyName} onChange={e => setEditData({...editData, companyName: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                    <select value={editData.role} onChange={e => setEditData({...editData, role: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white focus:outline-none">
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Plan</label>
                    <select value={editData.planTier} onChange={e => setEditData({...editData, planTier: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white focus:outline-none">
                      {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">New Password (leave blank to keep current)</label>
                  <input type="password" value={editData.password} onChange={e => setEditData({...editData, password: e.target.value})}
                    placeholder="Leave blank to keep current"
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editData.emailVerified} onChange={e => setEditData({...editData, emailVerified: e.target.checked})} className="rounded" />
                  <span className="text-sm text-slate-300">Email verified</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => updateMutation.mutate({ id: editingId, data: editData })}
                  disabled={updateMutation.isPending}
                  className="flex-1 py-2 rounded-lg bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 disabled:opacity-50">
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setEditingId(null)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-slate-300 hover:bg-white/20">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by email or company..."
          className="w-full px-4 py-2 rounded-lg border border-white/10 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Users', value: users?.length || 0 },
            { label: 'Paid', value: users?.filter(u => u.planTier !== 'free').length || 0 },
            { label: 'Verified', value: users?.filter(u => u.emailVerified).length || 0 },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}</div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-white/10 text-slate-300 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Plan</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((u: any) => (
                  <tr key={u.id} className="text-slate-200 hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium">{u.email}</p>
                      {u.companyName && <p className="text-xs text-slate-400">{u.companyName}</p>}
                      <p className="text-xs text-slate-500">{u.id.substring(0, 8)}...</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (PLAN_COLORS[u.planTier] || PLAN_COLORS.free)}>
                        {u.planTier || 'free'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={'px-2 py-1 rounded-full text-xs ' + (u.role === 'admin' ? 'bg-violet-500/20 text-violet-200' : 'bg-white/10 text-slate-300')}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.emailVerified
                        ? <span className="text-emerald-400 text-xs">✓ Verified</span>
                        : <span className="text-amber-400 text-xs">⚠ Unverified</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(u)}
                          className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 text-xs hover:bg-white/20">
                          ✏️ Edit
                        </button>
                        <button onClick={() => { if (confirm(`Delete ${u.email}? This cannot be undone.`)) deleteMutation.mutate(u.id); }}
                          className="px-3 py-1 rounded-lg bg-rose-500/15 text-rose-300 text-xs hover:bg-rose-500/25">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm">No users found</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
