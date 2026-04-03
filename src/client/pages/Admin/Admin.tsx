import { useLocation } from 'wouter';
import AdminLayout from './Layout';

export default function Admin() {
  const [, navigate] = useLocation();
  const sections = [
    { title: 'Jurisdictions', href: '/admin/jurisdictions', description: 'Manage jurisdictions and permit types' },
    { title: 'Users', href: '/admin/users', description: 'Manage user roles and plan tiers' },
    { title: 'Scraper', href: '/admin/scraper/run', description: 'Run and monitor scraper jobs' },
    { title: 'Scraper Logs', href: '/admin/scraper/logs', description: 'View scraper job history' },
  ];
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((s) => (
            <div key={s.href} className="border rounded-lg p-6 hover:shadow-lg cursor-pointer" onClick={() => navigate(s.href)}>
              <h2 className="text-xl font-semibold mb-2">{s.title}</h2>
              <p className="text-gray-600">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
