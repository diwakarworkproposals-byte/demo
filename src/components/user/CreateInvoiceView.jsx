import React, { useState, useEffect } from 'react';
import {
  FilePlus,
  Plus,
  Trash2,
  Search,
  UserPlus,
  AlertCircle,
  Eye,
  CheckCircle2,
  Building,
  Calendar,
  IndianRupee,
  Percent,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, addMonthsToDate, INDIAN_STATES } from '../../utils/helpers';
import { InvoicePreviewModal } from './InvoicePreviewModal';

export const CreateInvoiceView = ({ setCurrentView, setSelectedInvoiceForPreview }) => {
  const { customers, products, createInvoice, addCustomer, showToast } = useApp();
  const { currentUser, isExpired } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDueDate = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];

  // Auto-generate invoice number
  const prefix = currentUser?.invoicePrefix || 'ASB';
  const year = new Date().getFullYear();
  const nextNum = currentUser?.nextInvoiceNumber || 1004;
  const initialInvoiceNumber = `${prefix}-${year}-${String(nextNum).padStart(4, '0')}`;

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState(initialInvoiceNumber);
  const [invoiceDate, setInvoiceDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [isInterState, setIsInterState] = useState(false);

  // Line items state
  // Product | Qty | Price | GST | Discount | Total
  const [items, setItems] = useState([
    {
      productId: products[0]?.id || '',
      quantity: 1,
      sellingPrice: products[0]?.sellingPrice || 0,
      purchasePrice: products[0]?.purchasePrice || 0,
      gstRate: products[0]?.gstRate || 18,
      discountType: 'percentage', // 'percentage' | 'fixed'
      discountValue: 0
    }
  ]);

  // Overall invoice discount
  const [overallDiscountType, setOverallDiscountType] = useState('percentage'); // 'percentage' or 'fixed'
  const [overallDiscountValue, setOverallDiscountValue] = useState(0);

  // Stock error tracking per item index
  const [stockErrors, setStockErrors] = useState({});

  // Inline Add Customer Modal
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [newCustForm, setNewCustForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gstNumber: '',
    state: currentUser?.state || 'Maharashtra',
    stateCode: currentUser?.stateCode || '27',
    pincode: ''
  });

  // Preview Modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [preparedInvoice, setPreparedInvoice] = useState(null);

  // Selected customer object
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Automatically determine Intra-State vs Inter-State based on customer state vs business state
  useEffect(() => {
    if (selectedCustomer && currentUser) {
      const userState = (currentUser.state || '').toLowerCase();
      const custState = (selectedCustomer.state || '').toLowerCase();
      if (userState && custState) {
        setIsInterState(userState !== custState);
      }
    }
  }, [selectedCustomerId, selectedCustomer, currentUser]);

  // Calculate live item values & check stock
  const calculateItemValues = (item, index) => {
    const prod = products.find((p) => p.id === item.productId);
    const qty = parseInt(item.quantity, 10) || 0;
    const price = parseFloat(item.sellingPrice) || 0;
    const cost = parseFloat(item.purchasePrice || prod?.purchasePrice || 0);
    const gstPct = parseFloat(item.gstRate) || 0;

    // Line subtotal
    const lineGross = qty * price;

    // Line discount
    let lineDisc = 0;
    if (item.discountType === 'percentage') {
      lineDisc = (lineGross * (parseFloat(item.discountValue) || 0)) / 100;
    } else {
      lineDisc = parseFloat(item.discountValue) || 0;
    }
    lineDisc = Math.min(lineDisc, lineGross);

    const taxable = Math.max(0, lineGross - lineDisc);
    const taxAmt = (taxable * gstPct) / 100;
    const lineTotal = taxable + taxAmt;

    // Profit = (Selling - Cost) * Qty - line discount
    const itemProfit = (price - cost) * qty - lineDisc;

    return {
      qty,
      price,
      cost,
      gstPct,
      lineGross,
      lineDisc,
      taxable,
      taxAmt,
      lineTotal,
      itemProfit,
      availableStock: prod ? prod.currentStock : 0,
      prodName: prod ? prod.name : 'Unknown Product',
      sku: prod ? prod.sku : '',
      unit: prod ? prod.unit : 'Pcs'
    };
  };

  // Check stock whenever items change
  useEffect(() => {
    const errors = {};
    items.forEach((item, idx) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const qty = parseInt(item.quantity, 10) || 0;
        if (qty > prod.currentStock) {
          errors[idx] = `Insufficient stock. Only ${prod.currentStock} units are available.`;
        }
      }
    });
    setStockErrors(errors);
  }, [items, products]);

  // Handle changing product in line item
  const handleItemProductChange = (index, prodId) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            productId: prodId,
            sellingPrice: prod.sellingPrice,
            purchasePrice: prod.purchasePrice,
            gstRate: prod.gstRate
          };
        }
        return item;
      })
    );
  };

  // Handle changing quantity or prices
  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const addItemRow = () => {
    const firstProd = products[0];
    setItems((prev) => [
      ...prev,
      {
        productId: firstProd?.id || '',
        quantity: 1,
        sellingPrice: firstProd?.sellingPrice || 0,
        purchasePrice: firstProd?.purchasePrice || 0,
        gstRate: firstProd?.gstRate || 18,
        discountType: 'percentage',
        discountValue: 0
      }
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Global Invoice Calculations (Subtotal, Discount, Taxable, CGST, SGST, IGST, Grand Total, Profit)
  let subtotal = 0;
  let totalLineDiscounts = 0;
  let itemsProfitSum = 0;
  const processedItems = items.map((item, idx) => {
    const calc = calculateItemValues(item, idx);
    subtotal += calc.lineGross;
    totalLineDiscounts += calc.lineDisc;
    itemsProfitSum += calc.itemProfit;
    return {
      ...item,
      productName: calc.prodName,
      sku: calc.sku,
      unit: calc.unit,
      quantity: calc.qty,
      sellingPrice: calc.price,
      purchasePrice: calc.cost,
      gstRate: calc.gstPct,
      itemDiscount: calc.lineDisc,
      taxableAmount: calc.taxable,
      total: calc.lineTotal,
      profit: calc.itemProfit
    };
  });

  // Overall Discount calculation
  let overallDiscountAmount = 0;
  const subtotalAfterLineDiscounts = subtotal - totalLineDiscounts;
  if (overallDiscountType === 'percentage') {
    overallDiscountAmount = (subtotalAfterLineDiscounts * (parseFloat(overallDiscountValue) || 0)) / 100;
  } else {
    overallDiscountAmount = parseFloat(overallDiscountValue) || 0;
  }
  overallDiscountAmount = Math.min(overallDiscountAmount, subtotalAfterLineDiscounts);

  const totalDiscount = totalLineDiscounts + overallDiscountAmount;
  const taxableAmount = Math.max(0, subtotal - totalDiscount);

  // Distribute tax & calculate CGST/SGST/IGST
  // For weighted tax calculation across mixed rate products
  let totalTax = 0;
  processedItems.forEach((pItem) => {
    // Proportional taxable basis for item after overall discount
    const itemRatio = subtotalAfterLineDiscounts > 0 ? pItem.taxableAmount / subtotalAfterLineDiscounts : 0;
    const finalItemTaxable = Math.max(0, pItem.taxableAmount - (overallDiscountAmount * itemRatio));
    const itemTax = (finalItemTaxable * pItem.gstRate) / 100;
    totalTax += itemTax;
  });

  const cgstTotal = isInterState ? 0 : totalTax / 2;
  const sgstTotal = isInterState ? 0 : totalTax / 2;
  const igstTotal = isInterState ? totalTax : 0;
  const grandTotal = Math.round((taxableAmount + totalTax) * 100) / 100;

  // Total invoice profit = itemsProfitSum minus overallDiscountAmount
  const invoiceProfit = Math.max(0, itemsProfitSum - overallDiscountAmount);

  // Prepare Invoice Data Object
  const buildInvoiceObject = () => {
    return {
      invoiceNumber,
      customerId: selectedCustomerId,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
      customerGst: selectedCustomer ? selectedCustomer.gstNumber : '',
      customerState: selectedCustomer ? selectedCustomer.state : currentUser?.state,
      customerAddress: selectedCustomer ? selectedCustomer.address : '',
      customerPhone: selectedCustomer ? selectedCustomer.phone : '',
      invoiceDate,
      dueDate,
      isInterState,
      items: processedItems,
      subtotal,
      discountType: overallDiscountType,
      discountValue: overallDiscountValue,
      overallDiscountAmount,
      totalDiscount,
      taxableAmount,
      cgstTotal,
      sgstTotal,
      igstTotal,
      taxTotal: totalTax,
      grandTotal,
      profit: invoiceProfit,
      status: 'paid'
    };
  };

  const handleOpenPreview = () => {
    // Check if any stock error
    if (Object.keys(stockErrors).length > 0) {
      showToast('Please fix stock limit errors before previewing or generating.', 'error');
      return;
    }
    const inv = buildInvoiceObject();
    setPreparedInvoice(inv);
    setPreviewOpen(true);
  };

  const handleGenerateInvoice = () => {
    // Check if expired
    if (isExpired) {
      showToast('Your ASAN BILL account has expired. Please contact the administrator to renew your subscription.', 'error');
      return;
    }

    if (Object.keys(stockErrors).length > 0) {
      showToast('Cannot generate invoice: stock quantity exceeds available inventory.', 'error');
      return;
    }

    const inv = buildInvoiceObject();
    const result = createInvoice(inv);

    if (result.success) {
      setPreviewOpen(false);
      setCurrentView('user-invoice-history');
    }
  };

  // Inline Add Customer Handler
  const handleSaveInlineCustomer = (e) => {
    e.preventDefault();
    const created = addCustomer(newCustForm);
    setSelectedCustomerId(created.id);
    setAddCustomerModal(false);
    setNewCustForm({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      gstNumber: '',
      state: currentUser?.state || 'Maharashtra',
      stateCode: currentUser?.stateCode || '27',
      pincode: ''
    });
  };

  return (
    <div className="p-3.5 sm:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Expiry Warning if expired */}
      {isExpired && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <strong>Billing Disabled:</strong> Your ASAN BILL account has expired. Please contact the administrator to renew your subscription.
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FilePlus className="w-6 h-6 text-blue-600" />
            <span>Create New Tax Invoice</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate GST compliant invoices with real-time stock limits, discounts, and automated profit logging.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleOpenPreview}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Preview Invoice</span>
          </button>

          <button
            type="button"
            disabled={isExpired || Object.keys(stockErrors).length > 0}
            onClick={handleGenerateInvoice}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all ${
              isExpired || Object.keys(stockErrors).length > 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:shadow'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Generate & Save Invoice</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: CUSTOMER & INVOICE DETAILS */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Selection */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>Select Customer / Company *</span>
              </label>
              <button
                type="button"
                onClick={() => setAddCustomerModal(true)}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add New Customer</span>
              </button>
            </div>

            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} • {c.state} {c.gstNumber ? `(GSTIN: ${c.gstNumber})` : ''}
                </option>
              ))}
            </select>

            {/* Selected Customer Preview Strip */}
            {selectedCustomer && (
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-slate-800">{selectedCustomer.name}</span>
                  <span className="text-slate-400 mx-2">|</span>
                  <span>GSTIN: <strong className="font-mono text-slate-700">{selectedCustomer.gstNumber || 'Unregistered'}</strong></span>
                </div>
                <div>
                  <span>Place of Supply: <strong className="text-blue-700">{selectedCustomer.state}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Invoice Meta */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  required
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* GST Tax Jurisdiction Toggle */}
            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-slate-600">Tax Type:</span>
              <button
                type="button"
                onClick={() => setIsInterState(!isInterState)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                  isInterState
                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
                title="Click to toggle between Intra-State and Inter-State"
              >
                {isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST + SGST)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ADD PRODUCTS TO INVOICE (Table) */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Receipt className="w-4 h-4 text-blue-600" />
            <span>Invoice Line Items</span>
          </h3>
          <span className="text-xs text-slate-500">Live stock validation enabled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold min-w-[240px]">Product / Item</th>
                <th className="py-3 px-4 font-bold w-28">Qty</th>
                <th className="py-3 px-4 font-bold w-32">Selling Price (₹)</th>
                <th className="py-3 px-4 font-bold w-24">GST %</th>
                <th className="py-3 px-4 font-bold w-32">Disc (₹/%)</th>
                <th className="py-3 px-4 font-bold text-right w-36">Total (₹)</th>
                <th className="py-3 px-4 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => {
                const prod = products.find((p) => p.id === item.productId);
                const stockError = stockErrors[idx];
                const calc = calculateItemValues(item, idx);

                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    {/* Product Selector */}
                    <td className="py-3 px-4 align-top">
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemProductChange(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Stock: {p.currentStock} {p.unit})
                          </option>
                        ))}
                      </select>

                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                        <span>Available Stock: <strong className="text-slate-700">{calc.availableStock} {calc.unit}</strong></span>
                        <span>•</span>
                        <span>Cost: ₹{calc.cost}</span>
                      </div>
                    </td>

                    {/* Quantity with Strict Stock Check */}
                    <td className="py-3 px-4 align-top">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className={`w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono font-bold ${
                          stockError
                            ? 'border-rose-500 bg-rose-50 text-rose-700 focus:ring-rose-500'
                            : 'border-slate-300 bg-slate-50 text-slate-900 focus:bg-white'
                        }`}
                      />

                      {/* Stock Warning Message as requested in prompt */}
                      {stockError && (
                        <div className="text-[11px] text-rose-600 font-bold mt-1 flex items-start gap-1 leading-tight">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{stockError}</span>
                        </div>
                      )}
                    </td>

                    {/* Selling Price */}
                    <td className="py-3 px-4 align-top">
                      <input
                        type="number"
                        step="0.01"
                        value={item.sellingPrice}
                        onChange={(e) => handleItemChange(idx, 'sellingPrice', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900"
                      />
                    </td>

                    {/* GST % */}
                    <td className="py-3 px-4 align-top">
                      <select
                        value={item.gstRate}
                        onChange={(e) => handleItemChange(idx, 'gstRate', e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </td>

                    {/* Line Discount */}
                    <td className="py-3 px-4 align-top">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          value={item.discountValue}
                          onChange={(e) => handleItemChange(idx, 'discountValue', e.target.value)}
                          className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                        <select
                          value={item.discountType}
                          onChange={(e) => handleItemChange(idx, 'discountType', e.target.value)}
                          className="px-1.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        >
                          <option value="percentage">%</option>
                          <option value="fixed">₹</option>
                        </select>
                      </div>
                    </td>

                    {/* Line Total */}
                    <td className="py-3 px-4 align-top text-right font-mono font-bold text-sm text-slate-900">
                      {formatCurrency(calc.lineTotal)}
                      <div className="text-[10px] text-emerald-600 font-normal">
                        Profit: {formatCurrency(calc.itemProfit)}
                      </div>
                    </td>

                    {/* Delete Item */}
                    <td className="py-3 px-4 align-top text-center">
                      <button
                        type="button"
                        onClick={() => removeItemRow(idx)}
                        disabled={items.length === 1}
                        className={`p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 ${
                          items.length === 1 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add Product Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={addItemRow}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Another Product</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: DISCOUNT OPTIONS & FINANCIAL CALCULATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Overall Discount System */}
        <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Percent className="w-4 h-4 text-amber-500" />
            <span>Overall Bill Discount System</span>
          </h3>
          <p className="text-xs text-slate-500">
            Apply a discount to the entire invoice subtotal before GST is applied.
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Discount Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOverallDiscountType('percentage')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold ${
                    overallDiscountType === 'percentage'
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setOverallDiscountType('fixed')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold ${
                    overallDiscountType === 'fixed'
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Fixed Amount (₹)
                </button>
              </div>
            </div>

            <div className="w-36">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {overallDiscountType === 'percentage' ? 'Rate (%)' : 'Amount (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={overallDiscountValue}
                onChange={(e) => setOverallDiscountValue(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono font-bold"
              />
            </div>
          </div>

          {/* Example Calculation Callout Box (as requested in prompt) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Calculation Sequence:
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <strong className="font-mono">{formatCurrency(subtotal)}</strong>
            </div>
            <div className="flex justify-between text-amber-700">
              <span>Discount:</span>
              <strong className="font-mono">-{formatCurrency(totalDiscount)}</strong>
            </div>
            <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
              <span>Taxable Amount (GST Base):</span>
              <strong className="font-mono">{formatCurrency(taxableAmount)}</strong>
            </div>
          </div>
        </div>

        {/* Right: Complete Tax & Profit Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm p-6 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>Bill Total Breakdown</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              {isInterState ? 'IGST Applicable' : 'CGST + SGST'}
            </span>
          </h3>

          <div className="text-xs space-y-2 pt-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal (Gross):</span>
              <span className="font-mono font-semibold">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-amber-700">
              <span>Total Discount:</span>
              <span className="font-mono font-semibold">-{formatCurrency(totalDiscount)}</span>
            </div>

            <div className="flex justify-between text-slate-700 font-semibold border-t border-slate-100 pt-2">
              <span>Taxable Amount:</span>
              <span className="font-mono">{formatCurrency(taxableAmount)}</span>
            </div>

            {/* GST Items */}
            {isInterState ? (
              <div className="flex justify-between text-slate-600">
                <span>IGST:</span>
                <span className="font-mono">{formatCurrency(igstTotal)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-slate-600">
                  <span>CGST:</span>
                  <span className="font-mono">{formatCurrency(cgstTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST:</span>
                  <span className="font-mono">{formatCurrency(sgstTotal)}</span>
                </div>
              </>
            )}

            <div className="flex justify-between text-lg font-extrabold text-slate-900 border-t-2 border-slate-900 pt-3">
              <span>Grand Total:</span>
              <span className="font-mono text-blue-700">{formatCurrency(grandTotal)}</span>
            </div>

            {/* Stored Profit Real-time Badge */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 mt-3">
              <div className="flex items-center gap-1.5 font-bold">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Invoice Net Profit:</span>
              </div>
              <span className="text-base font-extrabold font-mono text-emerald-700">
                {formatCurrency(invoiceProfit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating / Bottom Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Ready to finalize? Review stock balances and preview before confirming.
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenPreview}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Invoice</span>
          </button>

          <button
            type="button"
            disabled={isExpired || Object.keys(stockErrors).length > 0}
            onClick={handleGenerateInvoice}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              isExpired || Object.keys(stockErrors).length > 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {previewOpen && preparedInvoice && (
        <InvoicePreviewModal
          invoice={preparedInvoice}
          isDraft={true}
          onClose={() => setPreviewOpen(false)}
          onEdit={() => setPreviewOpen(false)}
          onGenerate={handleGenerateInvoice}
        />
      )}

      {/* INLINE ADD CUSTOMER MODAL */}
      {addCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 mat-shadow-lg border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span>Quick Add Customer</span>
            </h3>

            <form onSubmit={handleSaveInlineCustomer} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Customer Name *</label>
                <input
                  type="text"
                  required
                  value={newCustForm.name}
                  onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })}
                  placeholder="e.g. Apex Hardware Trading Co."
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={newCustForm.phone}
                    onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">GST Number</label>
                  <input
                    type="text"
                    value={newCustForm.gstNumber}
                    onChange={(e) => setNewCustForm({ ...newCustForm, gstNumber: e.target.value.toUpperCase() })}
                    placeholder="27AADCO8899P1ZK"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">State / Jurisdiction *</label>
                <select
                  value={newCustForm.state}
                  onChange={(e) => {
                    const s = INDIAN_STATES.find((st) => st.name === e.target.value);
                    setNewCustForm({ ...newCustForm, state: e.target.value, stateCode: s ? s.code : '27' });
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Address</label>
                <input
                  type="text"
                  value={newCustForm.address}
                  onChange={(e) => setNewCustForm({ ...newCustForm, address: e.target.value })}
                  placeholder="Street, locality, city"
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddCustomerModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
