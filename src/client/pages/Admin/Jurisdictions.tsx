import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { get, post, patch, del } from '../../lib/api';

export default function AdminJurisdictions() {
  const queryClient = useQueryClient();
  const { data: jurisdictions, isLoading } = useQuery({ queryKey: ['admin', 'jurisdictions'], queryFn: () => get<any[]>('/api/admin/jurisdictions') });

  const createMutation = useMutation({ mutationFn: (data: any) => post('/api/admin/jurisdictions', data), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'jurisdictions'] }) });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: any }) => patch(`/api/admin/jurisdictions/${id}`, data), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'jurisdictions'] }) });
  const deleteMutation = useMutation({ mutationFn: (id: string) => del(`/api/admin/jurisdictions/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'jurisdictions'] }) });

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Jurisdiction Management</h1>
      <div className="grid gap-4">
        {jurisdictions?.map((j: any) => (
          <div key={j.id} className="border p-4 rounded">
            <h3 className="font-semibold">{j.name}</h3>
            <p className="text-sm text-gray-600">{j.city}, {j.state} | Portal: <a href={j.portalUrl} target="_blank" rel="noreferrer" className="text-blue-600">{j.portalUrl}</a></p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => updateMutation.mutate({ id: j.id, data: { avgReviewDays: j.avgReviewDays + 1 } })} className="px-2 py-1 bg-yellow-100 border rounded">+1 Review Day</button>
              <button onClick={() => deleteMutation.mutate(j.id)} className="px-2 py-1 bg-red-100 border rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => createMutation.mutate({ name: 'New Jurisdiction', state: 'TX', city: 'City', portalUrl: 'https://', submissionMethod: 'online', avgReviewDays: 7 })} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Add Jurisdiction</button>
    </div>
  );
}