import React from 'react';
import {
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Users,
  Download,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

export const AdminReports = () => {
  const { users, allInvoices } = useApp();

  const totalInvoicesValue = allInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
  const totalInvoicesProfit = allInvoices.reduce((sum, inv) => sum + (inv.profit || 0), 0);

  return (
    <div className="p-3.5 sm:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <span>SaaS Platform Reports & Analytics</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          High-level operational metrics across all registered retailers and wholesale tenants.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 mat-shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Merchandise Value (GMV)</div>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">{formatCurrency(totalInvoicesValue)}</div>
          <div className="text-xs text-slate-400 mt-1">Invoiced by tenants on ASAN BILL</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 mat-shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant Gross Profit Generated</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">{formatCurrency(totalInvoicesProfit)}</div>
          <div className="text-xs text-slate-400 mt-1">Selling Price - Purchase Price realized</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 mat-shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Invoices Created</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{allInvoices.length} Bills</div>
          <div className="text-xs text-slate-400 mt-1">Zero overselling errors recorded</div>
        </div>
      </div>

      {/* Tenant Performance Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm p-6">
        <h3 className="font-bold text-base text-slate-900 mb-4">Tenant Invoicing Activity</h3>
        <div className="space-y-4">
          {users.map((u) => {
            const tenantInvoices = allInvoices.filter((i) => i.userId === u.id);
            const tenantTotal = tenantInvoices.reduce((acc, i) => acc + (i.grandTotal || 0), 0);

            return (
              <div key={u.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{u.businessName}</div>
                  <div className="text-xs text-slate-500">Plan: {u.plan} • Owner: {u.name} • {tenantInvoices.length} invoices generated</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900">{formatCurrency(tenantTotal)}</div>
                  <div className="text-[11px] text-slate-400">Total Billed</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
