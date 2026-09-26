import React, { useState } from 'react';
import {
  Settings,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  QrCode,
  Save,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { INDIAN_STATES, formatDate, calculateDaysRemaining } from '../../utils/helpers';
import { StatusBadge } from '../common/Badge';

export const UserSettings = () => {
  const { currentUser, isExpired, isExpiringSoon, daysRemaining } = useAuth();
  const { updateUser, showToast } = useApp();

  const [formData, setFormData] = useState({
    businessName: currentUser?.businessName || '',
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    gstNumber: currentUser?.gstNumber || '',
    state: currentUser?.state || 'Maharashtra',
    stateCode: currentUser?.stateCode || '27',
    invoicePrefix: currentUser?.invoicePrefix || 'ASB',
    bankName: currentUser?.bankDetails?.bankName || 'HDFC Bank',
    accountNumber: currentUser?.bankDetails?.accountNumber || '',
    ifsc: currentUser?.bankDetails?.ifsc || '',
    branch: currentUser?.bankDetails?.branch || '',
    upiId: currentUser?.bankDetails?.upiId || ''
  });

  const handleStateChange = (e) => {
    const sName = e.target.value;
    const found = INDIAN_STATES.find((s) => s.name === sName);
    setFormData((prev) => ({
      ...prev,
      state: sName,
      stateCode: found ? found.code : '27'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    updateUser(currentUser.id, {
      businessName: formData.businessName,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      gstNumber: formData.gstNumber,
      state: formData.state,
      stateCode: formData.stateCode,
      invoicePrefix: formData.invoicePrefix,
      bankDetails: {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifsc,
        branch: formData.branch,
        upiId: formData.upiId
      }
    });
  };

  return (
    <div className="p-3.5 sm:p-6 max-w-4xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          <span>Business Profile & Invoice Settings</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize your business header, GST jurisdiction, and bank settlement details printed on invoices.
        </p>
      </div>

      {/* Subscription Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white mat-shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-300">Active Subscription</span>
            <StatusBadge status={currentUser?.status} />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            {currentUser?.plan || 'Standard Plan'}
          </div>
          <p className="text-xs text-blue-200 mt-0.5">
            Valid until: <strong>{formatDate(currentUser?.expiryDate)}</strong> ({daysRemaining} days left)
          </p>
        </div>

        <div className="text-xs bg-white/10 p-3 rounded-xl border border-white/20 self-start sm:self-auto">
          <span className="text-blue-200 block">Subscription Management:</span>
          <span className="font-semibold text-white">Managed by System Admin</span>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Business Identity */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Company Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Business Name *</label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Owner / Authorized Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">State / Tax Jurisdiction</label>
                <select
                  value={formData.state}
                  onChange={handleStateChange}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Registered Business Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Invoice Number Prefix</label>
                <input
                  type="text"
                  value={formData.invoicePrefix}
                  onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono uppercase"
                  placeholder="e.g. ASB"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Bank & UPI Settlement Info */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Settlement Bank Details (Printed on Invoices)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifsc}
                  onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">UPI ID for Direct QR</label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono"
                  placeholder="name@okbank"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Business Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
