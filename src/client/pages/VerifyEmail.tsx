import { useEffect, useState } from 'react';
import { useLocation, useSearch } from 'wouter';

export default function VerifyEmail() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [, navigate] = useLocation();
  const search = useSearch();
  const token = new URLSearchParams(search).get('token');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('Invalid verification link.'); return; }
    fetch(`/api/auth/verify-email?token=${token}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.ok) { setStatus('success'); setMessage(data.message || 'Email verified!'); setTimeout(() => navigate('/dashboard'), 3000); }
        else { setStatus('error'); setMessage(data.error || 'Verification failed.'); }
      })
      .catch(() => { setStatus('error'); setMessage('Verification failed. Please try again.'); });
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow max-w-md w-full text-center">
        {status === 'loading' && (<><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" /><h2 className="text-xl font-semibold">Verifying your email...</h2></>)}
        {status === 'success' && (<><div className="text-5xl mb-4">✅</div><h2 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h2><p className="text-gray-600">{message}</p><p className="text-sm text-gray-500 mt-4">Redirecting to dashboard...</p></>)}
        {status === 'error' && (<><div className="text-5xl mb-4">❌</div><h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2><p className="text-gray-600 mb-6">{message}</p><button onClick={() => navigate('/auth')} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Back to Login</button></>)}
      </div>
    </div>
  );
}
