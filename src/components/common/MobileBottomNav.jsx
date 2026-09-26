import React from 'react';
import {
  LayoutDashboard,
  Package,
  FilePlus,
  Receipt,
  Users,
  UserPlus,
  Clock,
  Menu,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const MobileBottomNav = ({ currentView, setCurrentView, mobileNavOpen, setMobileNavOpen }) => {
  const { currentUser, isAdmin, isUser, isExpired } = useAuth();
  const { products, users } = useApp();

  // If not logged in or on landing/login page, do not render bottom nav
  if (!currentUser || currentView === 'landing' || currentView === 'login') {
    return null;
  }

  const lowStockCount = isUser
    ? products.filter((p) => p.currentStock <= p.minStockLevel).length
    : 0;

  const expiredCount = isAdmin
    ? users.filter((u) => u.status === 'expired' || u.status === 'expiring_soon').length
    : 0;

  const userItems = [
    { id: 'user-dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'user-products', label: 'Stock', icon: Package, badge: lowStockCount > 0 ? lowStockCount : null },
    {
      id: 'user-create-invoice',
      label: '+ Bill',
      icon: FilePlus,
      highlight: true,
      disabled: isExpired
    },
    { id: 'user-invoice-history', label: 'Bills', icon: Receipt },
  ];

  const adminItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-users', label: 'Users', icon: Users, badge: users.length },
    { id: 'admin-add-user', label: '+ User', icon: UserPlus, highlight: true },
    { id: 'admin-expiry', label: 'Expiry', icon: Clock, badge: expiredCount > 0 ? expiredCount : null },
  ];

  const items = isAdmin ? adminItems : userItems;

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const isDisabled = item.disabled;

          if (item.highlight) {
            return (
              <button
                key={item.id}
                disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled) setCurrentView(item.id);
                }}
                className={`relative -top-3 flex flex-col items-center justify-center p-2 rounded-2xl shadow-lg transition-transform active:scale-95 ${
                  isDisabled
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-blue-500/30 ring-4 ring-white'
                }`}
                title={isDisabled ? 'Subscription expired' : item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold tracking-tight mt-0.5">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) setCurrentView(item.id);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-rose-500 text-white text-[9px] font-bold rounded-full min-w-3.5 h-3.5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-[60px]">{item.label}</span>
            </button>
          );
        })}

        {/* More / Menu Drawer Toggle */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            mobileNavOpen ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Toggle full mobile menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1 font-medium">Menu</span>
        </button>
      </div>
    </nav>
  );
};
