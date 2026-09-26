import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Building,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDIAN_STATES } from '../../utils/helpers';

export const CustomersView = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add', 'edit', 'view'
  const [activeCustomer, setActiveCustomer] = useState(null);

  const initialForm = {
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gstNumber: '',
    state: 'Maharashtra',
    stateCode: '27',
    pincode: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) ||
      c.phone.includes(q) ||
      (c.gstNumber && c.gstNumber.toLowerCase().includes(q)) ||
      c.state.toLowerCase().includes(q)
    );
  });

  const openAddModal = () => {
    setFormData(initialForm);
    setModalMode('add');
  };

  const openEditModal = (cust) => {
    setActiveCustomer(cust);
    setFormData({ ...cust });
    setModalMode('edit');
  };

  const openViewModal = (cust) => {
    setActiveCustomer(cust);
    setModalMode('view');
  };

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
    if (modalMode === 'add') {
      addCustomer(formData);
    } else if (modalMode === 'edit') {
      updateCustomer(activeCustomer.id, formData);
    }
    setModalMode(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete customer "${name}"?`)) {
      deleteCustomer(id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Customers & B2B Companies</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain customer directories, GSTIN registration data, and billing addresses.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Customer</span>
        </button>
      </div>

      {/* Search Bar & Stats */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, GSTIN, phone, state..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong className="text-slate-800">{filteredCustomers.length}</strong> of {customers.length} customers
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Customer / Company</th>
                <th className="py-3 px-4 font-semibold">Contact Person</th>
                <th className="py-3 px-4 font-semibold">Phone / Email</th>
                <th className="py-3 px-4 font-semibold">GSTIN</th>
                <th className="py-3 px-4 font-semibold">State / Place of Supply</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No customers found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 border border-blue-200">
                          {cust.name.substring(0, 1)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{cust.name}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{cust.address}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {cust.contactPerson || '-'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{cust.phone}</div>
                      <div className="text-[10px] text-slate-400">{cust.email || '-'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {cust.gstNumber ? (
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800">
                          {cust.gstNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unregistered</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{cust.state}</div>
                      <div className="text-[10px] text-slate-400">Code: {cust.stateCode}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openViewModal(cust)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(cust)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cust.id, cust.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Customer"
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

      {/* MODAL: ADD / EDIT CUSTOMER */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 mat-shadow-lg border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              <span>{modalMode === 'add' ? 'Add New Customer / Company' : 'Edit Customer Details'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apex Hardware Trading Co."
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Rajeev Gupta"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="accounts@apex.com"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">GST Number</label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                    placeholder="27AADCO8899P1ZK"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Billing Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, shop number, area"
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">State / Jurisdiction *</label>
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
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="400001"
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-sm"
                  />
                </div>
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
                  {modalMode === 'add' ? 'Save Customer' : 'Update Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW CUSTOMER */}
      {modalMode === 'view' && activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 mat-shadow-lg border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Customer Details</h3>
              <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-base font-bold text-slate-900">{activeCustomer.name}</div>
                <div className="text-slate-500">Contact: {activeCustomer.contactPerson || 'N/A'}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">PHONE</span>
                  <strong>{activeCustomer.phone}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">EMAIL</span>
                  <span className="font-mono">{activeCustomer.email || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">GSTIN</span>
                  <span className="font-mono font-bold text-blue-700">{activeCustomer.gstNumber || 'Unregistered'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">STATE</span>
                  <span>{activeCustomer.state} (Code: {activeCustomer.stateCode})</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">ADDRESS</span>
                  <span>{activeCustomer.address || '-'} (PIN: {activeCustomer.pincode || '-'})</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setModalMode(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
