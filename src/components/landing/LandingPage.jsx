import React from 'react';
import {
  Check,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Package,
  FileText,
  ShieldCheck,
  Zap,
  Users,
  Smartphone,
  Printer,
  Calculator,
  HelpCircle,
  Building,
  Sparkles
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../data/initialData';
import { formatCurrency } from '../../utils/helpers';

export const LandingPage = ({ setCurrentView }) => {
  const scrollToPricing = () => {
    const el = document.getElementById('pricing-plans');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>GST Ready Billing & Inventory SaaS — Designed for Indian Retailers, Wholesalers & Distributors</span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Tag pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-6">
            <span>Simple Stock Management & Billing</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight font-display max-w-4xl mx-auto leading-tight">
            ASAN BILL
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-700 max-w-3xl mx-auto">
            Manage Stock. Create Bills. Track Sales. Grow Your Business.
          </p>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A simple and powerful billing and stock management solution for businesses. Real-time inventory tracking, automatic GST calculations, profit tracking on every invoice, and instant PDF invoice downloads.
          </p>

          {/* Hero Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentView('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToPricing}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base border border-slate-300 shadow-sm transition-all hover:-translate-y-0.5"
            >
              View Plans
            </button>
          </div>

          {/* Hero Interactive App Mockup Preview */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-white p-3 sm:p-4 mat-shadow-lg border border-slate-200/80 text-left">
            <div className="bg-slate-900 rounded-xl p-3 sm:p-6 text-white overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-400 ml-2 font-mono">ASAN BILL • Retailer Dashboard</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Stock Engine
                </span>
              </div>

              {/* Mockup Dashboard Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <div className="text-[11px] text-slate-400">Today's Sales</div>
                  <div className="text-xl font-bold text-white mt-1">₹7,490.64</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">↑ 18% vs yesterday</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <div className="text-[11px] text-slate-400">Today's Profit</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">₹1,948.00</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Real margin tracked</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <div className="text-[11px] text-slate-400">Current Stock Items</div>
                  <div className="text-xl font-bold text-white mt-1">102 Units</div>
                  <div className="text-[10px] text-blue-400 mt-0.5">In-stock valuation</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <div className="text-[11px] text-slate-400">Low Stock Warning</div>
                  <div className="text-xl font-bold text-rose-400 mt-1">2 Items</div>
                  <div className="text-[10px] text-rose-300 mt-0.5">Re-order required</div>
                </div>
              </div>

              {/* Sample Invoice preview row */}
              <div className="mt-4 bg-slate-800/40 rounded-lg p-3 border border-slate-700/60 hidden sm:flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="font-semibold text-white">ASB-2026-0003</span>
                    <span className="text-slate-400 ml-2">Sunrise General Stores (Intra-State CGST+SGST)</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-emerald-400 font-bold">₹3,773.64</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px]">Paid</span>
                  <span className="text-slate-400">Profit: ₹1,298.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core SaaS Highlights */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Everything Your Business Needs To Operate Seamlessly
            </h2>
            <p className="mt-3 text-slate-600">
              Engineered with Google Material Design principles for simplicity, speed, and zero learning curve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all mat-shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Intelligent Stock Control</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Stock increases automatically when purchases arrive and decreases instantly when invoices are generated. Prevents over-selling with real-time stock limits.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-200 transition-all mat-shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Real-Time Profit Tracking</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Know your exact profit on every single bill. Automatically calculates: (Selling Price - Purchase Price) × Quantity minus discounts allocated per line item.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all mat-shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">GST-Ready Billing & PDF Invoices</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Supports CGST + SGST for intra-state sales and IGST for inter-state transactions. Configurable tax rates (0%, 5%, 12%, 18%, 28%) and clean PDF downloads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section id="pricing-plans" className="py-20 bg-slate-50 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Transparent Pricing
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Simple, Affordable Subscription Plans
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              No hidden fees. Pick the duration that fits your business stage.
            </p>
            <div className="mt-2 text-sm font-semibold text-amber-700 bg-amber-50 inline-block px-4 py-1.5 rounded-lg border border-amber-200">
              Note: GST is additional (+18% applicable under government regulations).
            </div>
          </div>

          {/* Two attractive pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isYearly = plan.id === 'plan_12m';

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-3xl p-8 transition-all duration-200 bg-white ${
                    isYearly
                      ? 'border-2 border-blue-600 shadow-xl shadow-blue-500/10'
                      : 'border border-slate-200 mat-shadow-1'
                  }`}
                >
                  {/* Badge */}
                  {isYearly && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">Duration: <strong className="text-slate-700">{plan.durationText}</strong></p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                        {plan.priceDisplay}
                      </span>
                      <span className="text-sm font-semibold text-rose-600 uppercase tracking-wide">
                        {plan.gstNote}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                      <span>Equivalent to ~{plan.effectivePerMonth} billed upfront</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="flex-1 space-y-3 mb-8">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Everything included:
                    </div>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Get Started Button */}
                  <button
                    onClick={() => setCurrentView('login')}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                      isYearly
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center mt-3 text-[11px] text-slate-400">
                    Instant onboarding by System Admin
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Customer Trust / Testimonials */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {'★'.repeat(5)}
              </div>
              <p className="text-sm text-slate-700 italic">
                "ASAN BILL solved our stock mismatch problems. We can never oversell stock anymore because the invoice engine stops it automatically."
              </p>
              <div className="mt-4 font-bold text-xs text-slate-900">Rajesh Kumar</div>
              <div className="text-[11px] text-slate-500">Shree Balaji Enterprises, Mumbai</div>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {'★'.repeat(5)}
              </div>
              <p className="text-sm text-slate-700 italic">
                "The profit calculation on each invoice is incredible. I can see my exact daily margin without doing complicated Excel math."
              </p>
              <div className="mt-4 font-bold text-xs text-slate-900">Vikram Sharma</div>
              <div className="text-[11px] text-slate-500">Metro Hardware & Electricals, Delhi</div>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {'★'.repeat(5)}
              </div>
              <p className="text-sm text-slate-700 italic">
                "Generating PDF invoices with CGST/SGST breakdown takes less than 15 seconds. Customers are impressed by our professional bills."
              </p>
              <div className="mt-4 font-bold text-xs text-slate-900">Ananya Verma</div>
              <div className="text-[11px] text-slate-500">Green Organic Stores, Bengaluru</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                AB
              </div>
              <div>
                <span className="font-bold text-white tracking-wide">ASAN BILL</span>
                <span className="text-xs text-slate-400 ml-2">Simple Stock Management & Billing</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400">
              <span>GST Compliance Ready</span>
              <span>•</span>
              <span>Material Design UI</span>
              <span>•</span>
              <span>Cloud & Local Sync</span>
            </div>

            <div className="text-xs text-slate-500">
              © {new Date().getFullYear()} ASAN BILL. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
