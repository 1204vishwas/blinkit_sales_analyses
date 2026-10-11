import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import { ArrowUpRight, TrendingUp, Award, MapPin, Building2, Layers } from 'lucide-react';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#64748B'];

export default function OverviewTab({ obj1Data, obj3Data, onNavigateTab }) {
  if (!obj1Data || !obj3Data) {
    return <div className="text-center py-12 text-slate-400">Loading Executive Overview...</div>;
  }

  const categoryData = obj1Data.productTypes?.slice(0, 8) || [];
  const locationTierData = obj1Data.locationTiers || [];
  const outletTypeData = obj3Data.outletTypePerformance || [];

  return (
    <div className="space-y-6">
      
      {/* Banner / Strategic Context */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="text-xs font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full">
            Sapphire IQ Executive Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            BlinkIT Quick Commerce Sales & Operations Analysis
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            A comprehensive study of <strong>8,523 grocery transactions</strong> across 10 strategic retail outlets in Tier 1, 2, and 3 cities. 
            Overall gross revenue stands at <strong>$1.20M (₹1.20M)</strong>, driven by fast-moving grocery staples and strong presence in Tier 3 growth corridors.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/60">
            <div>
              <p className="text-xs text-slate-400">Top Revenue Category</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">Fruits & Vegetables</p>
              <p className="text-xs text-slate-400">$178.1k (14.8%)</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Top Performing Format</p>
              <p className="text-base font-bold text-amber-400 mt-0.5">Supermarket Type 1</p>
              <p className="text-xs text-slate-400">$787.5k (65.5%)</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Top Location Tier</p>
              <p className="text-base font-bold text-cyan-400 mt-0.5">Tier 3 Cities</p>
              <p className="text-xs text-slate-400">$472.1k (39.3%)</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Customer Satisfaction</p>
              <p className="text-base font-bold text-purple-400 mt-0.5">3.97 / 5.00 Stars</p>
              <p className="text-xs text-slate-400">Consistent Quality</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Category Revenue & Outlet Type Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Product Categories */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Top Revenue Drivers by Product Category
              </h3>
              <p className="text-xs text-slate-500">Total gross sales across high-velocity product types</p>
            </div>
            <button
              onClick={() => onNavigateTab('obj1')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View All 16 <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  fontSize={11}
                  stroke="#64748B"
                />
                <YAxis
                  type="category"
                  dataKey="itemType"
                  fontSize={11}
                  stroke="#64748B"
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Total Sales']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="totalSales" fill="#2563EB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Tier Revenue Distribution */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Sales Share by Location Tier
              </h3>
              <span className="text-xs text-slate-400">Geographic Footprint</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Revenue breakdown across Tier 1, Tier 2, and Tier 3 markets</p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationTierData}
                    dataKey="sales"
                    nameKey="tier"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                    paddingAngle={4}
                  >
                    {locationTierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Sales']}
                    contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70 text-xs text-slate-600 mt-2">
            <span className="font-semibold text-slate-800">Key Insight:</span> Tier 3 represents the largest revenue generator ($472k, 39.3%), indicating significant quick grocery expansion potential beyond Tier 1 metropolitan centers.
          </div>
        </div>

      </div>

      {/* Outlet Type Performance Grid */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              Outlet Format Breakdown
            </h3>
            <p className="text-xs text-slate-500">Performance benchmarking between Supermarkets and Grocery Stores</p>
          </div>
          <button
            onClick={() => onNavigateTab('obj3')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Explore Drivers <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {outletTypeData.map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">{item.type}</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {item.sharePct}% share
                </span>
              </div>
              <p className="text-xl font-extrabold text-slate-900">${(item.totalSales || 0).toLocaleString()}</p>
              <div className="flex justify-between items-center text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
                <span>Items: <strong>{(item.count || 0).toLocaleString()}</strong></span>
                <span>Avg/Item: <strong>${item.avgSales}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
