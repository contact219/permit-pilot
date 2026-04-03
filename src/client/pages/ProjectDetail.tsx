import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { get, post, del } from '../lib/api';
import StatusBadge from '../components/StatusBadge';
import ChecklistExport from '../components/ChecklistExport';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({ queryKey: ['project', id], queryFn: () => get<any>(`/api/projects/${id}`), enabled: !!id });
  const reanalyzeMutation = useMutation({ mutationFn: () => post<any>(`/api/projects/${id}/analyze`, {}), onSuccess: (d: any) => queryClient.setQueryData(['project', id], (old: any) => ({ ...old, analysis: d.analysis })) });
  const deleteMutation = useMutation({ mutationFn: () => del(`/api/projects/${id}`), onSuccess: () => navigate('/dashboard') });

  if (isLoading) return <div className="p-8">Loading project...</div>;
  if (error || !data) return <div className="p-8 text-red-600">Project not found</div>;

  const { project, jurisdiction, permits } = data as any;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.address}</p>
          <p className="text-sm text-gray-500">Jurisdiction: {jurisdiction?.name || 'Unknown'}</p>
        </div>
        <div className="flex gap-2">
          <ChecklistExport projectId={project.id} />
          <button onClick={() => reanalyzeMutation.mutate()} disabled={reanalyzeMutation.isPending} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {reanalyzeMutation.isPending ? 'Analyzing...' : 'Re-run Analysis'}
          </button>
          <button onClick={() => deleteMutation.mutate()} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">AI Analysis Summary</h2>
        <p className="text-gray-800 whitespace-pre-wrap">{project.aiSummary || 'No summary available'}</p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Required Permits</h2>
        {permits?.length > 0 ? permits.map((item: any) => (
          <div key={item.pp.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div><h3 className="text-lg font-semibold">{item.pt?.name}</h3><p className="text-sm text-gray-500">Code: {item.pt?.code}</p></div>
              <StatusBadge status={item.pp.status} />
            </div>
            <p className="text-gray-700 mb-4">{item.pp.notes}</p>
            {item.pt?.feeBase && <p className="text-sm text-gray-600"><strong>Fee:</strong> ${item.pt.feeBase} base{item.pt.feePerSqft ? ` + $${item.pt.feePerSqft}/sqft` : ''}</p>}
          </div>
        )) : <p className="text-gray-600">No permits identified yet.</p>}
      </div>
    </div>
  );
}
