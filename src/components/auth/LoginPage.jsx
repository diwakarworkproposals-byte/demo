import React, { useState } from 'react';
import {
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const LoginPage = ({ setCurrentView }) => {
  const { login } = useAuth();
  const { users } = useApp();

  const [identifier, setIdentifier] = useState('rajesh');
  const [password, setPassword] = useState('user123');
  const [errorMsg, setErrorMsg] = useState('');
  const [expiredNotice, setExpiredNotice] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setExpiredNotice(false);

    const result = login(identifier, password, users);

    if (!result.success) {
      setErrorMsg(result.message || 'Invalid username or password.');
      return;
    }

    if (result.role === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      // User role
      if (result.isExpired) {
        setExpiredNotice(true);
        // Let them see their dashboard with the lock notice or prompt
        setTimeout(() => {
          setCurrentView('user-dashboard');
        }, 1200);
      } else {
        setCurrentView('user-dashboard');
      }
    }
  };

  const fillCredentials = (userType) => {
    setErrorMsg('');
    setExpiredNotice(false);
    if (userType === 'admin') {
      setIdentifier('admin');
      setPassword('admin123');
    } else if (userType === 'active') {
      setIdentifier('rajesh');
      setPassword('user123');
    } else if (userType === 'soon') {
      setIdentifier('vikram');
      setPassword('user123');
    } else if (userType === 'expired') {
      setIdentifier('sunil');
      setPassword('user123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-4">
            <span className="font-bold text-2xl tracking-tight">AB</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Sign In to ASAN BILL
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Stock Management & GST Billing SaaS
          </p>
        </div>

        {/* Quick Demo Autofill Panel */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 mat-shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Click to Autofill Demo Credentials:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="p-2 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-800 text-left transition-colors"
            >
              <div className="font-bold">👑 Admin</div>
              <div className="text-[10px] text-blue-600">admin / admin123</div>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('active')}
              className="p-2 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800 text-left transition-colors"
            >
              <div className="font-bold">🟢 Active User</div>
              <div className="text-[10px] text-emerald-600">rajesh / user123</div>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('soon')}
              className="p-2 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-amber-800 text-left transition-colors"
            >
              <div className="font-bold">🟡 Expiring Soon</div>
              <div className="text-[10px] text-amber-600">vikram / user123</div>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('expired')}
              className="p-2 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100/70 text-rose-800 text-left transition-colors"
            >
              <div className="font-bold">🔴 Expired User</div>
              <div className="text-[10px] text-rose-600">sunil / user123</div>
            </button>
          </div>
        </div>

        {/* Expired Subscription Notice Banner */}
        {expiredNotice && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 text-rose-800 text-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Subscription Expired</strong>
                <p className="mt-1 text-xs text-rose-700 leading-relaxed">
                  Your ASAN BILL account has expired. Please contact the administrator to renew your subscription.
                </p>
                <p className="text-[11px] text-rose-500 mt-2">Redirecting to view-only dashboard...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 mat-shadow-1 border border-slate-200">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username / Email
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter username or business email"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                Remember me
              </label>
              <span className="text-slate-400">Secured via RBAC</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Need a new business account? Contact the System Administrator or view subscription plans on the home page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
