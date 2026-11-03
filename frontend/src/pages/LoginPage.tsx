import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setCredentials } from '../features/auth/authSlice';
import { useLoginMutation } from '../services/apiSlice';
import { PortalLogo } from '../components/PortalLogo';
import { Lock, Mail, ShieldCheck, GraduationCap, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      if (res.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err: any) {
      setErrorMessage(err?.data?.detail || 'Invalid email or password. Please try again.');
    }
  };

  const fillCredentials = async (role: 'STUDENT' | 'ADMIN') => {
    const creds =
      role === 'STUDENT'
        ? { email: 'akif.24sp028@student.uitu.edu.pk', password: 'Akif@123' }
        : { email: 'admin@uit.edu', password: 'Admin@123' };

    setEmail(creds.email);
    setPassword(creds.password);
    setErrorMessage('');

    try {
      const res = await login(creds).unwrap();
      dispatch(setCredentials(res));
      navigate(role === 'ADMIN' ? '/admin' : '/student');
    } catch (err: any) {
      setErrorMessage(err?.data?.detail || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c2f5a] via-[#104179] to-[#082245] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-8 text-center text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-xl"></div>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg p-2">
            <PortalLogo alt="UIT Logo" className="h-full w-full object-contain" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">UIT UNIVERSITY</h2>
          <p className="text-xs text-blue-100 font-medium tracking-wide mt-1">
            eDU SMARTZ Academic Portal • Version 3
          </p>
          <div className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-blue-50 border border-white/20">
            RBAC Architecture (ADMIN & STUDENT Only)
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Institutional Email / Roll No
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. akif.24sp028@student.uitu.edu.pk"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secret password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-800 transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              Instant 1-Click Role Login
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillCredentials('STUDENT')}
                disabled={isLoading}
                className="flex flex-col items-center justify-center rounded-xl border border-blue-200 bg-blue-50/60 p-2.5 text-center transition-all hover:bg-blue-100/70 hover:border-blue-300 group"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white mb-1 shadow-xs group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-blue-900">Muhammad Akif</span>
                <span className="text-[10px] text-blue-600 font-medium">24SP-028-SE</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('ADMIN')}
                disabled={isLoading}
                className="flex flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50/60 p-2.5 text-center transition-all hover:bg-amber-100/70 hover:border-amber-300 group"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600 text-white mb-1 shadow-xs group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-amber-950">Portal Admin</span>
                <span className="text-[10px] text-amber-700 font-medium">Full Access</span>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-[10px] text-slate-400">
            Protected by JWT & Bcrypt encryption. Strictly limited to ADMIN & STUDENT roles.
          </div>
        </div>
      </div>
    </div>
  );
};
