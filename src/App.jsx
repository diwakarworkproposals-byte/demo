import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Toast } from './components/common/Toast';

// Landing & Auth
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';

// Admin views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminAddUser } from './components/admin/AdminAddUser';
import { AdminSubscriptions } from './components/admin/AdminSubscriptions';
import { AdminExpiry } from './components/admin/AdminExpiry';
import { AdminReports } from './components/admin/AdminReports';
import { AdminSettings } from './components/admin/AdminSettings';

// User views
import { UserDashboard } from './components/user/UserDashboard';
import { CustomersView } from './components/user/CustomersView';
import { ProductsView } from './components/user/ProductsView';
import { PurchasesView } from './components/user/PurchasesView';
import { CreateInvoiceView } from './components/user/CreateInvoiceView';
import { InvoiceHistoryView } from './components/user/InvoiceHistoryView';
import { SalesReportsView } from './components/user/SalesReportsView';
import { UserSettings } from './components/user/UserSettings';
import { InvoicePreviewModal } from './components/user/InvoicePreviewModal';

import { ShieldAlert, AlertTriangle } from 'lucide-react';

const MainContent = () => {
  const { currentUser, isAdmin, isUser, isExpired } = useAuth();
  const [currentView, setCurrentView] = useState('landing');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState(null);
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);

  // Security Check: A user must not be able to access admin pages
  const isTryingToAccessAdmin = currentView.startsWith('admin');
  if (isTryingToAccessAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
        />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl mat-shadow-md border border-rose-200 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Standard users are strictly prohibited from accessing the system administrator portal.
            </p>
            <button
              onClick={() => setCurrentView('user-dashboard')}
              className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Return to User Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Full Screen Views (Landing & Login)
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
        />
        <LandingPage setCurrentView={setCurrentView} />
        <Toast />
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
        />
        <LoginPage setCurrentView={setCurrentView} />
        <Toast />
      </div>
    );
  }

  // Dashboard Layout (Sidebar + Main Content)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
        />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 overflow-y-auto w-full min-w-0 pb-16 lg:pb-0">
          {/* Admin Routes */}
          {currentView === 'admin-dashboard' && (
            <AdminDashboard
              setCurrentView={setCurrentView}
              setSelectedUserForModal={setSelectedUserForModal}
            />
          )}
          {currentView === 'admin-users' && (
            <AdminUsers
              setCurrentView={setCurrentView}
              selectedUserForModal={selectedUserForModal}
              setSelectedUserForModal={setSelectedUserForModal}
            />
          )}
          {currentView === 'admin-add-user' && (
            <AdminAddUser setCurrentView={setCurrentView} />
          )}
          {currentView === 'admin-subscriptions' && (
            <AdminSubscriptions />
          )}
          {currentView === 'admin-expiry' && (
            <AdminExpiry />
          )}
          {currentView === 'admin-reports' && (
            <AdminReports />
          )}
          {currentView === 'admin-settings' && (
            <AdminSettings />
          )}

          {/* User Routes */}
          {currentView === 'user-dashboard' && (
            <UserDashboard
              setCurrentView={setCurrentView}
              setSelectedInvoiceForPreview={setSelectedInvoiceForPreview}
            />
          )}
          {currentView === 'user-customers' && (
            <CustomersView />
          )}
          {currentView === 'user-products' && (
            <ProductsView setCurrentView={setCurrentView} />
          )}
          {currentView === 'user-purchases' && (
            <PurchasesView />
          )}
          {currentView === 'user-create-invoice' && (
            <CreateInvoiceView
              setCurrentView={setCurrentView}
              setSelectedInvoiceForPreview={setSelectedInvoiceForPreview}
            />
          )}
          {currentView === 'user-invoice-history' && (
            <InvoiceHistoryView
              setCurrentView={setCurrentView}
              setSelectedInvoiceForPreview={setSelectedInvoiceForPreview}
            />
          )}
          {currentView === 'user-sales-reports' && (
            <SalesReportsView />
          )}
          {currentView === 'user-settings' && (
            <UserSettings />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      {/* Global Invoice Preview / PDF Download Modal */}
      {selectedInvoiceForPreview && (
        <InvoicePreviewModal
          invoice={selectedInvoiceForPreview}
          isDraft={false}
          onClose={() => setSelectedInvoiceForPreview(null)}
        />
      )}

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AuthProvider>
  );
}
