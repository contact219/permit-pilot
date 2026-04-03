import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '../../lib/api';
import AdminLayout from './Layout';

export default function AdminScraperRun() {
  const queryClient = useQueryClient();

  const runMutation = useMutation({
    mutationFn: (source: string) => post('/api/admin/scraper/run', { source }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'scraper', 'logs'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'scraper', 'stats'] });
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Run Scraper Jobs</h1>
        <p className="text-slate-300">Trigger manual scraping for all active jurisdictions. Jobs are recorded in the scraper logs table.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => runMutation.mutate('all')} className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950 hover:bg-cyan-400">Run All Sources</button>
          <button onClick={() => runMutation.mutate('municode')} className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950 hover:bg-emerald-400">Municode</button>
          <button onClick={() => runMutation.mutate('socrata')} className="rounded-lg bg-violet-500 px-4 py-2 font-medium text-white hover:bg-violet-400">Socrata</button>
          <button onClick={() => runMutation.mutate('city-portals')} className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-950 hover:bg-amber-400">City Portals</button>
        </div>
        {runMutation.isPending && <p className="text-cyan-200">Job started...</p>}
        {runMutation.isSuccess && <p className="text-emerald-200">Job created successfully.</p>}
        {runMutation.isError && <p className="text-rose-200">Error: {(runMutation.error as Error).message}</p>}
      </div>
    </AdminLayout>
  );
}
