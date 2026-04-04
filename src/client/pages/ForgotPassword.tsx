import { useState } from 'react';
import { useLocation } from 'wouter';
import { post } from '../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await post('/api/auth/forgot-password', { email }); setSent(true); }
    catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  if (sent) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-md w-full text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-2xl font-bold mb-2">Check your email</h2>
        <p className="text-gray-600 mb-6">If an account exists for <strong>{email}</strong>, we sent a password reset link.</p>
        <button onClick={() => navigate('/auth')} className="text-blue-600 hover:underline text-sm">Back to login</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2">Forgot your password?</h2>
        <p className="text-gray-600 mb-6 text-sm">Enter your email and we'll send you a reset link.</p>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{loading ? 'Sending...' : 'Send Reset Link'}</button>
        </form>
        <div className="mt-4 text-center"><button onClick={() => navigate('/auth')} className="text-blue-600 hover:underline text-sm">Back to login</button></div>
      </div>
    </div>
  );
}
