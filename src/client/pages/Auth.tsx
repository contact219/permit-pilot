import { useState } from 'react';
import { useLocation } from 'wouter';
import { post } from '../lib/api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { email, password } : { email, password, role: 'contractor', companyName };
      await post<any>(endpoint, body);
      navigate('/dashboard');
    } catch (err: any) { setError(err.message || 'Authentication failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">{isLogin ? 'Sign In' : 'Create Account'}</h2>
        {error && <div className="mb-4 p-3 bg-rose-500/10 text-rose-100 border border-rose-300/30 rounded text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-white/20 bg-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-white/20 bg-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Company Name (optional)</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-3 py-2 border border-white/20 bg-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-cyan-500 text-slate-950 rounded-lg font-semibold hover:bg-cyan-400 disabled:opacity-50">
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-cyan-300 hover:underline text-sm">
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        {isLogin && (
          <div className="mt-2 text-center">
            <a href="/forgot-password" className="text-sm text-gray-500 hover:text-blue-600">Forgot password?</a>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
