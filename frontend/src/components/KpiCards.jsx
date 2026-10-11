import React from 'react';
import { DollarSign, Package, TrendingUp, Star, Eye, Store } from 'lucide-react';

export default function KpiCards({ overview }) {
  if (!overview) return null;

  const cards = [
    {
      title: 'Total Sales Revenue',
      value: `$${(overview.totalSales || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `₹${(overview.totalSales || 0).toLocaleString()} (Overall Gross)`,
      icon: DollarSign,
      color: 'from-blue-600 to-indigo-600',
      badge: 'All 10 Outlets',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Total Items Cataloged',
      value: (overview.totalItems || 0).toLocaleString(),
      subtitle: 'Across 16 Product Categories',
      icon: Package,
      color: 'from-emerald-600 to-teal-600',
      badge: '1,559 Unique SKUs',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      title: 'Average Sales / Item',
      value: `$${(overview.averageSales || 0).toFixed(2)}`,
      subtitle: 'Range: $31.29 to $266.89',
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
      badge: 'Std Dev: $62.28',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      title: 'Average Customer Rating',
      value: `${(overview.averageRating || 0).toFixed(2)} ★`,
      subtitle: 'High overall consumer trust',
      icon: Star,
      color: 'from-violet-600 to-purple-600',
      badge: 'Scale: 1.0 - 5.0',
      badgeColor: 'bg-violet-100 text-violet-800'
    },
    {
      title: 'Avg Shelf Visibility',
      value: `${overview.averageVisibility || 0}%`,
      subtitle: '526 zero-vis records imputed',
      icon: Eye,
      color: 'from-cyan-600 to-blue-600',
      badge: 'Normalized',
      badgeColor: 'bg-cyan-100 text-cyan-800'
    },
    {
      title: 'Operational Outlets',
      value: `${overview.outletCount || 10} Outlets`,
      subtitle: 'Tier 1, Tier 2 & Tier 3 Cities',
      icon: Store,
      color: 'from-rose-500 to-pink-600',
      badge: 'Top: OUT035',
      badgeColor: 'bg-rose-100 text-rose-800'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 my-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                {card.badge}
              </span>
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-sm`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-1">
              <h3 className="text-xs font-semibold text-slate-500 truncate" title={card.title}>
                {card.title}
              </h3>
              <p className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
                {card.value}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 truncate" title={card.subtitle}>
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
