import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts';
import { Lightbulb, Target, Sparkles, TrendingUp, CheckCircle, ChevronRight, Zap, AlertTriangle } from 'lucide-react';
import { simulateScenario } from '../../api';

export default function Objective4Tab({ data, onOpenSimulator }) {
  if (!data) return <div className="text-center py-12 text-slate-400">Loading Objective 4 Data...</div>;

  const { pareto, highPotentialItems, practicalSuggestions } = data;

  // Simulator inline state
  const [groceryBoost, setGroceryBoost] = useState(25);
  const [visBoost, setVisBoost] = useState(15);
  const [coreCategoryPush, setCoreCategoryPush] = useState(5);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const handleInlineSimulate = async () => {
    setSimulating(true);
    try {
      const res = await simulateScenario({
        groceryExpansionPct: groceryBoost,
        visibilityBoostPct: visBoost,
        topCategoryPushPct: coreCategoryPush
      });
      setSimulationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Objective Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                OBJECTIVE 4
              </span>
              <span className="text-xs text-slate-400">Sapphire IQ Task 4.1 - 4.4</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Help Management Make Better Business Decisions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Actionable strategic roadmap: Pareto product concentration, store expansion blueprints, merchandising adjustments, and scenario modeling.
            </p>
          </div>
          
          <button
            onClick={onOpenSimulator}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Executive Simulator</span>
          </button>
        </div>

        {/* 4 Task Quick Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs font-bold text-slate-900">Task 4.1: Pareto Analysis</p>
            <p className="text-[11px] text-slate-600">Top 20% SKUs generate {pareto?.top20Pct}% sales</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs font-bold text-slate-900">Task 4.2: Top Outlets & Hubs</p>
            <p className="text-[11px] text-slate-600">Tier 3 & Tier 2 deliver $865k (72% gross)</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs font-bold text-slate-900">Task 4.3: Turnaround Areas</p>
            <p className="text-[11px] text-slate-600">Grocery stores catalog depth expansion</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-xs font-bold text-slate-900">Task 4.4: Strategic Actions</p>
            <p className="text-[11px] text-slate-600">5 high-impact business pillars proposed</p>
          </div>
        </div>
      </div>

      {/* Task 4.1: Pareto 80/20 Analysis */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Task 4.1: Product Sales Concentration (Pareto Analysis)
            </h3>
            <p className="text-xs text-slate-500">Cumulative sales contribution curve across 1,559 distinct items</p>
          </div>
          <div className="text-xs bg-blue-50 text-blue-800 font-bold px-3 py-1 rounded-full border border-blue-200">
            Top 20% ({pareto?.top20Count} items) = {pareto?.top20Pct}% Revenue
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pareto?.paretoPoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="itemPct"
                fontSize={11}
                stroke="#64748B"
                unit="%"
                label={{ value: 'Percentage of Catalog (%)', position: 'insideBottom', offset: -5, fontSize: 11 }}
              />
              <YAxis
                fontSize={11}
                stroke="#64748B"
                unit="%"
                label={{ value: 'Cumulative Sales (%)', angle: -90, position: 'insideLeft', fontSize: 11 }}
              />
              <Tooltip
                formatter={(val) => [`${val}%`, 'Cumulative Sales']}
                contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
              />
              <ReferenceLine x={20} stroke="#EF4444" strokeDasharray="4 4" label={{ value: '20% Cutoff', fill: '#EF4444', fontSize: 10 }} />
              <ReferenceLine y={pareto?.top20Pct} stroke="#10B981" strokeDasharray="4 4" label={{ value: `${pareto?.top20Pct}% Sales`, fill: '#10B981', fontSize: 10 }} />
              <Line type="monotone" dataKey="cumulativeSalesPct" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-600">
          <span className="font-bold text-slate-800">Pareto Insight for Ram & Management:</span> Revenue is distributed across high-frequency daily groceries. Maintaining 100% in-stock rates on the top {pareto?.top20Count} hero SKUs protects over $439,000 in baseline revenue.
        </div>
      </div>

      {/* Task 4.3: Low Visibility High Potential Items */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Task 4.3: High-Potential Items with Below-Average Visibility
            </h3>
            <p className="text-xs text-slate-500">Products demonstrating strong sales velocity despite receiving below-average app/store visibility</p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            Opportunity SKUs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Item Identifier</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Outlet Store</th>
                <th className="py-2.5 px-3 text-right">Current Visibility</th>
                <th className="py-2.5 px-3 text-right">Sales ($)</th>
                <th className="py-2.5 px-3 text-right">Rating</th>
                <th className="py-2.5 px-3 text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {highPotentialItems?.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{item.identifier}</td>
                  <td className="py-2.5 px-3 font-medium">{item.type}</td>
                  <td className="py-2.5 px-3 text-slate-500">{item.outlet}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-rose-600">{item.visibility}% (Low)</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">${item.sales}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-amber-600">{item.rating} ★</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Boost Search Slot
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task 4.4: Strategic Recommendations Roadmap */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Task 4.4: Practical Suggestions to Improve Sales and Overall Business Performance
            </h3>
            <p className="text-xs text-slate-500">Executive recommendations tailored for Sapphire IQ leadership</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {practicalSuggestions?.map((sug, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{sug.pillar}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                    sug.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {sug.priority} Priority
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{sug.recommendation}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{sug.rationale}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-xs">
                <span className="text-slate-400 font-medium">Expected Business Impact:</span>
                <p className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  {sug.expectedImpact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Scenario Modeling Widget */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-400/30">
              Interactive What-If Scenario Modeler
            </span>
            <h3 className="text-xl font-extrabold mt-3">Simulate Growth Strategies</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Adjust levers to project incremental top-line impact for BlinkIT outlets and categories.
            </p>

            <div className="space-y-4 mt-6">
              {/* Slider 1 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Grocery Store SKU Expansion:</span>
                  <span className="font-bold text-amber-400">+{groceryBoost}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={groceryBoost}
                  onChange={(e) => setGroceryBoost(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Merchandising Visibility Boost:</span>
                  <span className="font-bold text-emerald-400">+{visBoost}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="5"
                  value={visBoost}
                  onChange={(e) => setVisBoost(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Slider 3 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Core Categories Marketing Push:</span>
                  <span className="font-bold text-cyan-400">+{coreCategoryPush}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="2"
                  value={coreCategoryPush}
                  onChange={(e) => setCoreCategoryPush(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <button
                onClick={handleInlineSimulate}
                disabled={simulating}
                className="w-full mt-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-lg text-xs transition-colors shadow-md"
              >
                {simulating ? 'Computing Projection...' : 'Calculate Financial Projections'}
              </button>
            </div>
          </div>

          {/* Results card */}
          <div className="flex-1 bg-slate-800/80 rounded-xl p-5 border border-slate-700">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Projected Business Impact</h4>
            
            {simulationResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700">
                    <p className="text-[10px] text-slate-400">Baseline Revenue</p>
                    <p className="text-lg font-bold text-slate-200">${(simulationResult.baseSales).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700">
                    <p className="text-[10px] text-emerald-400">Projected Revenue</p>
                    <p className="text-lg font-bold text-emerald-400">${(simulationResult.projectedSales).toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-emerald-300 font-semibold">Incremental Top-Line Gain</p>
                    <p className="text-xl font-extrabold text-white">+${(simulationResult.incrementalRevenue).toLocaleString()}</p>
                  </div>
                  <span className="text-sm font-extrabold bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-full">
                    +{simulationResult.growthPercentage}%
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-700">
                  <div className="flex justify-between">
                    <span>Grocery Expansion Gain:</span>
                    <span className="font-bold text-slate-200">+${simulationResult.breakdown?.groceryStoreExpansionGain?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visibility Optimization Gain:</span>
                    <span className="font-bold text-slate-200">+${simulationResult.breakdown?.visibilityOptimizationGain?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Core Category Push Gain:</span>
                    <span className="font-bold text-slate-200">+${simulationResult.breakdown?.coreCategoryPushGain?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Adjust sliders and click <strong>"Calculate Financial Projections"</strong> to view modeled sales outcomes.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
