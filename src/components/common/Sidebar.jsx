import React, { useEffect } from 'react';
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
  Lock,
  X,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const Sidebar = ({ currentView, setCurrentView, mobileNavOpen, setMobileNavOpen }) => {
  const { currentUser, logout, isAdmin, isUser, isExpired, isExpiringSoon, daysRemaining, loginAs } = useAuth();
  const { products, users, resetToDemoData } = useApp();

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileNavOpen) {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileNavOpen, setMobileNavOpen]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileNavOpen]);

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

  const handleNavClick = (id, isDisabled) => {
    if (isDisabled) return;
    setCurrentView(id);
    if (setMobileNavOpen) setMobileNavOpen(false);
  };

  const activeUser = users.find((u) => u.id === 'user-01') || users[0];
  const expiringUser = users.find((u) => u.id === 'user-02') || users[1];
  const expiredUser = users.find((u) => u.id === 'user-03') || users[2];

  // Reusable content for both Desktop sidebar and Mobile drawer
  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full">
      {/* Account Profile Header Card in Sidebar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs ${
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

          {/* Close button inside mobile drawer */}
          {isMobile && (
            <button
              onClick={() => setMobileNavOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
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
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
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
              onClick={() => handleNavClick(item.id, isDisabled)}
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

        {/* Mobile Extra: Demo Account Quick Switcher */}
        {isMobile && (
          <div className="pt-4 mt-4 border-t border-slate-200">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo Quick Switch:</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 px-1">
              <button
                onClick={() => {
                  loginAs('admin');
                  setCurrentView('admin-dashboard');
                  setMobileNavOpen(false);
                }}
                className="p-2 text-left bg-blue-50/80 hover:bg-blue-100 rounded-lg text-xs font-semibold text-blue-800"
              >
                👑 Admin
              </button>
              <button
                onClick={() => {
                  if (activeUser) {
                    loginAs('user', activeUser);
                    setCurrentView('user-dashboard');
                  }
                  setMobileNavOpen(false);
                }}
                className="p-2 text-left bg-emerald-50/80 hover:bg-emerald-100 rounded-lg text-xs font-semibold text-emerald-800"
              >
                🟢 Rajesh (Active)
              </button>
              <button
                onClick={() => {
                  if (expiringUser) {
                    loginAs('user', expiringUser);
                    setCurrentView('user-dashboard');
                  }
                  setMobileNavOpen(false);
                }}
                className="p-2 text-left bg-amber-50/80 hover:bg-amber-100 rounded-lg text-xs font-semibold text-amber-800"
              >
                🟡 Vikram (Soon)
              </button>
              <button
                onClick={() => {
                  if (expiredUser) {
                    loginAs('user', expiredUser);
                    setCurrentView('user-dashboard');
                  }
                  setMobileNavOpen(false);
                }}
                className="p-2 text-left bg-rose-50/80 hover:bg-rose-100 rounded-lg text-xs font-semibold text-rose-800"
              >
                🔴 Sunil (Expired)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout button at bottom */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <button
          onClick={() => {
            logout();
            setCurrentView('landing');
            if (isMobile) setMobileNavOpen(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Permanent Sidebar (Hidden on mobile/tablet, visible on lg and up) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex-col shrink-0">
        {renderSidebarContent(false)}
      </aside>

      {/* 2. Mobile / Tablet Responsive Drawer Overlay (When hamburger is clicked) */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop with click-to-dismiss */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Off-canvas Drawer Panel */}
          <nav
            aria-label="Mobile Navigation Drawer"
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200"
          >
            {renderSidebarContent(true)}
          </nav>
        </div>
      )}
    </>
  );
};
