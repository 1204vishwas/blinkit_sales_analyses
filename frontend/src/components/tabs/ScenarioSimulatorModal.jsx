import React, { useState, useEffect } from 'react';
import { X, Sparkles, TrendingUp, DollarSign, ArrowRight, RotateCcw } from 'lucide-react';
import { simulateScenario } from '../../api';

export default function ScenarioSimulatorModal({ isOpen, onClose }) {
  const [groceryBoost, setGroceryBoost] = useState(25);
  const [visBoost, setVisBoost] = useState(15);
  const [coreCategoryPush, setCoreCategoryPush] = useState(8);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await simulateScenario({
        groceryExpansionPct: groceryBoost,
        visibilityBoostPct: visBoost,
        topCategoryPushPct: coreCategoryPush
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runSimulation();
    }
  }, [isOpen, groceryBoost, visBoost, coreCategoryPush]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Executive Growth Scenario Modeler</h3>
              <p className="text-xs text-slate-500">Sapphire IQ Decision Support System for BlinkIT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          
          {/* Controls */}
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Grocery Store SKU Expansion:</span>
                <span className="text-indigo-600 font-bold">+{groceryBoost}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={groceryBoost}
                onChange={(e) => setGroceryBoost(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Increases catalog in OUT010 & OUT019 towards supermarket parity</p>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>App Visibility Optimization:</span>
                <span className="text-indigo-600 font-bold">+{visBoost}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={visBoost}
                onChange={(e) => setVisBoost(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Re-ranks high-demand SKUs to prime app shelf spots</p>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Core Category Campaign Push:</span>
                <span className="text-indigo-600 font-bold">+{coreCategoryPush}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={coreCategoryPush}
                onChange={(e) => setCoreCategoryPush(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Focuses marketing on Fruits & Veg and Snack Foods</p>
            </div>

            <button
              onClick={() => { setGroceryBoost(25); setVisBoost(15); setCoreCategoryPush(8); }}
              className="inline-flex items-center space-x-1 text-[11px] text-slate-500 hover:text-slate-700 font-medium pt-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          {/* Results Display */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
            {result ? (
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Projected Total Sales</p>
                  <p className="text-2xl font-extrabold text-slate-900">${(result.projectedSales).toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500">From baseline ${(result.baseSales).toLocaleString()}</p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-emerald-800 font-bold uppercase">Incremental Revenue</p>
                    <p className="text-lg font-extrabold text-emerald-700">+${(result.incrementalRevenue).toLocaleString()}</p>
                  </div>
                  <span className="text-xs font-extrabold bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                    +{result.growthPercentage}%
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Grocery Expansion Lift:</span>
                    <span className="font-semibold text-slate-800">+${result.breakdown?.groceryStoreExpansionGain?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visibility Optimization:</span>
                    <span className="font-semibold text-slate-800">+${result.breakdown?.visibilityOptimizationGain?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Core Category Push:</span>
                    <span className="font-semibold text-slate-800">+${result.breakdown?.coreCategoryPushGain?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">Simulating model outcomes...</div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Apply to Strategy Session
          </button>
        </div>

      </div>
    </div>
  );
}
