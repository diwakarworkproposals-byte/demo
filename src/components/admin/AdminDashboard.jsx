import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  IndianRupee,
  FileSpreadsheet,
  ArrowUpRight,
  UserPlus,
  ShieldCheck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { StatusBadge } from '../common/Badge';

export const AdminDashboard = ({ setCurrentView, setSelectedUserForModal }) => {
  const { users, allInvoices } = useApp();
  const { loginAs } = useAuth();

  // Calculate metrics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const expiredUsers = users.filter((u) => u.status === 'expired').length;
  const expiringSoonUsers = users.filter((u) => u.status === 'expiring_soon').length;

  // Platform total revenue (Plans + 18% GST)
  const totalPlanRevenue = users.reduce((acc, u) => acc + (u.planPrice || 4999), 0);
  const totalRevenueWithGst = totalPlanRevenue * 1.18;

  const totalInvoicesCount = allInvoices.length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Admin Control Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold uppercase">
              Root Admin
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time subscriber management, billing SaaS metrics, and account expiry tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('admin-add-user')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New User</span>
          </button>
        </div>
      </div>

      {/* Material Design Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{totalUsers}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Subscribed businesses</div>
          </div>
        </div>

        {/* Card 2: Active Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Active</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-emerald-700">{activeUsers}</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Valid subscriptions</div>
          </div>
        </div>

        {/* Card 3: Expired Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">Expired</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-rose-700">{expiredUsers}</div>
            <div className="text-[11px] text-rose-600 mt-0.5">Access suspended</div>
          </div>
        </div>

        {/* Card 4: Expiring Soon */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Expiring Soon</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-amber-700">{expiringSoonUsers}</div>
            <div className="text-[11px] text-amber-600 mt-0.5">&le; 15 days left</div>
          </div>
        </div>

        {/* Card 5: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl font-bold text-slate-900">{formatCurrency(totalRevenueWithGst)}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Incl. 18% GST</div>
          </div>
        </div>

        {/* Card 6: Total Invoices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Invoices</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{totalInvoicesCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Generated platform-wide</div>
          </div>
        </div>
      </div>

      {/* Quick Action Alerts if any expired */}
      {expiredUsers > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                {expiredUsers} User Account(s) Have Expired
              </h4>
              <p className="text-xs text-rose-700">
                Billing functionality is locked for these accounts. Review and extend subscriptions.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('admin-expiry')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm self-start sm:self-auto"
          >
            Review Expired Accounts
          </button>
        </div>
      )}

      {/* Recent Users Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Users</h2>
            <p className="text-xs text-slate-500">Registered business tenants and their active plan statuses</p>
          </div>
          <button
            onClick={() => setCurrentView('admin-users')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Users ({totalUsers})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">User Name</th>
                <th className="py-3 px-4 font-semibold">Business Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Phone</th>
                <th className="py-3 px-4 font-semibold">Plan</th>
                <th className="py-3 px-4 font-semibold">Start Date</th>
                <th className="py-3 px-4 font-semibold">Expiry Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.slice(0, 6).map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {user.name.substring(0, 1)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{user.name}</div>
                      <div className="text-[10px] text-slate-400">@{user.username}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {user.businessName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {user.phone}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {formatDate(user.startDate)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-semibold">
                    {formatDate(user.expiryDate)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          loginAs('user', user);
                          setCurrentView('user-dashboard');
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Impersonate & View User Dashboard"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUserForModal(user);
                          setCurrentView('admin-users');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        Manage
                      </button>
                    </div>
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
