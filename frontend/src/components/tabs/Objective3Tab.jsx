import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { TrendingUp, GitCompare, ScatterChart as ScatterIcon, Layers, Award, AlertCircle, ArrowRight } from 'lucide-react';

export default function Objective3Tab({ data }) {
  if (!data) return <div className="text-center py-12 text-slate-400">Loading Objective 3 Data...</div>;

  const { outletTypePerformance, crossTabData, correlationMatrix, scatterSample, benchmark } = data;
  const [scatterMode, setScatterMode] = useState('visibility'); // 'visibility' | 'weight' | 'rating'

  return (
    <div className="space-y-6">
      
      {/* Objective Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                OBJECTIVE 3
              </span>
              <span className="text-xs text-slate-400">Sapphire IQ Task 3.1 - 3.4</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Find Out What Is Driving Better Sales Performance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multivariate exploratory analysis: product category sales volume, outlet type dynamics, feature correlations, and store benchmarking.
            </p>
          </div>
          <div className="bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500">Key Performance Driver:</span>
            <p className="font-bold text-slate-900 mt-0.5">Store Catalog Depth & Location Tier</p>
          </div>
        </div>

        {/* 4 Task Quick Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs font-bold text-slate-900">Task 3.1: Top Selling Items</p>
            <p className="text-[11px] text-slate-600">Fruits/Veg & Snacks lead at $353.5k+</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs font-bold text-slate-900">Task 3.2: Outlet Performance</p>
            <p className="text-[11px] text-slate-600">Supermarket Type 1 generates 65.5%</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs font-bold text-slate-900">Task 3.3: Correlation Matrix</p>
            <p className="text-[11px] text-slate-600">Visibility & weight correlation assessed</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs font-bold text-slate-900">Task 3.4: Comparative Matrix</p>
            <p className="text-[11px] text-slate-600">Supermarkets vs Grocery Stores gap analyzed</p>
          </div>
        </div>
      </div>

      {/* Task 3.2: Outlet Types & Cross-tabulation */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Task 3.2: Which Types of Outlets Are Performing Better?
            </h3>
            <p className="text-xs text-slate-500">Comparison of outlet formats across sales volume, average transaction size, and market share</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {outletTypePerformance?.map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-blue-400 transition-all">
              <span className="text-xs font-bold text-slate-700">{item.type}</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">${(item.totalSales).toLocaleString()}</p>
              <div className="mt-2 space-y-1 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Revenue Share:</span>
                  <span className="font-bold text-blue-700">{item.sharePct}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Transactions:</span>
                  <span className="font-semibold text-slate-700">{(item.count).toLocaleString()} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Average / Item:</span>
                  <span className="font-semibold text-slate-700">${item.avgSales}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task 3.3: Correlation Matrix & Scatter Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Correlation Heatmap Table */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Task 3.3: Correlation Heatmap Matrix
            </h3>
            <p className="text-xs text-slate-500">Pearson correlation coefficient (r) between continuous variables</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold text-[10px]">
                  <th className="p-2 text-left">Variable</th>
                  <th className="p-2">Sales</th>
                  <th className="p-2">Vis</th>
                  <th className="p-2">Weight</th>
                  <th className="p-2">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {correlationMatrix?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-semibold text-left text-slate-900 font-sans">{row.variable}</td>
                    <td className={`p-2 font-bold ${row.Sales === 1 ? 'bg-blue-600 text-white' : Math.abs(row.Sales) > 0.02 ? 'bg-blue-100 text-blue-800' : 'bg-slate-50 text-slate-600'}`}>
                      {row.Sales.toFixed(3)}
                    </td>
                    <td className={`p-2 font-bold ${row.Visibility === 1 ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600'}`}>
                      {row.Visibility.toFixed(3)}
                    </td>
                    <td className={`p-2 font-bold ${row.Weight === 1 ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600'}`}>
                      {row.Weight.toFixed(3)}
                    </td>
                    <td className={`p-2 font-bold ${row.Rating === 1 ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600'}`}>
                      {row.Rating.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">Analytical Finding:</p>
            <p>Product Sales exhibit low linear correlation with Item Weight (+0.026) and Item Visibility (-0.006). Sales are primarily determined by product category demand elasticity and store format availability, rather than physical package size alone.</p>
          </div>
        </div>

        {/* Scatter Plot Visualizer */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ScatterIcon className="w-4 h-4 text-purple-600" />
                Feature Relationship Scatter Visualizer
              </h3>
              <p className="text-xs text-slate-500">Inspect how continuous attributes plot against Sales ($)</p>
            </div>

            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setScatterMode('visibility')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${scatterMode === 'visibility' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Visibility vs Sales
              </button>
              <button
                onClick={() => setScatterMode('weight')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${scatterMode === 'weight' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Weight vs Sales
              </button>
              <button
                onClick={() => setScatterMode('rating')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${scatterMode === 'rating' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Rating vs Sales
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  dataKey={scatterMode === 'visibility' ? 'visibility' : scatterMode === 'weight' ? 'weight' : 'rating'}
                  name={scatterMode === 'visibility' ? 'Visibility (%)' : scatterMode === 'weight' ? 'Weight (kg)' : 'Rating'}
                  fontSize={11}
                  stroke="#64748B"
                  unit={scatterMode === 'visibility' ? '%' : scatterMode === 'weight' ? 'kg' : '★'}
                />
                <YAxis
                  type="number"
                  dataKey="sales"
                  name="Sales"
                  unit="$"
                  fontSize={11}
                  stroke="#64748B"
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(val, name) => [val, name]}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Scatter name="Items" data={scatterSample} fill="#6366F1" opacity={0.65} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Task 3.4: Comparative Matrix Benchmark */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-emerald-600" />
              Task 3.4: Compare Better-Performing and Lower-Performing Outlets
            </h3>
            <p className="text-xs text-slate-500">Benchmark variance between Top Tier Supermarkets and Under-indexing Grocery Stores</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Top Performers */}
          <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase">
                <Award className="w-4 h-4 text-emerald-600" /> Top Performing Outlets
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Avg Sales ~$132,000
              </span>
            </div>
            
            <div className="space-y-2.5">
              {benchmark?.topPerformingOutlets?.map((out) => (
                <div key={out.id} className="bg-white p-3 rounded-lg border border-emerald-100 text-xs flex justify-between items-center shadow-2xs">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm">{out.id}</span>
                    <span className="ml-2 text-slate-500">{out.type} • {out.tier}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-sm">${(out.sales).toLocaleString()}</span>
                    <p className="text-[10px] text-slate-400">{out.count} items cataloged</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lower Performers */}
          <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Underperforming Outlets
              </span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Avg Sales ~$75,900
              </span>
            </div>

            <div className="space-y-2.5">
              {benchmark?.lowerPerformingOutlets?.map((out) => (
                <div key={out.id} className="bg-white p-3 rounded-lg border border-amber-100 text-xs shadow-2xs">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm">{out.id}</span>
                      <span className="ml-2 text-slate-500">{out.type} • {out.tier}</span>
                    </div>
                    <span className="font-bold text-amber-700 text-sm">${(out.sales).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>{out.count} items stocked</span>
                    <span className="text-amber-800 font-semibold">{out.gap}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 bg-white p-2.5 rounded-lg border border-amber-200 text-[11px] text-slate-600">
              <span className="font-bold text-amber-900">Root Cause:</span> Grocery store formats have 42% fewer SKUs in inventory (~540 vs ~930). Adding high-demand pantry essentials directly bridges this gap.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
