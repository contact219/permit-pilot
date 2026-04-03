import { useState } from 'react';
import { useLocation } from 'wouter';

export default function Home() {
  const [address, setAddress] = useState('');
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) navigate(`/projects/new?address=${encodeURIComponent(address.trim())}`);
  };

  return (
    <div className="space-y-16">
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Know every permit before you break ground.</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Permit Pilot helps contractors and homeowners identify required permits, pre-fill application forms, and generate compliance checklists.</p>
        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="flex gap-2">
            <input type="text" placeholder="Enter your project address" value={address} onChange={(e) => setAddress(e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">Get Started</button>
          </div>
        </form>
      </section>
      <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[['🔍','Find Permits','AI-powered analysis identifies every permit needed for your project.'],['📝','Pre-fill Forms','Automatically populate permit application forms with your project details.'],['✅','Track Status','Keep track of all permit applications and approval statuses.']].map(([icon, title, desc]) => (
          <div key={title} className="bg-white p-6 rounded-lg shadow"><div className="text-3xl mb-4">{icon}</div><h3 className="text-xl font-semibold mb-2">{title}</h3><p className="text-gray-600">{desc}</p></div>
        ))}
      </section>
      <section className="text-center py-10 bg-blue-50 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">DFW-Focused, Expanding Soon</h2>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">DISCLAIMER: This application provides informational permit guidance only. Always verify requirements directly with your local permitting authority.</p>
      </section>
    </div>
  );
}
