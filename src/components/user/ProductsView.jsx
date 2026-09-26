import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
  IndianRupee,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';

export const ProductsView = ({ setCurrentView }) => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'low-stock', 'in-stock'
  const [modalMode, setModalMode] = useState(null); // 'add', 'edit'
  const [activeProduct, setActiveProduct] = useState(null);

  const initialForm = {
    name: '',
    sku: '',
    category: 'Electronics',
    unit: 'Pcs',
    purchasePrice: '',
    sellingPrice: '',
    currentStock: '',
    minStockLevel: '5',
    gstRate: '18',
    description: ''
  };

  const [formData, setFormData] = useState(initialForm);

  // Overall Inventory Calculations
  const totalStockUnits = products.reduce((acc, p) => acc + (p.currentStock || 0), 0);
  const totalPurchaseValue = products.reduce((acc, p) => acc + (p.currentStock * p.purchasePrice), 0);
  const totalSalesValue = products.reduce((acc, p) => acc + (p.currentStock * p.sellingPrice), 0);
  const totalPotentialProfit = totalSalesValue - totalPurchaseValue;
  const lowStockProducts = products.filter((p) => p.currentStock <= p.minStockLevel);

  // Filtering
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterType === 'low-stock') return p.currentStock <= p.minStockLevel;
    if (filterType === 'in-stock') return p.currentStock > p.minStockLevel;
    return true;
  });

  const openAddModal = () => {
    setFormData(initialForm);
    setModalMode('add');
  };

  const openEditModal = (prod) => {
    setActiveProduct(prod);
    setFormData({
      name: prod.name,
      sku: prod.sku,
      category: prod.category,
      unit: prod.unit,
      purchasePrice: prod.purchasePrice,
      sellingPrice: prod.sellingPrice,
      currentStock: prod.currentStock,
      minStockLevel: prod.minStockLevel,
      gstRate: prod.gstRate,
      description: prod.description || ''
    });
    setModalMode('edit');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addProduct(formData);
    } else if (modalMode === 'edit') {
      updateProduct(activeProduct.id, formData);
    }
    setModalMode(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete product "${name}" from stock catalog?`)) {
      deleteProduct(id);
    }
  };

  // Real-time calculation helper for the modal preview
  const formCurrentStock = parseFloat(formData.currentStock) || 0;
  const formPurchasePrice = parseFloat(formData.purchasePrice) || 0;
  const formSellingPrice = parseFloat(formData.sellingPrice) || 0;
  const formPurchaseValue = formCurrentStock * formPurchasePrice;
  const formSalesValue = formCurrentStock * formSellingPrice;
  const formExpectedProfit = formSalesValue - formPurchaseValue;

  return (
    <div className="p-3.5 sm:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            <span>Stock & Product Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time inventory levels, automated margin analysis, and potential sales valuation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentView('user-purchases')}
            className="px-3.5 py-2 sm:py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Record Inward Purchase
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product</span>
          </button>
        </div>
      </div>

      {/* Potential Valuation Cards (Prominently displaying required calculations) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Stock Units */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Inventory Units</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">{totalStockUnits} Units</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Across {products.length} distinct SKUs</div>
          </div>
        </div>

        {/* Card 2: Potential Purchase Cost */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Potential Purchase Cost</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalPurchaseValue)}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Stock × Purchase Price</div>
          </div>
        </div>

        {/* Card 3: Potential Sales Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Potential Sales Value</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-blue-700">{formatCurrency(totalSalesValue)}</div>
            <div className="text-[11px] text-blue-600 mt-0.5">Stock × Selling Price</div>
          </div>
        </div>

        {/* Card 4: Potential Profit */}
        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/20 mat-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Potential Profit</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-700">{formatCurrency(totalPotentialProfit)}</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Stock × (Selling - Purchase)</div>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Alert if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                Low Stock Alert ({lowStockProducts.length} items at or below minimum stock level)
              </span>
              <p className="text-xs text-amber-700">
                Prevent sales bottlenecks by recording supplier purchases before items completely run out.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterType(filterType === 'low-stock' ? 'all' : 'low-stock')}
            className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg text-xs font-bold whitespace-nowrap self-start sm:self-auto"
          >
            {filterType === 'low-stock' ? 'Show All Products' : 'Filter Low Stock Items'}
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, SKU, category..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Items ({products.length})
          </button>
          <button
            onClick={() => setFilterType('low-stock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              filterType === 'low-stock'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Low Stock ({lowStockProducts.length})</span>
          </button>
        </div>
      </div>

      {/* Products Table with Automatic Valuations */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Product Name & SKU</th>
                <th className="py-3 px-4 font-semibold">Category / Unit</th>
                <th className="py-3 px-4 font-semibold">Purchase Price</th>
                <th className="py-3 px-4 font-semibold">Selling Price</th>
                <th className="py-3 px-4 font-semibold">Current Stock</th>
                <th className="py-3 px-4 font-semibold">Potential Sales</th>
                <th className="py-3 px-4 font-semibold">Potential Profit</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.currentStock <= p.minStockLevel;
                  const purchaseValue = p.currentStock * p.purchasePrice;
                  const salesValue = p.currentStock * p.sellingPrice;
                  const profit = p.currentStock * (p.sellingPrice - p.purchasePrice);

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isLow ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div>{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>SKU: {p.sku}</span>
                          <span>•</span>
                          <span>GST: {p.gstRate}%</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{p.category}</div>
                        <div className="text-[10px] text-slate-400">Unit: {p.unit}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {formatCurrency(p.purchasePrice)}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {formatCurrency(p.sellingPrice)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold font-mono text-sm ${
                              isLow ? 'text-rose-600' : 'text-slate-900'
                            }`}
                          >
                            {p.currentStock} {p.unit}
                          </span>
                          {isLow && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                              Low (Min: {p.minStockLevel})
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-blue-700">
                        {formatCurrency(salesValue)}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                        {formatCurrency(profit)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 mat-shadow-lg border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>{modalMode === 'add' ? 'Add New Product to Inventory' : 'Edit Product'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Wireless Ergonomic Keyboard"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">SKU / Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    placeholder="e.g. WEK-201"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Electronics / Hardware"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Unit of Measurement</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                  >
                    <option value="Pcs">Pcs (Pieces)</option>
                    <option value="Box">Box</option>
                    <option value="Kg">Kg (Kilograms)</option>
                    <option value="Ltr">Ltr (Liters)</option>
                    <option value="Meter">Meter</option>
                    <option value="Set">Set</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">GST Rate (%)</label>
                  <select
                    value={formData.gstRate}
                    onChange={(e) => setFormData({ ...formData, gstRate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-semibold"
                  >
                    <option value="0">0% (Nil / Exempt)</option>
                    <option value="5">5% GST</option>
                    <option value="12">12% GST</option>
                    <option value="18">18% GST (Standard)</option>
                    <option value="28">28% GST (Luxury)</option>
                  </select>
                </div>
              </div>

              {/* Price & Stock Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Purchase Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    placeholder="500"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="700"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Current Stock *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    placeholder="10"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono font-bold text-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Min. Stock Alert</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                    placeholder="5"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono text-amber-700"
                  />
                </div>
              </div>

              {/* Automatic Calculation Preview Box (Matches Prompt Example: 500, 700, 10 -> 5000, 7000, 2000) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Real-Time Potential Valuation Calculations:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">POTENTIAL PURCHASE COST</span>
                    <strong className="text-slate-800 font-mono text-sm">{formatCurrency(formPurchaseValue)}</strong>
                    <div className="text-[10px] text-slate-400">({formCurrentStock} × ₹{formPurchasePrice})</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-blue-500 block font-semibold">POTENTIAL SALES VALUE</span>
                    <strong className="text-blue-700 font-mono text-sm">{formatCurrency(formSalesValue)}</strong>
                    <div className="text-[10px] text-slate-400">({formCurrentStock} × ₹{formSellingPrice})</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-emerald-300">
                    <span className="text-[10px] text-emerald-600 block font-semibold">EXPECTED PROFIT</span>
                    <strong className="text-emerald-700 font-mono text-sm">{formatCurrency(formExpectedProfit)}</strong>
                    <div className="text-[10px] text-slate-400">({formCurrentStock} × ₹{formSellingPrice - formPurchasePrice})</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product specifications, notes, manufacturer details..."
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 bg-slate-100 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  {modalMode === 'add' ? 'Save Product' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
