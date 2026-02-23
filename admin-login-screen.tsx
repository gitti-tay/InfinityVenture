import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

export function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // If already authenticated as admin, redirect
  if (isAuthenticated && user && ['admin', 'superadmin'].includes((user as any).role)) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleLogin = async () => {
    if (!email || !password) { setError('Email and password required'); return; }
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      // Check if admin after login — need to re-read user from localStorage
      const stored = localStorage.getItem('iv_user');
      if (stored) {
        const userData = JSON.parse(stored);
        if (['admin', 'superadmin'].includes(userData.role)) {
          navigate('/admin', { replace: true });
        } else {
          setError('Access denied. Admin account required.');
        }
      }
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">♾ IV Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Management Console Login</p>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm text-slate-400 block mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@infinityventures.com"
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          <button onClick={handleLogin} disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p className="text-center text-slate-600 text-xs mt-4">
          <a href="/" className="hover:text-slate-400">← Back to main site</a>
        </p>
      </div>
    </div>
  );
}
