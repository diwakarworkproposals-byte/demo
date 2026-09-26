import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  Calendar,
  Building,
  Package,
  IndianRupee,
  FileText,
  CheckCircle2,
  TrendingUp,
  ArrowDownRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

export const PurchasesView = () => {
  const { purchases, products, recordPurchase } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    supplier: '',
    productId: products[0]?.id || '',
    quantity: '10',
    purchasePrice: products[0]?.purchasePrice || '500',
    purchaseDate: todayStr,
    referenceNumber: ''
  });

  const handleProductSelect = (e) => {
    const prodId = e.target.value;
    const selected = products.find((p) => p.id === prodId);
    setFormData((prev) => ({
      ...prev,
      productId: prodId,
      purchasePrice: selected ? selected.purchasePrice : prev.purchasePrice
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    recordPurchase(formData);
    setModalOpen(false);
    // Reset form
    setFormData({
      supplier: '',
      productId: products[0]?.id || '',
      quantity: '10',
      purchasePrice: products[0]?.purchasePrice || '500',
      purchaseDate: todayStr,
      referenceNumber: ''
    });
  };

  const filteredPurchases = purchases.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.supplier.toLowerCase().includes(q) ||
      p.productName.toLowerCase().includes(q) ||
      (p.referenceNumber && p.referenceNumber.toLowerCase().includes(q))
    );
  });

  const totalSpent = purchases.reduce((acc, p) => acc + (p.totalAmount || 0), 0);
  const totalUnitsPurchased = purchases.reduce((acc, p) => acc + (p.quantity || 0), 0);

  return (
    <div className="p-3.5 sm:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <span>Inward Purchases & Stock Refill</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Record supplier orders. Product stock increments automatically upon entry.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Purchase</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Inward Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">{purchases.length} Records</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Recorded purchase entries</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Units Inward</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-700">{totalUnitsPurchased} Units</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Stock added to inventory</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Purchase Spend</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalSpent)}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Cumulative procurement expenditure</div>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by supplier, product name, reference number..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filteredPurchases.length}</strong> purchases
        </div>
      </div>

      {/* Purchase History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Ref / Invoice No.</th>
                <th className="py-3 px-4 font-semibold">Supplier</th>
                <th className="py-3 px-4 font-semibold">Product Name</th>
                <th className="py-3 px-4 font-semibold">Qty Added</th>
                <th className="py-3 px-4 font-semibold">Unit Cost</th>
                <th className="py-3 px-4 font-semibold text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No purchase records found.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((pur) => (
                  <tr key={pur.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {formatDate(pur.purchaseDate)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {pur.referenceNumber || '-'}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {pur.supplier}
                    </td>

                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      {pur.productName}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-600 font-mono">
                      +{pur.quantity} units
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {formatCurrency(pur.purchasePrice)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right">
                      {formatCurrency(pur.totalAmount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PURCHASE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 mat-shadow-lg border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span>Record Purchase (Increases Stock)</span>
            </h3>

            <form onSubmit={handleSubmit} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Supplier Name *</label>
                <input
                  type="text"
                  required
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="e.g. Apex Hardware Wholesalers"
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Product *</label>
                <select
                  value={formData.productId}
                  onChange={handleProductSelect}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current Stock: {p.currentStock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Quantity to Inward *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Purchase Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Purchase Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Invoice / Reference No.</label>
                  <input
                    type="text"
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value.toUpperCase() })}
                    placeholder="INV-9902"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono uppercase"
                  />
                </div>
              </div>

              {/* Total Calculation Note */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">Total Purchase Value:</span>
                <span className="text-base font-bold text-blue-700 font-mono">
                  {formatCurrency((parseInt(formData.quantity, 10) || 0) * (parseFloat(formData.purchasePrice) || 0))}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Increase Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
