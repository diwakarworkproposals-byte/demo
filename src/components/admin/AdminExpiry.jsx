import React from 'react';
import {
  Clock,
  AlertTriangle,
  UserX,
  RotateCw,
  Calendar,
  CheckCircle2,
  Building,
  Mail,
  Phone,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate, calculateDaysRemaining } from '../../utils/helpers';
import { StatusBadge } from '../common/Badge';

export const AdminExpiry = () => {
  const { users, extendSubscription } = useApp();

  const expiredUsers = users.filter((u) => u.status === 'expired');
  const expiringSoonUsers = users.filter((u) => u.status === 'expiring_soon');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Clock className="w-6 h-6 text-amber-500" />
          <span>Account Expiry & Renewal Queue</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor accounts requiring immediate attention. One-click renew 6M or 12M plans to restore billing access.
        </p>
      </div>

      {/* Overview status pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mat-shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase text-rose-700">Currently Expired</div>
            <div className="text-3xl font-extrabold text-rose-800 mt-1">{expiredUsers.length} Users</div>
            <div className="text-xs text-rose-600 mt-0.5">Billing suspended until renewal</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mat-shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase text-amber-700">Expiring in &le; 15 Days</div>
            <div className="text-3xl font-extrabold text-amber-800 mt-1">{expiringSoonUsers.length} Users</div>
            <div className="text-xs text-amber-600 mt-0.5">Send reminder / follow up</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SECTION 1: EXPIRED ACCOUNTS */}
      <div className="bg-white rounded-2xl border border-rose-200 mat-shadow-sm overflow-hidden">
        <div className="p-4 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h2 className="font-bold text-slate-900 text-sm">Expired User Accounts ({expiredUsers.length})</h2>
          </div>
          <span className="text-xs text-rose-700 font-semibold">Immediate Action Needed</span>
        </div>

        {expiredUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            Great news! No accounts are currently expired.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {expiredUsers.map((user) => {
              const daysAgo = Math.abs(calculateDaysRemaining(user.expiryDate));

              return (
                <div key={user.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{user.businessName}</span>
                      <StatusBadge status="expired" />
                      <span className="text-xs text-rose-600 font-medium">Expired {daysAgo} days ago</span>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-4">
                      <span>Owner: <strong>{user.name}</strong> (@{user.username})</span>
                      <span>Email: {user.email}</span>
                      <span>Phone: {user.phone}</span>
                      <span>Plan: {user.plan}</span>
                      <span>Expired on: {formatDate(user.expiryDate)}</span>
                    </div>
                  </div>

                  {/* Quick Extension Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => extendSubscription(user.id, 6, '6 Months')}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Renew 6M (+₹4,999)</span>
                    </button>
                    <button
                      onClick={() => extendSubscription(user.id, 12, '12 Months')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Renew 1 Year (+₹7,999)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: EXPIRING SOON */}
      <div className="bg-white rounded-2xl border border-amber-200 mat-shadow-sm overflow-hidden">
        <div className="p-4 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-slate-900 text-sm">Accounts Expiring Soon ({expiringSoonUsers.length})</h2>
          </div>
          <span className="text-xs text-amber-700 font-semibold">&le; 15 Days Validity</span>
        </div>

        {expiringSoonUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No accounts expiring in the next 15 days.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {expiringSoonUsers.map((user) => {
              const daysLeft = calculateDaysRemaining(user.expiryDate);

              return (
                <div key={user.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{user.businessName}</span>
                      <StatusBadge status="expiring_soon" />
                      <span className="text-xs text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded">
                        {daysLeft} days remaining
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-4">
                      <span>Owner: <strong>{user.name}</strong> (@{user.username})</span>
                      <span>Phone: {user.phone}</span>
                      <span>Current Plan: {user.plan}</span>
                      <span>Expires on: {formatDate(user.expiryDate)}</span>
                    </div>
                  </div>

                  {/* Extension Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => extendSubscription(user.id, 6, '6 Months')}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200 transition-colors"
                    >
                      Extend 6 Months
                    </button>
                    <button
                      onClick={() => extendSubscription(user.id, 12, '12 Months')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                    >
                      Extend 12 Months
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
