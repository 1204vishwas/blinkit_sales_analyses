import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';

export default function FilterBar({ filters, activeFilters, onChange, onReset }) {
  if (!filters) return null;

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== '');

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        
        {/* Left Label */}
        <div className="flex items-center space-x-2 text-slate-700 font-semibold text-xs flex-shrink-0">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Interactive Slicers:</span>
          {hasActiveFilters && (
            <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-200">
              Filtered
            </span>
          )}
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 flex-1">
          {/* Category */}
          <select
            value={activeFilters.category || ''}
            onChange={(e) => onChange('category', e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="">All Categories ({filters.categories?.length || 16})</option>
            {filters.categories?.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Outlet Type */}
          <select
            value={activeFilters.outletType || ''}
            onChange={(e) => onChange('outletType', e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="">All Outlet Types</option>
            {filters.outletTypes?.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Location Tier */}
          <select
            value={activeFilters.locationTier || ''}
            onChange={(e) => onChange('locationTier', e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="">All Location Tiers</option>
            {filters.locationTiers?.map((tier) => (
              <option key={tier} value={tier}>{tier}</option>
            ))}
          </select>

          {/* Outlet Size */}
          <select
            value={activeFilters.outletSize || ''}
            onChange={(e) => onChange('outletSize', e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="">All Outlet Sizes</option>
            {filters.outletSizes?.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>

          {/* Fat Content */}
          <select
            value={activeFilters.fatContent || ''}
            onChange={(e) => onChange('fatContent', e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="">All Fat Content</option>
            {filters.fatContents?.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg font-medium border border-rose-200 transition-colors flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}

      </div>
    </div>
  );
}
