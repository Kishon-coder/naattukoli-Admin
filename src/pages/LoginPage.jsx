import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #1c1710 0%, #372d1d 50%, #5c2200 100%)' }}>

      {/* Decorative */}
      <div className="absolute top-1/4 left-10 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-brand-700/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center font-display font-bold text-3xl text-white mx-auto mb-4 shadow-lg shadow-brand-500/30">
              N
            </div>
            <h1 className="font-display text-3xl font-bold text-white">Admin Login</h1>
            <p className="text-earth-400 mt-1 text-sm">Naattukoli Management Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-earth-300 text-xs uppercase tracking-wider block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="admin@naattukoli.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-earth-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="text-earth-300 text-xs uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-earth-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-200 text-xs font-semibold uppercase tracking-wider">
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3.5 rounded-xl font-bold text-base transition-all disabled:opacity-60 shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
                  </svg>
                  Logging in...
                </span>
              ) : '🔓 Login to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
