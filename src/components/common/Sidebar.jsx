import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CreditCard,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  Package,
  ShoppingCart,
  FilePlus,
  Receipt,
  TrendingUp,
  AlertCircle,
  Building2,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const Sidebar = ({ currentView, setCurrentView }) => {
  const { currentUser, logout, isAdmin, isUser, isExpired, isExpiringSoon, daysRemaining } = useAuth();
  const { products, users } = useApp();

  // Count low stock products for the current user
  const lowStockCount = isUser
    ? products.filter((p) => p.currentStock <= p.minStockLevel).length
    : 0;

  // Count expiring soon or expired users for admin
  const expiredCount = isAdmin
    ? users.filter((u) => u.status === 'expired').length
    : 0;
  const expiringSoonCount = isAdmin
    ? users.filter((u) => u.status === 'expiring_soon').length
    : 0;

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-users', label: 'Users', icon: Users, badge: users.length },
    { id: 'admin-add-user', label: 'Add User', icon: UserPlus },
    { id: 'admin-subscriptions', label: 'Subscription Mgmt', icon: CreditCard },
    {
      id: 'admin-expiry',
      label: 'Account Expiry',
      icon: Clock,
      badge: expiredCount + expiringSoonCount > 0 ? `${expiredCount + expiringSoonCount}` : null,
      badgeColor: 'bg-rose-100 text-rose-700'
    },
    { id: 'admin-reports', label: 'Reports', icon: BarChart3 },
    { id: 'admin-settings', label: 'Settings', icon: Settings }
  ];

  const userNavItems = [
    { id: 'user-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-customers', label: 'Customers', icon: Users },
    {
      id: 'user-products',
      label: 'Products / Stock',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { id: 'user-purchases', label: 'Purchases', icon: ShoppingCart },
    {
      id: 'user-create-invoice',
      label: 'Create Invoice',
      icon: FilePlus,
      disabled: isExpired,
      disabledTooltip: 'Subscription expired. Contact admin to renew.'
    },
    { id: 'user-invoice-history', label: 'Invoice History', icon: Receipt },
    { id: 'user-sales-reports', label: 'Sales Reports', icon: TrendingUp },
    { id: 'user-settings', label: 'Settings', icon: Settings }
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col shrink-0">
      {/* Account Profile Header Card in Sidebar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
            isAdmin ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            {isAdmin ? 'AD' : (currentUser?.name?.substring(0, 2).toUpperCase() || 'UB')}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-slate-800 truncate">
              {currentUser?.name || 'Guest User'}
            </h4>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
              {currentUser?.businessName || (isAdmin ? 'SaaS Admin' : 'Retailer')}
            </p>
          </div>
        </div>

        {/* Expiry Warning Box inside User Sidebar */}
        {isUser && (
          <div className="mt-3">
            {isExpired ? (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Account Expired</span>
                  <p className="text-[11px] text-rose-600 mt-0.5 leading-snug">
                    Billing disabled. Please contact admin to renew.
                  </p>
                </div>
              </div>
            ) : isExpiringSoon ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-800 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Renews Soon</span>
                  <p className="text-[11px] text-amber-700 mt-0.5 leading-snug">
                    {daysRemaining} days left in {currentUser?.plan}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-lg px-2.5 py-1.5 text-xs text-emerald-800 flex items-center justify-between">
                <span className="text-[11px] font-medium text-emerald-700">Plan: {currentUser?.plan}</span>
                <span className="text-[10px] bg-emerald-200/60 px-1.5 py-0.5 rounded text-emerald-800 font-semibold">Active</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {isAdmin ? 'Platform Administration' : 'Business Operations'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) setCurrentView(item.id);
              }}
              title={isDisabled ? item.disabledTooltip : ''}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isDisabled
                  ? 'opacity-50 cursor-not-allowed bg-slate-50 text-slate-400'
                  : isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {isDisabled && (
                <Lock className="w-3.5 h-3.5 text-slate-400 ml-auto" />
              )}

              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    item.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout button at bottom */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={() => {
            logout();
            setCurrentView('landing');
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
