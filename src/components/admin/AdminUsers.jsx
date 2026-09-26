import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  Lock,
  Calendar,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Eye,
  KeyRound,
  Clock,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, addMonthsToDate, formatCurrency } from '../../utils/helpers';
import { StatusBadge } from '../common/Badge';

export const AdminUsers = ({ setCurrentView, selectedUserForModal, setSelectedUserForModal }) => {
  const { users, updateUser, deleteUser, toggleUserStatus, resetUserPassword, extendSubscription } = useApp();
  const { loginAs } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Expiring Soon', 'Expired'

  // Modal states
  const [viewModalUser, setViewModalUser] = useState(selectedUserForModal || null);
  const [editModalUser, setEditModalUser] = useState(null);
  const [planModalUser, setPlanModalUser] = useState(null);
  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [deleteModalUser, setDeleteModalUser] = useState(null);

  // Forms inside modals
  const [editFormData, setEditFormData] = useState({});
  const [newPlanDuration, setNewPlanDuration] = useState('6 Months');
  const [customExpiry, setCustomExpiry] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Filtering
  const filteredUsers = users.filter((u) => {
    // Search match
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.businessName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.username.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Status filter
    if (statusFilter === 'Active') return u.status === 'active';
    if (statusFilter === 'Expiring Soon') return u.status === 'expiring_soon';
    if (statusFilter === 'Expired') return u.status === 'expired';
    return true;
  });

  // Action handlers
  const openEditModal = (user) => {
    setEditFormData({ ...user });
    setEditModalUser(user);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateUser(editModalUser.id, editFormData);
    setEditModalUser(null);
  };

  const openPlanModal = (user) => {
    setPlanModalUser(user);
    setNewPlanDuration(user.plan || '6 Months');
    setCustomExpiry(user.expiryDate);
  };

  const handlePlanSubmit = (e) => {
    e.preventDefault();
    updateUser(planModalUser.id, {
      plan: newPlanDuration,
      expiryDate: customExpiry,
      status: 'active'
    });
    setPlanModalUser(null);
  };

  const openPasswordModal = (user) => {
    setPasswordModalUser(user);
    setNewPassword('');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    resetUserPassword(passwordModalUser.id, newPassword.trim());
    setPasswordModalUser(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteModalUser) {
      deleteUser(deleteModalUser.id);
      setDeleteModalUser(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>User Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage subscriber accounts, edit business profiles, reset credentials, and modify subscription plans.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('admin-add-user')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mat-shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, business, email, phone..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Filter Pills: All, Active, Expiring Soon, Expired */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>
          {['All', 'Active', 'Expiring Soon', 'Expired'].map((filterName) => {
            const count =
              filterName === 'All'
                ? users.length
                : filterName === 'Active'
                ? users.filter((u) => u.status === 'active').length
                : filterName === 'Expiring Soon'
                ? users.filter((u) => u.status === 'expiring_soon').length
                : users.filter((u) => u.status === 'expired').length;

            return (
              <button
                key={filterName}
                onClick={() => setStatusFilter(filterName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  statusFilter === filterName
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{filterName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === filterName ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 mat-shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">User / Username</th>
                <th className="py-3 px-4 font-semibold">Business Name</th>
                <th className="py-3 px-4 font-semibold">Contact</th>
                <th className="py-3 px-4 font-semibold">Plan</th>
                <th className="py-3 px-4 font-semibold">Start Date</th>
                <th className="py-3 px-4 font-semibold">Expiry Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                          {user.name.substring(0, 1)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-[11px] text-slate-400">@{user.username}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      <div>{user.businessName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {user.gstNumber || 'Unregistered'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{user.email}</div>
                      <div className="text-[11px] text-slate-400">{user.phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {user.plan}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {formatDate(user.startDate)}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {formatDate(user.expiryDate)}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View Details */}
                        <button
                          onClick={() => setViewModalUser(user)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View User Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit User */}
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Change Plan / Expiry */}
                        <button
                          onClick={() => openPlanModal(user)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Extend / Change Subscription Plan"
                        >
                          <Clock className="w-4 h-4" />
                        </button>

                        {/* Reset Password */}
                        <button
                          onClick={() => openPasswordModal(user)}
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        {/* Toggle Disable / Activate */}
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.status === 'disabled'
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-amber-600 hover:bg-amber-50'
                          }`}
                          title={user.status === 'disabled' ? 'Activate User' : 'Disable User'}
                        >
                          {user.status === 'disabled' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => setDeleteModalUser(user)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Impersonate Log in */}
                        <button
                          onClick={() => {
                            loginAs('user', user);
                            setCurrentView('user-dashboard');
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Log In As User"
                        >
                          <ExternalLink className="w-4 h-4" />
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

      {/* --- MODAL 1: VIEW USER DETAILS --- */}
      {viewModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 mat-shadow-lg border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>Subscriber Profile</span>
              </h3>
              <button
                onClick={() => {
                  setViewModalUser(null);
                  if (setSelectedUserForModal) setSelectedUserForModal(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="text-base font-bold text-slate-900">{viewModalUser.businessName}</div>
                  <div className="text-slate-500">{viewModalUser.name} (@{viewModalUser.username})</div>
                </div>
                <StatusBadge status={viewModalUser.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">EMAIL</span>
                  <span className="font-mono">{viewModalUser.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">PHONE</span>
                  <span>{viewModalUser.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">GSTIN</span>
                  <span className="font-mono">{viewModalUser.gstNumber || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">STATE</span>
                  <span>{viewModalUser.state}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">ADDRESS</span>
                  <span>{viewModalUser.address || 'N/A'}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="font-bold text-blue-900 mb-1">Subscription Overview</div>
                <div className="grid grid-cols-3 gap-2 text-slate-700">
                  <div>
                    <span className="text-[10px] text-blue-600 block">PLAN</span>
                    <strong>{viewModalUser.plan}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-600 block">START</span>
                    <strong>{formatDate(viewModalUser.startDate)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-600 block">EXPIRY</span>
                    <strong>{formatDate(viewModalUser.expiryDate)}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800 mb-1">Bank / Settlement Details</div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <div>Bank: <strong>{viewModalUser.bankDetails?.bankName}</strong></div>
                  <div>A/C: <strong>{viewModalUser.bankDetails?.accountNumber}</strong> | IFSC: <strong>{viewModalUser.bankDetails?.ifsc}</strong></div>
                  <div>UPI: <strong>{viewModalUser.bankDetails?.upiId}</strong></div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  loginAs('user', viewModalUser);
                  setCurrentView('user-dashboard');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
              >
                Log In As User
              </button>
              <button
                onClick={() => {
                  setViewModalUser(null);
                  if (setSelectedUserForModal) setSelectedUserForModal(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: EDIT USER --- */}
      {editModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 mat-shadow-lg border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
              Edit User Details: {editModalUser.businessName}
            </h3>

            <form onSubmit={handleEditSubmit} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.businessName || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, businessName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mobile</label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">GSTIN</label>
                <input
                  type="text"
                  value={editFormData.gstNumber || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, gstNumber: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Address</label>
                <input
                  type="text"
                  value={editFormData.address || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalUser(null)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: CHANGE PLAN / EXPIRY DATE --- */}
      {planModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 mat-shadow-lg border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Modify Subscription & Expiry</span>
            </h3>

            <form onSubmit={handlePlanSubmit} className="py-4 space-y-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Target Account:</span>
                <strong className="text-slate-800 text-sm">{planModalUser.businessName}</strong>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Select Plan</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewPlanDuration('6 Months');
                      setCustomExpiry(addMonthsToDate(new Date().toISOString().split('T')[0], 6));
                    }}
                    className={`p-2.5 rounded-lg border text-left font-medium ${
                      newPlanDuration === '6 Months'
                        ? 'border-blue-600 bg-blue-50 text-blue-800'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="font-bold">6 Months</div>
                    <div className="text-[10px] text-slate-500">₹4,999 + GST</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewPlanDuration('12 Months');
                      setCustomExpiry(addMonthsToDate(new Date().toISOString().split('T')[0], 12));
                    }}
                    className={`p-2.5 rounded-lg border text-left font-medium ${
                      newPlanDuration === '12 Months'
                        ? 'border-blue-600 bg-blue-50 text-blue-800'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="font-bold">12 Months</div>
                    <div className="text-[10px] text-slate-500">₹7,999 + GST</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={customExpiry}
                  onChange={(e) => setCustomExpiry(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-900"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Adjust manually to extend by custom days, or select a preset plan above.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPlanModalUser(null)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Update & Reactivate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: RESET PASSWORD --- */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 mat-shadow-lg border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-purple-600" />
              <span>Reset Password</span>
            </h3>

            <form onSubmit={handlePasswordSubmit} className="py-4 space-y-3 text-xs">
              <p className="text-slate-600">
                Assign a new password for <strong>@{passwordModalUser.username}</strong>:
              </p>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-900 text-sm font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 5: DELETE CONFIRMATION --- */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 mat-shadow-lg border border-slate-200">
            <h3 className="font-bold text-base text-rose-700 pb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600" />
              <span>Confirm Delete User</span>
            </h3>
            <p className="text-xs text-slate-600 py-2 leading-relaxed">
              Are you sure you want to permanently delete <strong>{deleteModalUser.name}</strong> ({deleteModalUser.businessName})? This action cannot be undone.
            </p>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
