import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  IndianRupee,
  FileSpreadsheet,
  Award,
  Users,
  Package,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

export const SalesReportsView = () => {
  const { invoices, products, customers } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7); // e.g. "2026-09"

  // 1. Daily Sales & Profit
  const dailyInvoices = invoices.filter((i) => i.invoiceDate === todayStr);
  const dailySales = dailyInvoices.reduce((acc, i) => acc + (i.grandTotal || 0), 0);
  const dailyProfit = dailyInvoices.reduce((acc, i) => acc + (i.profit || 0), 0);

  // 2. Monthly Sales & Profit
  const monthlyInvoices = invoices.filter((i) => i.invoiceDate.startsWith(currentMonthStr));
  const monthlySales = monthlyInvoices.reduce((acc, i) => acc + (i.grandTotal || 0), 0);
  const monthlyProfit = monthlyInvoices.reduce((acc, i) => acc + (i.profit || 0), 0);

  // 3. Total Sales & Profit
  const totalSales = invoices.reduce((acc, i) => acc + (i.grandTotal || 0), 0);
  const totalProfit = invoices.reduce((acc, i) => acc + (i.profit || 0), 0);

  // 4. GST Tax Summaries
  const totalTaxable = invoices.reduce((acc, i) => acc + (i.taxableAmount || 0), 0);
  const totalCgst = invoices.reduce((acc, i) => acc + (i.cgstTotal || 0), 0);
  const totalSgst = invoices.reduce((acc, i) => acc + (i.sgstTotal || 0), 0);
  const totalIgst = invoices.reduce((acc, i) => acc + (i.igstTotal || 0), 0);
  const totalGst = totalCgst + totalSgst + totalIgst;

  // 5. Product performance (aggregate from invoice line items)
  const productSalesMap = {};
  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.productName,
          sku: item.sku,
          quantitySold: 0,
          revenue: 0,
          profit: 0
        };
      }
      productSalesMap[item.productId].quantitySold += item.quantity || 0;
      productSalesMap[item.productId].revenue += item.total || 0;
      productSalesMap[item.productId].profit += item.profit || 0;
    });
  });
  const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);

  // 6. Customer ranking
  const customerSalesMap = {};
  invoices.forEach((inv) => {
    if (!customerSalesMap[inv.customerName]) {
      customerSalesMap[inv.customerName] = {
        name: inv.customerName,
        state: inv.customerState,
        invoicesCount: 0,
        totalPurchased: 0
      };
    }
    customerSalesMap[inv.customerName].invoicesCount += 1;
    customerSalesMap[inv.customerName].totalPurchased += inv.grandTotal || 0;
  });
  const topCustomers = Object.values(customerSalesMap).sort((a, b) => b.totalPurchased - a.totalPurchased);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <span>Sales & Profit Analytics</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Detailed metrics covering Daily Profit, Monthly Profit, Total Profit, and GST tax reconciliations.
        </p>
      </div>

      {/* 4 Cards: Daily, Monthly, and Total Profit metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Daily Profit (Today)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-blue-700">{formatCurrency(dailyProfit)}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Sales: {formatCurrency(dailySales)}</div>
          </div>
        </div>

        {/* Monthly Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Profit</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-indigo-700">{formatCurrency(monthlyProfit)}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Sales: {formatCurrency(monthlySales)}</div>
          </div>
        </div>

        {/* Total Profit */}
        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/20 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Total All-Time Profit</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-emerald-700">{formatCurrency(totalProfit)}</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Cumulative net margin</div>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Billed Sales</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalSales)}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{invoices.length} total tax bills</div>
          </div>
        </div>
      </div>

      {/* GST TAX SUMMARY (GSTR-1 Ready) */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm p-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-blue-600" />
          <span>GST Tax Liability Summary (GSTR-1 Ready)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Taxable Base</span>
            <div className="text-base font-bold text-slate-900 font-mono mt-1">{formatCurrency(totalTaxable)}</div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
            <span className="text-[10px] text-blue-700 font-bold uppercase block">CGST Total</span>
            <div className="text-base font-bold text-blue-800 font-mono mt-1">{formatCurrency(totalCgst)}</div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
            <span className="text-[10px] text-blue-700 font-bold uppercase block">SGST Total</span>
            <div className="text-base font-bold text-blue-800 font-mono mt-1">{formatCurrency(totalSgst)}</div>
          </div>

          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200">
            <span className="text-[10px] text-purple-700 font-bold uppercase block">IGST Total</span>
            <div className="text-base font-bold text-purple-800 font-mono mt-1">{formatCurrency(totalIgst)}</div>
          </div>

          <div className="p-3 bg-slate-900 text-white rounded-xl col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total GST Due</span>
            <div className="text-base font-bold text-amber-400 font-mono mt-1">{formatCurrency(totalGst)}</div>
          </div>
        </div>
      </div>

      {/* Top Products & Top Customers Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm p-6">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Top Performing Products</span>
          </h3>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">No sales recorded yet.</div>
            ) : (
              topProducts.map((p, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-slate-400 text-[10px]">
                      Sold: {p.quantitySold} units • Profit: <strong className="text-emerald-600">{formatCurrency(p.profit)}</strong>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-slate-900">
                    {formatCurrency(p.revenue)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm p-6">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Top Customers & Companies</span>
          </h3>

          <div className="space-y-3">
            {topCustomers.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">No customers billed yet.</div>
            ) : (
              topCustomers.map((c, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-slate-400 text-[10px]">
                      {c.state} • {c.invoicesCount} invoice(s)
                    </div>
                  </div>
                  <div className="font-mono font-bold text-blue-700">
                    {formatCurrency(c.totalPurchased)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
