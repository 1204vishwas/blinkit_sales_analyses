import React, { useState } from 'react';
import { Terminal, BookOpen, Code2, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';

export default function NotebookTab() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const snippets = [
    {
      title: 'Step 1: Load and Inspect Dataset',
      objective: 'Setup',
      code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load Excel data
df = pd.read_excel('BlinkIT_Grocery_Data.xlsx')
print(f"Shape: {df.shape}")
df.head()`
    },
    {
      title: 'Task 1.1 - 1.4: Understand Business & Sales Performance',
      objective: 'Objective 1',
      code: `# Task 1.1: Product Types
print("Product Types:\\n", df['Item Type'].value_counts())

# Task 1.2: Outlet Profiles & Footprint
print("Outlets by Type & Tier:\\n", pd.crosstab(df['Outlet Type'], df['Outlet Location Type']))

# Task 1.3: Total Sales
print(f"Total Sales: \${df['Sales'].sum():,.2f}")
print(f"Mean Sales: \${df['Sales'].mean():.2f}")

# Task 1.4: Customer Ratings
print(f"Average Customer Rating: {df['Rating'].mean():.2f} / 5.0")`
    },
    {
      title: 'Task 2.1 - 2.4: Data Quality & Imputation Pipeline',
      objective: 'Objective 2',
      code: `# Task 2.1: Missing Values
print("Missing values:\\n", df.isnull().sum())

# Impute Item Weight using Item Identifier lookup
weight_map = df.dropna(subset=['Item Weight']).groupby('Item Identifier')['Item Weight'].mean()
df['Item Weight'] = df['Item Weight'].fillna(df['Item Identifier'].map(weight_map))

# Task 2.3: Zero Visibility Imputation
vis_map = df[df['Item Visibility'] > 0].groupby('Item Identifier')['Item Visibility'].median()
df['Item Visibility'] = df.apply(
    lambda r: vis_map.get(r['Item Identifier'], r['Item Visibility']) if r['Item Visibility'] == 0 else r['Item Visibility'],
    axis=1
)

# Task 2.4: Standardize Item Fat Content
df['Item Fat Content'] = df['Item Fat Content'].replace({
    'LF': 'Low Fat',
    'low fat': 'Low Fat',
    'reg': 'Regular'
})`
    },
    {
      title: 'Task 3.1 - 3.4: Sales Drivers & Correlation Heatmap',
      objective: 'Objective 3',
      code: `# Task 3.1: Sales by Category
cat_sales = df.groupby('Item Type')['Sales'].agg(['sum', 'mean']).sort_values('sum', ascending=False)

# Task 3.2: Sales by Outlet Type
outlet_sales = df.groupby('Outlet Type')['Sales'].agg(['sum', 'mean'])

# Task 3.3: Correlation Matrix & Seaborn Heatmap
num_cols = ['Sales', 'Item Visibility', 'Item Weight', 'Rating']
corr = df[num_cols].corr()

plt.figure(figsize=(8, 6))
sns.heatmap(corr, annot=True, cmap='coolwarm', fmt='.3f')
plt.title('Correlation Matrix - BlinkIT Grocery Sales')
plt.show()`
    },
    {
      title: 'Task 4.1 - 4.4: Pareto Analysis & Recommendations',
      objective: 'Objective 4',
      code: `# Task 4.1: Pareto 80/20 Rule
item_rev = df.groupby('Item Identifier')['Sales'].sum().sort_values(ascending=False).reset_index()
item_rev['Cum_Sales'] = item_rev['Sales'].cumsum()
item_rev['Cum_Pct'] = (item_rev['Cum_Sales'] / item_rev['Sales'].sum()) * 100

top_20_count = int(0.20 * len(item_rev))
print(f"Top 20% SKUs ({top_20_count}) account for {item_rev.iloc[top_20_count]['Cum_Pct']:.2f}% of total sales!")`
    }
  ];

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                PYTHON ANALYTICS
              </span>
              <span className="text-xs text-slate-400">Jupyter Notebook & Data Science Toolkit</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              Python Data Analytics Codebook & Student Submission
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tools Used: <strong>Python, Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebook</strong>
            </p>
          </div>

          <div className="text-right text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="text-slate-400 font-medium">Notebook Location:</p>
            <p className="font-mono font-bold text-slate-800 text-[11px] mt-0.5">backend/notebooks/BlinkIT_Grocery_Sales_Analysis.ipynb</p>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold text-emerald-900">Python 3.13 Ready</span>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold text-emerald-900">Pandas DataFrames</span>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold text-emerald-900">Seaborn Visuals</span>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold text-emerald-900">Jupyter IPYNB Saved</span>
          </div>
        </div>
      </div>

      {/* Code Snippets Accordion / Grid */}
      <div className="space-y-4">
        {snippets.map((snip, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">{snip.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">{snip.objective}</span>
              </div>
              <button
                onClick={() => handleCopy(snip.code, idx)}
                className="inline-flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md transition-colors"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
              <code>{snip.code}</code>
            </pre>
          </div>
        ))}
      </div>

    </div>
  );
}
