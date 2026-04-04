import { useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { post } from '../lib/api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, navigate] = useLocation();
  const search = useSearch();
  const token = new URLSearchParams(search).get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true); setError('');
    try { await post('/api/auth/reset-password', { token, password }); setDone(true); }
    catch (err: any) { setError('Invalid or expired reset link.'); }
    finally { setLoading(false); }
  };

  if (!token) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-md w-full text-center">
        <div className="text-5xl mb-4">❌</div><h2 className="text-2xl font-bold mb-4">Invalid Reset Link</h2>
        <button onClick={() => navigate('/forgot-password')} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Request New Link</button>
      </div>
    </div>
  );

  if (done) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-md w-full text-center">
        <div className="text-5xl mb-4">✅</div><h2 className="text-2xl font-bold text-green-600 mb-2">Password Reset!</h2>
        <p className="text-gray-600 mb-6">Your password has been updated.</p>
        <button onClick={() => navigate('/auth')} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go to Login</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Set new password</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="At least 8 characters" /></div>
          <div><label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{loading ? 'Resetting...' : 'Reset Password'}</button>
        </form>
      </div>
    </div>
  );
}
