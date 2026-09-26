import React from 'react';
import {
  CreditCard,
  TrendingUp,
  Award,
  CheckCircle,
  IndianRupee,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../../data/initialData';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { StatusBadge } from '../common/Badge';

export const AdminSubscriptions = () => {
  const { users, extendSubscription } = useApp();

  const count6M = users.filter((u) => u.plan === '6 Months').length;
  const count12M = users.filter((u) => u.plan === '12 Months').length;

  const revenue6M = count6M * 4999;
  const revenue12M = count12M * 7999;
  const totalBase = revenue6M + revenue12M;
  const totalGst = totalBase * 0.18;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <span>Subscription Management</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor plan distribution, SaaS revenue generation, and subscriber billing cycles.
        </p>
      </div>

      {/* Plans comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                6 Month Plan
              </span>
              <span className="text-sm font-bold text-slate-500">{count6M} Active Subscriptions</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-4">₹4,999 <span className="text-xs text-rose-500 font-semibold">+ 18% GST</span></div>
            <div className="text-xs text-slate-500 mt-1">Total revenue generated: <strong className="text-slate-800">{formatCurrency(revenue6M * 1.18)}</strong></div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Standard Stock & Billing Module</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Single User Retailer License</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-blue-600 mat-shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
            Most Popular
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                Year Long Plan (12M)
              </span>
              <span className="text-sm font-bold text-slate-500">{count12M} Active Subscriptions</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-4">₹7,999 <span className="text-xs text-rose-500 font-semibold">+ 18% GST</span></div>
            <div className="text-xs text-slate-500 mt-1">Total revenue generated: <strong className="text-slate-800">{formatCurrency(revenue12M * 1.18)}</strong></div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Full Annual Validity with Free Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Priority WhatsApp & Dedicated Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown Card */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl mat-shadow-md">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Financial SaaS Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="text-xs text-slate-400">Total Base Billing</div>
            <div className="text-2xl font-bold text-white mt-1">{formatCurrency(totalBase)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Government GST Collected (18%)</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{formatCurrency(totalGst)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Gross Realized Subscription Inflow</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(totalBase + totalGst)}</div>
          </div>
        </div>
      </div>

      {/* Subscription List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">All Subscriptions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Plan Name</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{u.businessName}</td>
                  <td className="py-3 px-4">{u.plan}</td>
                  <td className="py-3 px-4 font-mono font-medium">₹{u.planPrice || 4999} + GST</td>
                  <td className="py-3 px-4 text-slate-500">{formatDate(u.startDate)}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{formatDate(u.expiryDate)}</td>
                  <td className="py-3 px-4"><StatusBadge status={u.status} /></td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => extendSubscription(u.id, 6, '6 Months')}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      + 6 Months
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
