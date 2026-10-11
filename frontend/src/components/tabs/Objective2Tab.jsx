import React, { useState } from 'react';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw, Database, FileText, ArrowRight, Check, HelpCircle
} from 'lucide-react';

export default function Objective2Tab({ data }) {
  if (!data) return <div className="text-center py-12 text-slate-400">Loading Objective 2 Data...</div>;

  const { auditOverview, missingValues, duplicates, outliersAndAnomalies, standardization } = data;
  const [activeSubTab, setActiveSubTab] = useState('all');

  return (
    <div className="space-y-6">
      
      {/* Objective Header Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                OBJECTIVE 2
              </span>
              <span className="text-xs text-slate-400">Sapphire IQ Task 2.1 - 2.4</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Make Sure the Available Information Is Reliable
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive data quality audit, missing value imputation, anomaly detection, and categorical standardization.
            </p>
          </div>
          
          {/* Quality Scorecard Badge */}
          <div className="flex items-center space-x-3 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="text-[10px] text-emerald-700 uppercase font-bold">Data Quality Score</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 line-through">78.4% Raw</span>
                <span className="text-base font-extrabold text-emerald-700">100.0% Cleaned</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Task Quick Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900">Task 2.1: Missing Values</p>
              <p className="text-[11px] text-slate-600">1,463 missing Item Weights resolved</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900">Task 2.2: Duplicate Records</p>
              <p className="text-[11px] text-slate-600">0 exact duplicate rows found</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900">Task 2.3: Outliers & Anomalies</p>
              <p className="text-[11px] text-slate-600">526 zero-visibility anomalies fixed</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900">Task 2.4: Standardization</p>
              <p className="text-[11px] text-slate-600">5 fat content labels unified to 2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task 2.1: Missing Values Audit & Resolution */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              Task 2.1: Audit of Missing Values in Records
            </h3>
            <p className="text-xs text-slate-500">Analysis of null fields and two-tier imputation strategy</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-700 rounded border border-amber-200">
            1,463 Missing Values Detected in Raw Data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Column Name</th>
                <th className="py-2.5 px-3 text-right">Raw Missing Count</th>
                <th className="py-2.5 px-3 text-right">Raw Missing %</th>
                <th className="py-2.5 px-3 text-left">Audit Status & Treatment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {missingValues?.attributes?.map((attr, idx) => (
                <tr key={idx} className={attr.missingCount > 0 ? 'bg-amber-50/40 font-semibold' : 'hover:bg-slate-50/80'}>
                  <td className="py-2 px-3 text-slate-900 font-mono text-[11px]">{attr.column}</td>
                  <td className="py-2 px-3 text-right">
                    {attr.missingCount > 0 ? (
                      <span className="text-rose-600 font-bold">{attr.missingCount.toLocaleString()}</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">0</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {attr.missingPct > 0 ? (
                      <span className="text-rose-600 font-bold">{attr.missingPct}%</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">0.0%</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-left">
                    {attr.missingCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        <Check className="w-3 h-3 text-blue-600" />
                        {attr.status}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" /> Complete
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Imputation Method Box */}
        <div className="mt-4 bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs text-slate-600">
          <p className="font-bold text-slate-800 mb-1">Methodology Applied for Item Weight:</p>
          <p className="leading-relaxed">
            {missingValues?.imputationMethod}
          </p>
        </div>
      </div>

      {/* Task 2.4: Categorical Standardization Before vs After */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-purple-600" />
              Task 2.4: Standardize Similar Information for Proper Comparison
            </h3>
            <p className="text-xs text-slate-500">Harmonizing inconsistent spelling and labels in <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700">Item Fat Content</code></p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200">
            545 Inconsistent Labels Corrected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Before Harmonization */}
          <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Before Standardization (Raw Data)</span>
              <span className="text-xs font-semibold text-rose-600">5 Distinct Labels</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between items-center bg-white p-2 rounded border border-rose-100 font-mono">
                <span>"Low Fat"</span>
                <span className="font-bold text-slate-700">5,089 records</span>
              </li>
              <li className="flex justify-between items-center bg-white p-2 rounded border border-rose-100 font-mono">
                <span>"Regular"</span>
                <span className="font-bold text-slate-700">2,889 records</span>
              </li>
              <li className="flex justify-between items-center bg-white p-2 rounded border border-rose-200 text-rose-700 font-mono">
                <span>"LF" (Abbreviation)</span>
                <span className="font-bold">316 records ⚠️</span>
              </li>
              <li className="flex justify-between items-center bg-white p-2 rounded border border-rose-200 text-rose-700 font-mono">
                <span>"reg" (Abbreviation)</span>
                <span className="font-bold">117 records ⚠️</span>
              </li>
              <li className="flex justify-between items-center bg-white p-2 rounded border border-rose-200 text-rose-700 font-mono">
                <span>"low fat" (Lowercase)</span>
                <span className="font-bold">112 records ⚠️</span>
              </li>
            </ul>
          </div>

          {/* After Harmonization */}
          <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">After Standardization (Clean Data)</span>
                <span className="text-xs font-semibold text-emerald-600">2 Unified Categories</span>
              </div>
              <ul className="space-y-2 text-xs">
                <li className="flex justify-between items-center bg-white p-2.5 rounded border border-emerald-200 font-semibold text-emerald-900">
                  <span className="flex items-center gap-1.5 font-mono"><Check className="w-3.5 h-3.5 text-emerald-600" /> Low Fat</span>
                  <span className="font-bold text-emerald-700">5,517 records (64.7%)</span>
                </li>
                <li className="flex justify-between items-center bg-white p-2.5 rounded border border-emerald-200 font-semibold text-emerald-900">
                  <span className="flex items-center gap-1.5 font-mono"><Check className="w-3.5 h-3.5 text-emerald-600" /> Regular</span>
                  <span className="font-bold text-emerald-700">3,006 records (35.3%)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-3 border border-emerald-200/80 text-[11px] text-slate-600 mt-3">
              <span className="font-bold text-emerald-800">Non-Edible Refinement:</span> 1,599 items with identifier prefix <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">NC</code> (Health & Hygiene, Household) are categorized as Non-Edible for accurate nutritional segmentation.
            </div>
          </div>

        </div>
      </div>

      {/* Task 2.2 & 2.3: Duplicates & Anomalies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Task 2.2: Duplicate Analysis */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Task 2.2: Duplicate Records Audit
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              0 Duplicates
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">{duplicates?.description}</p>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Exact Duplicate Transaction Rows:</span>
              <span className="font-extrabold text-emerald-600 text-sm">0 (Clean)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Unique Item Identifiers:</span>
              <span className="font-bold text-slate-900">{duplicates?.uniqueItemIdentifiers}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Average Stores per SKU:</span>
              <span className="font-bold text-slate-900">{duplicates?.averageOutletsPerItem} outlets</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
            {duplicates?.interpretation}
          </p>
        </div>

        {/* Task 2.3: Outliers & Zero-Visibility */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Task 2.3: Outliers & Value Anomalies
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Anomalies Treated
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Inspection of physical boundary violations and statistical fences</p>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-amber-900">Zero Visibility Anomaly:</span>
                <span className="font-bold text-amber-700">{outliersAndAnomalies?.zeroVisibility?.rawZeroCount} items ({outliersAndAnomalies?.zeroVisibility?.rawZeroPct}%)</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {outliersAndAnomalies?.zeroVisibility?.anomalyExplanation}
              </p>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-blue-900">Sales IQR Outlier Analysis:</span>
                <span className="font-bold text-blue-700">0 Outliers</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Interquartile Range [${outliersAndAnomalies?.salesIQR?.q1} - ${outliersAndAnomalies?.salesIQR?.q3}]. Upper fence at ${outliersAndAnomalies?.salesIQR?.upperFence}. All items fall inside normal grocery pricing bands.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
