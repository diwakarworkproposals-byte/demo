import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, WifiOff, CheckCircle2, Share } from 'lucide-react';

export const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // 1. Check if already running in standalone / installed PWA mode
    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    setIsStandalone(checkStandalone);

    // 2. Check if iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 3. Listen for beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.__pwaInstallPrompt = e;

      // Only show if user hasn't dismissed it in this session
      const dismissed = sessionStorage.getItem('asan_bill_pwa_dismissed');
      if (!dismissed && !checkStandalone) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Listen for app installed event
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('[PWA] ASAN BILL installed to Home Screen');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 5. Online / Offline status listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] Install prompt outcome:', outcome);

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('asan_bill_pwa_dismissed', 'true');
  };

  return (
    <>
      {/* 1. Offline Mode Banner */}
      {isOffline && (
        <aside
          role="status"
          aria-label="Offline Mode Notification"
          className="bg-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md"
        >
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>Offline Mode Active — ASAN BILL is working locally. Data is saved in browser storage.</span>
        </aside>
      )}

      {/* 2. PWA Install Floating Banner (Shown on mobile/desktop browsers before installation) */}
      {!isStandalone && showPrompt && deferredPrompt && (
        <div className="fixed bottom-18 lg:bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/60 backdrop-blur-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                AB
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Install ASAN BILL</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 font-semibold">Web App</span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Add to home screen for faster full-screen stock management.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                aria-label="Dismiss install banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. iOS Safari Instructions Hint (If user is on iOS and not standalone) */}
      {!isStandalone && isIos && !sessionStorage.getItem('asan_bill_ios_dismissed') && (
        <div className="hidden sm:hidden fixed bottom-18 left-3 right-3 z-50">
          <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Share className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-[11px]">
                Install on iPhone: tap <strong>Share</strong> then <strong>'Add to Home Screen'</strong>
              </span>
            </div>
            <button
              onClick={() => {
                sessionStorage.setItem('asan_bill_ios_dismissed', 'true');
                setIsIos(false);
              }}
              className="text-slate-400 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
