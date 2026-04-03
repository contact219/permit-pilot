import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post } from '../../lib/api';

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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Run Scraper</h1>
      <div className="space-y-4">
        <p className="text-gray-600">Trigger manual scraping jobs for all jurisdictions. Results will appear in the logs.</p>
        <div className="flex gap-4">
          <button onClick={() => runMutation.mutate('all')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Run All Sources
          </button>
          <button onClick={() => runMutation.mutate('municode')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Run Municode Only
          </button>
          <button onClick={() => runMutation.mutate('socrata')} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Run Socrata Only
          </button>
          <button onClick={() => runMutation.mutate('city-portals')} className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
            Run City Portals Only
          </button>
        </div>
        {runMutation.isPending && <p className="text-blue-600">Job started...</p>}
        {runMutation.isSuccess && <p className="text-green-600">Job created successfully!</p>}
        {runMutation.isError && <p className="text-red-600">Error: {(runMutation.error as Error).message}</p>}
      </div>
    </div>
  );
}