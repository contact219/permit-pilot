import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const { data: userData, isLoading } = useQuery({ queryKey: ['user'], queryFn: () => get<any>('/api/auth/me') });
  const user = userData?.user;

  useEffect(() => { if (!isLoading && (!user || user.role !== 'admin')) navigate('/auth'); }, [user, isLoading, navigate]);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!user || user.role !== 'admin') return null;

  const navItems = [
    { label: 'Jurisdictions', href: '/admin/jurisdictions' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Scraper Logs', href: '/admin/scraper/logs' },
    { label: 'Scraper Run', href: '/admin/scraper/run' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <button key={item.href} onClick={() => navigate(item.href)}
                className={`w-full text-left px-4 py-2 rounded ${location === item.href ? 'bg-gray-800' : 'hover:bg-gray-800'}`}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
