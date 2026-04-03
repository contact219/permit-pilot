import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import AdminLayout from './Layout';

export default function AdminScraperLogs() {
  const { data: logs, isLoading } = useQuery({ queryKey: ['admin', 'scraper', 'logs'], queryFn: () => get<any[]>('/api/admin/scraper/logs') });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Scraper Job Logs</h1>
        {isLoading ? <div className="text-slate-300">Loading logs...</div> : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full text-sm">
              <thead className="bg-white/10 text-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left">Source</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Started</th>
                  <th className="px-4 py-2 text-left">Completed</th>
                  <th className="px-4 py-2 text-left">Error</th>
                </tr>
              </thead>
              <tbody>
                {logs?.map((log: any) => (
                  <tr key={log.id} className="border-t border-white/10 text-slate-100">
                    <td className="px-4 py-2">{log.source}</td>
                    <td className="px-4 py-2">
                      <span className={`rounded-full px-2 py-1 text-xs ${log.status === 'completed' ? 'bg-emerald-400/20 text-emerald-200' : log.status === 'failed' ? 'bg-rose-400/20 text-rose-200' : 'bg-amber-400/20 text-amber-200'}`}>{log.status}</span>
                    </td>
                    <td className="px-4 py-2 text-xs">{log.startedAt ? new Date(log.startedAt).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2 text-xs">{log.completedAt ? new Date(log.completedAt).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2 text-xs text-rose-200">{log.error || '-'}</td>
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
