import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Building,
  Mail,
  Phone,
  User,
  Lock,
  MapPin,
  FileText,
  Calendar,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { addMonthsToDate, INDIAN_STATES } from '../../utils/helpers';

export const AdminAddUser = ({ setCurrentView }) => {
  const { addUser } = useApp();
  const { loginAs } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    mobileNumber: '',
    username: '',
    password: '',
    address: '',
    gstNumber: '',
    state: 'Maharashtra',
    stateCode: '27',
    plan: '6 Months',
    startDate: todayStr,
    expiryDate: addMonthsToDate(todayStr, 6)
  });

  const [isManualExpiry, setIsManualExpiry] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  // Recalculate expiry date automatically when plan or startDate changes (unless admin manually edited it)
  useEffect(() => {
    if (!isManualExpiry) {
      const months = formData.plan === '12 Months' ? 12 : 6;
      const newExpiry = addMonthsToDate(formData.startDate, months);
      setFormData((prev) => ({ ...prev, expiryDate: newExpiry }));
    }
  }, [formData.plan, formData.startDate, isManualExpiry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'expiryDate') {
      setIsManualExpiry(true);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlanChange = (planName) => {
    const months = planName === '12 Months' ? 12 : 6;
    const newExpiry = addMonthsToDate(formData.startDate, months);
    setIsManualExpiry(false);
    setFormData((prev) => ({
      ...prev,
      plan: planName,
      expiryDate: newExpiry
    }));
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    const found = INDIAN_STATES.find((s) => s.name === stateName);
    setFormData((prev) => ({
      ...prev,
      state: stateName,
      stateCode: found ? found.code : '27'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = addUser({
      ...formData,
      name: formData.fullName,
      phone: formData.mobileNumber
    });

    setCreatedUser(newUser);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      businessName: '',
      email: '',
      mobileNumber: '',
      username: '',
      password: '',
      address: '',
      gstNumber: '',
      state: 'Maharashtra',
      stateCode: '27',
      plan: '6 Months',
      startDate: todayStr,
      expiryDate: addMonthsToDate(todayStr, 6)
    });
    setIsManualExpiry(false);
    setCreatedUser(null);
  };

  return (
    <div className="p-3.5 sm:p-6 max-w-4xl mx-auto space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-blue-600" />
          <span>Add New User</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Create a new business tenant, assign a subscription plan, and provision login credentials.
        </p>
      </div>

      {/* Success Modal / Card after account creation */}
      {createdUser && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 mat-shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-emerald-900">
                User account created successfully.
              </h3>
              <p className="text-xs text-emerald-700 mt-1">
                The user account has been activated and can immediately log in with the credentials:
              </p>
              <div className="mt-3 p-3 bg-white/80 rounded-xl border border-emerald-200 text-xs font-mono grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-800">
                <div>
                  <span className="text-slate-400 block font-sans text-[10px]">USERNAME</span>
                  <strong>{createdUser.username}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans text-[10px]">PASSWORD</span>
                  <strong>{createdUser.password}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans text-[10px]">PLAN EXPIRY</span>
                  <strong>{createdUser.expiryDate}</strong>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    loginAs('user', createdUser);
                    setCurrentView('user-dashboard');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <span>Log In As This User Immediately</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCurrentView('admin-users')}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-all"
                >
                  Go to Users Directory
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-medium"
                >
                  Create Another User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Business & Personal Details */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Business & Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Business / Company Name *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Patel Hardware & Tools"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ramesh@patelhardware.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="+91 98234 56789"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Business Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Shop No. 12, Main Market, Station Road"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  State / Jurisdiction
                </label>
                <select
                  value={formData.state}
                  onChange={handleStateChange}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  GST Number (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="27ABCDE1234F1Z5"
                    className="w-full pl-9 pr-3 py-2 text-sm uppercase bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Account Login Credentials */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Login Credentials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Username *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. ramesh_patel"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Assign password (e.g. user123)"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Subscription Plan & Expiry Calculation */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Subscription & Expiry Settings</span>
            </h3>

            {/* Plan selection buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div
                onClick={() => handlePlanChange('6 Months')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                  formData.plan === '6 Months'
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">6 Month Plan</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                    ₹4,999 + GST
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Standard 6-month validity</p>
              </div>

              <div
                onClick={() => handlePlanChange('12 Months')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                  formData.plan === '12 Months'
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">12 Month Plan (Year Long)</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                    ₹7,999 + GST
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Full 365-day annual subscription</p>
              </div>
            </div>

            {/* Start Date & Expiry Date Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subscription Start Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Subscription Expiry Date *
                  </label>
                  {isManualExpiry ? (
                    <button
                      type="button"
                      onClick={() => setIsManualExpiry(false)}
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      Reset to Auto-Calculate
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-600 font-medium">
                      Auto-calculated from plan
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="date"
                    required
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                      isManualExpiry
                        ? 'border-amber-400 bg-amber-50/30 focus:ring-amber-500'
                        : 'border-slate-300 bg-slate-50 focus:ring-blue-500 focus:bg-white'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Admin can manually change this date anytime or keep the auto-calculated date.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('admin-users')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create User Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
