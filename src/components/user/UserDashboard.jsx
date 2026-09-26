import React from 'react';
import {
  TrendingUp,
  Package,
  Users,
  FileSpreadsheet,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  FilePlus,
  ShoppingCart,
  Download,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { StatusBadge } from '../common/Badge';

export const UserDashboard = ({ setCurrentView, setSelectedInvoiceForPreview }) => {
  const { currentUser, isExpired, isExpiringSoon, daysRemaining } = useAuth();
  const { products, customers, invoices, purchases } = useApp();

  // Today's date string: "2026-09-26"
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate Today's Sales & Profit
  const todayInvoices = invoices.filter((inv) => inv.invoiceDate === todayStr);
  const todaySales = todayInvoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
  const todayProfit = todayInvoices.reduce((sum, inv) => sum + (inv.profit || 0), 0);

  // Total products & low stock items
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.currentStock <= p.minStockLevel);

  // Total customers & invoices
  const totalCustomers = customers.length;
  const totalInvoices = invoices.length;

  return (
    <div className="p-3.5 sm:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Account Expiry Alert Banner if Expired */}
      {isExpired && (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-5 mat-shadow-sm animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-900">
                Your ASAN BILL account has expired. Please contact the administrator to renew your subscription.
              </h3>
              <p className="text-xs text-rose-700 mt-1">
                Your subscription expired on <strong>{formatDate(currentUser?.expiryDate)}</strong>. Billing and invoice creation are temporarily disabled until renewal. Your previous records remain safely accessible.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Account Expiring Soon Banner */}
      {isExpiringSoon && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                Subscription Expiring Soon ({daysRemaining} days remaining)
              </span>
              <p className="text-xs text-amber-700">
                Your {currentUser?.plan} plan will expire on {formatDate(currentUser?.expiryDate)}. Please reach out to your administrator to renew uninterrupted.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{currentUser?.businessName || 'Business Dashboard'}</span>
            <StatusBadge status={currentUser?.status} />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <strong>{currentUser?.name}</strong>. Here is your daily stock and sales summary.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentView('user-purchases')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <ShoppingCart className="w-4 h-4 text-slate-500" />
            <span>Record Purchase</span>
          </button>

          <button
            disabled={isExpired}
            onClick={() => {
              if (!isExpired) setCurrentView('user-create-invoice');
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all ${
              isExpired
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:shadow'
            }`}
            title={isExpired ? 'Account expired. Contact admin to renew.' : 'Create Invoice'}
          >
            <FilePlus className="w-4 h-4" />
            <span>+ Create Invoice</span>
          </button>
        </div>
      </div>

      {/* 6 Material Design Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Today's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Today's Sales</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl font-bold text-slate-900">{formatCurrency(todaySales)}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{todayInvoices.length} bill(s) today</div>
          </div>
        </div>

        {/* 2. Today's Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Today's Profit</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="font-bold text-sm">₹</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl font-bold text-emerald-700">{formatCurrency(todayProfit)}</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Selling - Purchase price</div>
          </div>
        </div>

        {/* 3. Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Products</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{totalProducts}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Active SKU items</div>
          </div>
        </div>

        {/* 4. Low Stock */}
        <div className={`p-5 rounded-2xl border mat-shadow-sm flex flex-col justify-between ${
          lowStockProducts.length > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              lowStockProducts.length > 0 ? 'text-amber-800' : 'text-slate-500'
            }`}>
              Low Stock
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              lowStockProducts.length > 0 ? 'bg-amber-200 text-amber-800' : 'bg-slate-100 text-slate-600'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className={`text-2xl font-bold ${lowStockProducts.length > 0 ? 'text-amber-800' : 'text-slate-900'}`}>
              {lowStockProducts.length}
            </div>
            <div className={`text-[11px] mt-0.5 ${lowStockProducts.length > 0 ? 'text-amber-700 font-semibold' : 'text-slate-400'}`}>
              {lowStockProducts.length > 0 ? 'Needs re-ordering' : 'Stock levels optimal'}
            </div>
          </div>
        </div>

        {/* 5. Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Customers</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{totalCustomers}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">B2B & Retail Clients</div>
          </div>
        </div>

        {/* 6. Total Invoices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Invoices</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-900">{totalInvoices}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">All-time bills generated</div>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Section if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 mat-shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm text-amber-900">
                Low Stock Alert ({lowStockProducts.length} items reached minimum stock level)
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('user-products')}
              className="text-xs font-semibold text-amber-800 hover:underline"
            >
              View All Products
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 truncate max-w-[180px]">{p.name}</div>
                  <div className="text-slate-500 text-[11px]">
                    Current Stock: <strong className="text-rose-600 font-bold">{p.currentStock} {p.unit}</strong> (Min: {p.minStockLevel})
                  </div>
                </div>
                <button
                  onClick={() => setCurrentView('user-purchases')}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-[11px]"
                >
                  + Stock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Invoices</h2>
            <p className="text-xs text-slate-500">Latest generated bills with calculated profit and download options</p>
          </div>
          <button
            onClick={() => setCurrentView('user-invoice-history')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            View Full History ({totalInvoices}) &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Invoice Number</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Total</th>
                <th className="py-3 px-4 font-semibold">Discount</th>
                <th className="py-3 px-4 font-semibold">Profit</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No invoices generated yet. Click "+ Create Invoice" to generate your first bill.
                  </td>
                </tr>
              ) : (
                invoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-blue-600 font-mono">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div>{inv.customerName}</div>
                      <div className="text-[10px] text-slate-400">{inv.customerState}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {formatDate(inv.invoiceDate)}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      {formatCurrency(inv.grandTotal)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {inv.totalDiscount > 0 ? (
                        <span className="text-amber-700 font-medium">-{formatCurrency(inv.totalDiscount)}</span>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-600 font-mono">
                      {formatCurrency(inv.profit)}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={inv.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedInvoiceForPreview(inv);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors flex items-center gap-1"
                          title="Preview & Download PDF"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View / PDF</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
