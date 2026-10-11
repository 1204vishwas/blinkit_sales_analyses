import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import { ShoppingCart, Store, DollarSign, Star, CheckCircle, Info } from 'lucide-react';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#64748B'];

export default function Objective1Tab({ data }) {
  if (!data) return <div className="text-center py-12 text-slate-400">Loading Objective 1 Data...</div>;

  const { productTypes, outlets, locationTiers, outletSizes, salesHistogram, ratingBuckets, salesMetrics, ratingMetrics } = data;

  return (
    <div className="space-y-6">
      
      {/* Objective Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                OBJECTIVE 1
              </span>
              <span className="text-xs text-slate-400">Sapphire IQ Task 1.1 - 1.4</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Understand the Business and Its Sales Performance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Analyzing BlinkIT product catalog composition, physical outlet footprint, gross transaction revenues, and customer ratings.
            </p>
          </div>
          <div className="flex items-center space-x-4 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Revenue</p>
              <p className="text-sm font-bold text-slate-900">${(salesMetrics?.total || 0).toLocaleString()}</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Avg Customer Rating</p>
              <p className="text-sm font-bold text-amber-600">{ratingMetrics?.mean} ★</p>
            </div>
          </div>
        </div>

        {/* 4 Task Quick Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="bg-blue-50/60 rounded-lg p-3 border border-blue-100 flex items-start space-x-2.5">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900">Task 1.1: Product Types</p>
              <p className="text-[11px] text-slate-600">16 Item categories, 1,559 unique SKUs</p>
            </div>
          </div>
          <div className="bg-emerald-50/60 rounded-lg p-3 border border-emerald-100 flex items-start space-x-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900">Task 1.2: Outlet Footprint</p>
              <p className="text-[11px] text-slate-600">10 Outlets across Tier 1, 2, and 3 cities</p>
            </div>
          </div>
          <div className="bg-amber-50/60 rounded-lg p-3 border border-amber-100 flex items-start space-x-2.5">
            <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900">Task 1.3: Sales Performance</p>
              <p className="text-[11px] text-slate-600">$1,201,681.49 overall gross sales</p>
            </div>
          </div>
          <div className="bg-purple-50/60 rounded-lg p-3 border border-purple-100 flex items-start space-x-2.5">
            <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900">Task 1.4: Rating Analysis</p>
              <p className="text-[11px] text-slate-600">Mean 3.97 ⭐ across 8,523 reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task 1.1 Section: Product Catalog */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              Task 1.1: Product Types Sold by BlinkIT
            </h3>
            <p className="text-xs text-slate-500">Breakdown of inventory, sales volume, and customer rating across 16 categories</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded text-slate-700">
            16 Categories Analyzed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Item Type</th>
                <th className="py-2.5 px-3 text-right">Items Count</th>
                <th className="py-2.5 px-3 text-right">Total Revenue</th>
                <th className="py-2.5 px-3 text-right">Avg Sales / Item</th>
                <th className="py-2.5 px-3 text-right">Revenue Share</th>
                <th className="py-2.5 px-3 text-right">Avg Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {productTypes?.map((pt, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    {pt.itemType}
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium">{(pt.count).toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">${(pt.totalSales).toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right">${pt.avgSales}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700">
                      {pt.sharePct}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-amber-600">
                    {pt.avgRating} ★
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task 1.2 Section: Outlets Footprint */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-600" />
              Task 1.2: Outlets Types, Sizes, and Geographic Locations
            </h3>
            <p className="text-xs text-slate-500">Profiles of all 10 BlinkIT fulfillment stores across Tier 1, Tier 2, and Tier 3</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
            10 Active Stores
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {outlets?.map((outlet) => (
            <div
              key={outlet.outletId}
              className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 hover:border-emerald-400 transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm text-slate-900">{outlet.outletId}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  outlet.size === 'High' ? 'bg-purple-100 text-purple-800' :
                  outlet.size === 'Medium' ? 'bg-blue-100 text-blue-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {outlet.size} Size
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700">{outlet.type}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{outlet.location} • Est. {outlet.establishmentYear} ({outlet.age} yrs old)</p>
              
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Total Sales</p>
                  <p className="font-bold text-slate-900">${(outlet.totalSales).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Inventory</p>
                  <p className="font-medium text-slate-700">{outlet.itemCount} SKUs</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task 1.3 & Task 1.4: Sales & Ratings Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales Distribution Histogram */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Task 1.3: Overall Sales Distribution Histogram
            </h3>
            <span className="text-xs text-slate-400">Mean: ${salesMetrics?.mean}</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Transaction frequencies grouped across price ranges</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesHistogram}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="range" fontSize={10} stroke="#64748B" angle={-25} textAnchor="end" height={45} />
                <YAxis fontSize={11} stroke="#64748B" />
                <Tooltip
                  formatter={(val) => [`${val} transactions`, 'Frequency']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Ratings Distribution */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              Task 1.4: Customer Ratings Distribution
            </h3>
            <span className="text-xs text-slate-400">Mean: {ratingMetrics?.mean} ★</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Review score breakdown across customer ratings (1.0 to 5.0)</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="label" fontSize={11} stroke="#64748B" />
                <YAxis fontSize={11} stroke="#64748B" />
                <Tooltip
                  formatter={(val) => [`${val} reviews`, 'Count']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
