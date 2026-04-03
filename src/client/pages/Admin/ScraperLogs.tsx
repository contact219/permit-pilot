import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';

export default function AdminScraperLogs() {
  const { data: logs, isLoading } = useQuery({ queryKey: ['admin', 'scraper', 'logs'], queryFn: () => get<any[]>('/api/admin/scraper/logs') });

  if (isLoading) return <div className="p-8">Loading logs...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Scraper Job Logs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Source</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Started</th>
              <th className="border px-4 py-2">Completed</th>
              <th className="border px-4 py-2">Error</th>
            </tr>
          </thead>
          <tbody>
            {logs?.map((log: any) => (
              <tr key={log.id}>
                <td className="border px-4 py-2 text-sm">{log.id.substring(0, 8)}...</td>
                <td className="border px-4 py-2">{log.source}</td>
                <td className="border px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${log.status === 'completed' ? 'bg-green-100 text-green-800' : log.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{log.status}</span>
                </td>
                <td className="border px-4 py-2 text-sm">{new Date(log.startedAt).toLocaleString()}</td>
                <td className="border px-4 py-2 text-sm">{log.completedAt ? new Date(log.completedAt).toLocaleString() : '-'}</td>
                <td className="border px-4 py-2 text-sm text-red-600">{log.error || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}