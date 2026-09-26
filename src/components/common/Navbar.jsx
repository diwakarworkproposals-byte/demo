import React, { useState } from 'react';
import {
  FileText,
  UserCheck,
  ShieldAlert,
  LogOut,
  LogIn,
  ChevronDown,
  Building,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from './Badge';

export const Navbar = ({ currentView, setCurrentView, mobileNavOpen, setMobileNavOpen }) => {
  const { currentUser, loginAs, logout, isAdmin, isUser, isExpired, isExpiringSoon, daysRemaining } = useAuth();
  const { users, resetToDemoData } = useApp();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [landingMobileMenuOpen, setLandingMobileMenuOpen] = useState(false);

  const activeUser = users.find((u) => u.id === 'user-01') || users[0];
  const expiringUser = users.find((u) => u.id === 'user-02') || users[1];
  const expiredUser = users.find((u) => u.id === 'user-03') || users[2];

  const isDashboardView = currentView.startsWith('admin') || currentView.startsWith('user');

  const handleMobileMenuClick = () => {
    if (isDashboardView && setMobileNavOpen) {
      setMobileNavOpen(!mobileNavOpen);
    } else {
      setLandingMobileMenuOpen(!landingMobileMenuOpen);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 mat-shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Drawer Trigger + Logo & Subtitle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger on mobile for dashboard */}
            {isDashboardView && (
              <button
                type="button"
                onClick={handleMobileMenuClick}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-center border border-slate-200 shadow-2xs mr-1"
                aria-label="Open navigation menu"
              >
                {mobileNavOpen ? <X className="w-5 h-5 text-blue-600" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView('landing')}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                <span className="font-bold text-lg sm:text-xl tracking-tight">AB</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 font-display">
                    ASAN BILL
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                    SaaS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Simple Stock Management & Billing
                </p>
              </div>
            </div>
          </div>

          {/* Center Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'landing'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Public Home
            </button>

            {currentUser && (
              <>
                {isAdmin ? (
                  <button
                    onClick={() => setCurrentView('admin-dashboard')}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                      currentView.startsWith('admin')
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Admin Portal
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentView('user-dashboard')}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors ${
                      currentView.startsWith('user')
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    User Dashboard
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Right Action & Demo Switcher (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Demo Profile Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                title="Quickly switch between Admin, Active User, and Expired User accounts"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Switcher:</span>
                <span className="font-semibold text-blue-700 truncate max-w-[120px]">
                  {currentUser ? (isAdmin ? 'Admin' : currentUser.name.split(' ')[0]) : 'Logged Out'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdown && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setProfileDropdown(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                    Switch Test Account
                  </div>
                  <button
                    onClick={() => {
                      loginAs('admin');
                      setCurrentView('admin-dashboard');
                      setProfileDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center justify-between text-slate-800"
                  >
                    <div>
                      <div className="font-medium text-blue-700">👑 System Admin</div>
                      <div className="text-[11px] text-slate-500">Full control over users & SaaS</div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-semibold">Admin</span>
                  </button>

                  <button
                    onClick={() => {
                      if (activeUser) {
                        loginAs('user', activeUser);
                        setCurrentView('user-dashboard');
                      }
                      setProfileDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center justify-between text-slate-800"
                  >
                    <div>
                      <div className="font-medium text-emerald-800">🟢 Rajesh Kumar</div>
                      <div className="text-[11px] text-slate-500">Shree Balaji Ent. (12M Plan)</div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">Active</span>
                  </button>

                  <button
                    onClick={() => {
                      if (expiringUser) {
                        loginAs('user', expiringUser);
                        setCurrentView('user-dashboard');
                      }
                      setProfileDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-amber-50 flex items-center justify-between text-slate-800"
                  >
                    <div>
                      <div className="font-medium text-amber-800">🟡 Vikram Sharma</div>
                      <div className="text-[11px] text-slate-500">Metro Hardware (Expiring soon)</div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold">5 Days</span>
                  </button>

                  <button
                    onClick={() => {
                      if (expiredUser) {
                        loginAs('user', expiredUser);
                        setCurrentView('user-dashboard');
                      }
                      setProfileDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center justify-between text-slate-800"
                  >
                    <div>
                      <div className="font-medium text-rose-800">🔴 Sunil Patel (Expired)</div>
                      <div className="text-[11px] text-slate-500">Apex Tech (Expired Aug 2026)</div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-semibold">Expired</span>
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1 px-3">
                    <button
                      onClick={() => {
                        resetToDemoData();
                        setProfileDropdown(false);
                      }}
                      className="w-full py-1.5 text-center text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1.5 text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Initial Demo Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                    {currentUser.businessName || 'Admin'}
                    {isUser && <StatusBadge status={currentUser.status} />}
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setCurrentView('landing');
                  }}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </button>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            {currentUser ? (
              <button
                onClick={handleMobileMenuClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold"
              >
                <Menu className="w-4 h-4" />
                <span>Menu</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu for Landing Page (when logged out or on landing) */}
      {!isDashboardView && landingMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in fade-in">
          <button
            onClick={() => {
              setCurrentView('landing');
              setLandingMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-md font-medium text-slate-700 hover:bg-slate-50"
          >
            Public Home
          </button>
          <button
            onClick={() => {
              setCurrentView('login');
              setLandingMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-md font-medium text-blue-700 hover:bg-blue-50"
          >
            Sign In to Dashboard
          </button>
        </div>
      )}
    </header>
  );
};
