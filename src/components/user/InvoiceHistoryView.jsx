import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Calendar,
  Eye,
  Download,
  Printer,
  Trash2,
  FilePlus,
  TrendingUp,
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { StatusBadge } from '../common/Badge';

export const InvoiceHistoryView = ({ setCurrentView, setSelectedInvoiceForPreview }) => {
  const { invoices, deleteInvoice } = useApp();
  const { isExpired } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      (inv.customerGst && inv.customerGst.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    return true;
  });

  const totalInvoiced = invoices.reduce((acc, i) => acc + (i.grandTotal || 0), 0);
  const totalProfit = invoices.reduce((acc, i) => acc + (i.profit || 0), 0);

  const handleDelete = (id, number) => {
    if (window.confirm(`Are you sure you want to delete invoice ${number}?`)) {
      deleteInvoice(id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span>Invoice History & Billing Archives</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access past invoices, download professional PDF bills, and review transaction profits.
          </p>
        </div>

        <button
          disabled={isExpired}
          onClick={() => setCurrentView('user-create-invoice')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all ${
            isExpired
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:shadow'
          }`}
        >
          <FilePlus className="w-4 h-4" />
          <span>+ Create Invoice</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Invoices</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{invoices.length} Bills</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Lifetime invoices generated</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Sales Volume</div>
          <div className="text-2xl font-extrabold text-blue-700 mt-2">{formatCurrency(totalInvoiced)}</div>
          <div className="text-[11px] text-blue-600 mt-0.5">All invoices cumulative</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cumulative Profit Realized</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">{formatCurrency(totalProfit)}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Stored at sale time</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice number, customer name, GSTIN..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Bills
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'paid' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {/* Invoice History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Invoice Number</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Total Amount</th>
                <th className="py-3 px-4 font-semibold">Discount</th>
                <th className="py-3 px-4 font-semibold">Stored Profit</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No invoices matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
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
                          onClick={() => setSelectedInvoiceForPreview(inv)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors flex items-center gap-1"
                          title="View & Download PDF Invoice"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View / PDF</span>
                        </button>

                        <button
                          onClick={() => handleDelete(inv.id, inv.invoiceNumber)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
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
