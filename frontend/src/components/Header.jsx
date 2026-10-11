import React from 'react';
import { ShoppingBag, Sparkles, Download, Play, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { getExportUrl } from '../api';

export default function Header({ apiHealthy, onOpenSimulator, onRefresh, loading }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          
          {/* Left Brand block */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-md shadow-amber-100 flex-shrink-0 border border-amber-200">
              <ShoppingBag className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold tracking-wider uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Sapphire IQ
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  • Brilliant Minds. Intelligent Solutions.
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                BlinkIT Grocery Sales Analysis
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Student Project
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Analyst: <strong className="text-slate-700">Ram</strong> • Domain: Retail & Grocery Sales Analytics • Python, Pandas, NumPy, Matplotlib, Seaborn
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Status Pill */}
            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
              apiHealthy
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {apiHealthy ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
              <span>{apiHealthy ? 'API Connected (Port 5002)' : 'Connecting to API...'}</span>
            </div>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Scenario Simulator Modal */}
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Scenario Simulator</span>
            </button>

            {/* Export Cleaned CSV */}
            <a
              href={getExportUrl()}
              download="BlinkIT_Grocery_Cleaned_Data.csv"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm hover:shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Cleaned Data</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
