import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSettings = () => {
  const { resetToDemoData, showToast } = useApp();
  const [platformName, setPlatformName] = useState('ASAN BILL');
  const [supportEmail, setSupportEmail] = useState('support@asanbill.com');
  const [gstRate, setGstRate] = useState(18);

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Admin configuration saved.', 'success');
  };

  return (
    <div className="p-3.5 sm:p-6 max-w-4xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          <span>Admin Platform Settings</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure global platform parameters, subscription taxation, and demo data controls.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm p-6 space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                SaaS Brand Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Platform Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Subscription GST Rate (%)
              </label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </form>

        <div className="pt-6 border-t border-slate-200">
          <h4 className="font-bold text-sm text-slate-900 mb-1">Database & Demo Data Reset</h4>
          <p className="text-xs text-slate-500 mb-3">
            Reset all modified users, stock levels, purchases, and invoices back to the pristine factory initial seed data.
          </p>
          <button
            type="button"
            onClick={resetToDemoData}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
