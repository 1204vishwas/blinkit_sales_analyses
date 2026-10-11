"""
Sapphire IQ • Data Analytics Student Project
BlinkIT Grocery Sales Analysis
Author: Ram (Data Analyst at Sapphire IQ)
Domain: Retail & Grocery Sales Analytics
Tools: Python, Pandas, NumPy, Matplotlib, Seaborn
"""

import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Set style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.size'] = 10

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'notebooks', 'charts')
os.makedirs(OUTPUT_DIR, exist_ok=True)

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'BlinkIT_Grocery_Data.xlsx')

print(f"Loading data from: {DATA_PATH}")
df_raw = pd.read_excel(DATA_PATH)
print(f"Dataset Loaded successfully. Shape: {df_raw.shape}")

# ==========================================
# OBJECTIVE 1: Understand Business & Sales
# ==========================================
print("\n" + "="*50)
print("OBJECTIVE 1: Understand the Business and Its Sales Performance")
print("="*50)

# Task 1.1: Product Types
item_types_count = df_raw['Item Type'].value_counts()
print("\n--- Task 1.1: Product Types Sold by BlinkIT ---")
print(item_types_count)

# Task 1.2: Outlet Types & Locations
print("\n--- Task 1.2: Outlets by Type & Location ---")
print(pd.crosstab(df_raw['Outlet Type'], df_raw['Outlet Location Type']))

# Task 1.3: Overall Sales
total_sales = df_raw['Sales'].sum()
avg_sales = df_raw['Sales'].mean()
median_sales = df_raw['Sales'].median()
std_sales = df_raw['Sales'].std()
print(f"\n--- Task 1.3: Total BlinkIT Sales: ${total_sales:,.2f} | Avg: ${avg_sales:,.2f} | Median: ${median_sales:,.2f} | Std: ${std_sales:,.2f} ---")

# Task 1.4: Overall Customer Ratings
avg_rating = df_raw['Rating'].mean()
print(f"\n--- Task 1.4: Customer Rating: Mean = {avg_rating:.2f} (Scale: {df_raw['Rating'].min()} - {df_raw['Rating'].max()}) ---")

# Chart 1: Sales Distribution & Ratings
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
sns.histplot(df_raw['Sales'], kde=True, ax=axes[0], color='#2563EB', bins=30)
axes[0].set_title('Sales Distribution (Objective 1.3)', fontsize=12, fontweight='bold')
axes[0].set_xlabel('Sales ($)')

sns.histplot(df_raw['Rating'], ax=axes[1], color='#10B981', bins=20, discrete=True)
axes[1].set_title('Customer Rating Distribution (Objective 1.4)', fontsize=12, fontweight='bold')
axes[1].set_xlabel('Rating (1-5)')
plt.tight_layout()
fig.savefig(os.path.join(OUTPUT_DIR, 'obj1_sales_and_ratings.png'), dpi=200)
plt.close()

# ==========================================
# OBJECTIVE 2: Data Quality & Reliability
# ==========================================
print("\n" + "="*50)
print("OBJECTIVE 2: Make Sure Available Information Is Reliable")
print("="*50)

df_clean = df_raw.copy()

# Task 2.1: Missing Information
missing_counts = df_raw.isnull().sum()
print("\n--- Task 2.1: Missing Values ---")
print(missing_counts[missing_counts > 0])

# Impute Item Weight
weight_map = df_clean.dropna(subset=['Item Weight']).groupby('Item Identifier')['Item Weight'].mean()
df_clean['Item Weight'] = df_clean['Item Weight'].fillna(df_clean['Item Identifier'].map(weight_map))
type_weight_median = df_clean.groupby('Item Type')['Item Weight'].median()
df_clean['Item Weight'] = df_clean['Item Weight'].fillna(df_clean['Item Type'].map(type_weight_median))
print(f"Item Weight missing values after imputation: {df_clean['Item Weight'].isnull().sum()}")

# Task 2.2: Duplicate Records
duplicates = df_raw.duplicated().sum()
print(f"\n--- Task 2.2: Exact Duplicate Records Count: {duplicates} ---")

# Task 2.3: Outliers & Anomalies
zero_vis_count = (df_raw['Item Visibility'] == 0).sum()
print(f"\n--- Task 2.3: Zero Visibility Anomalies: {zero_vis_count} records ({zero_vis_count/len(df_raw)*100:.2f}%) ---")

# Fix zero visibility
vis_map = df_clean[df_clean['Item Visibility'] > 0].groupby('Item Identifier')['Item Visibility'].median()
df_clean['Item Visibility'] = df_clean.apply(
    lambda r: vis_map.get(r['Item Identifier'], r['Item Visibility']) if r['Item Visibility'] == 0 else r['Item Visibility'],
    axis=1
)
vis_type_map = df_clean[df_clean['Item Visibility'] > 0].groupby('Item Type')['Item Visibility'].median()
df_clean['Item Visibility'] = df_clean.apply(
    lambda r: vis_type_map.get(r['Item Type'], 0.05) if r['Item Visibility'] == 0 else r['Item Visibility'],
    axis=1
)

# Outliers in Sales using IQR
q1 = df_clean['Sales'].quantile(0.25)
q3 = df_clean['Sales'].quantile(0.75)
iqr = q3 - q1
upper_bound = q3 + 1.5 * iqr
lower_bound = q1 - 1.5 * iqr
outliers = df_clean[(df_clean['Sales'] < lower_bound) | (df_clean['Sales'] > upper_bound)]
print(f"Sales IQR Outliers: {len(outliers)} items (Upper threshold: ${upper_bound:.2f})")

# Task 2.4: Standardize Item Fat Content
print("\n--- Task 2.4: Standardize Item Fat Content ---")
print("Before standardization:", df_raw['Item Fat Content'].value_counts().to_dict())
df_clean['Item Fat Content'] = df_clean['Item Fat Content'].replace({
    'LF': 'Low Fat',
    'low fat': 'Low Fat',
    'reg': 'Regular'
})
print("After standardization:", df_clean['Item Fat Content'].value_counts().to_dict())

# ==========================================
# OBJECTIVE 3: Drivers of Sales Performance
# ==========================================
print("\n" + "="*50)
print("OBJECTIVE 3: Find Out What Is Driving Better Sales Performance")
print("="*50)

# Task 3.1: Top Selling Product Types
sales_by_type = df_clean.groupby('Item Type')['Sales'].agg(['sum', 'mean', 'count']).sort_values('sum', ascending=False)
print("\n--- Task 3.1: Sales by Item Type ---")
print(sales_by_type)

# Task 3.2: Top Performing Outlets
sales_by_outlet_type = df_clean.groupby('Outlet Type')['Sales'].agg(['sum', 'mean', 'count']).sort_values('sum', ascending=False)
sales_by_tier = df_clean.groupby('Outlet Location Type')['Sales'].agg(['sum', 'mean', 'count']).sort_values('sum', ascending=False)
print("\n--- Task 3.2: Sales by Outlet Type ---")
print(sales_by_outlet_type)
print("\nSales by Location Tier:")
print(sales_by_tier)

# Task 3.3: Correlations
numeric_cols = ['Sales', 'Item Visibility', 'Item Weight', 'Rating', 'Outlet Establishment Year']
corr_matrix = df_clean[numeric_cols].corr()
print("\n--- Task 3.3: Correlation Matrix ---")
print(corr_matrix)

# Chart 2: Correlation Heatmap
plt.figure(figsize=(8, 6))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".3f", linewidths=0.5)
plt.title('Correlation Heatmap of Key Features (Objective 3.3)', fontsize=12, fontweight='bold')
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'obj3_correlation_heatmap.png'), dpi=200)
plt.close()

# Chart 3: Sales by Item Type (Bar chart)
plt.figure(figsize=(12, 6))
sns.barplot(x=sales_by_type.index, y=sales_by_type['sum'], palette='viridis')
plt.xticks(rotation=45, ha='right')
plt.title('Total Revenue by Item Type (Objective 3.1)', fontsize=13, fontweight='bold')
plt.ylabel('Total Sales ($)')
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'obj3_sales_by_item_type.png'), dpi=200)
plt.close()

# ==========================================
# OBJECTIVE 4: Strategic Business Decisions
# ==========================================
print("\n" + "="*50)
print("OBJECTIVE 4: Help Management Make Better Business Decisions")
print("="*50)

# Task 4.1: Pareto Analysis
item_sales = df_clean.groupby('Item Identifier')['Sales'].sum().sort_values(ascending=False).reset_index()
item_sales['cumulative_sales'] = item_sales['Sales'].cumsum()
item_sales['cumulative_pct'] = (item_sales['cumulative_sales'] / item_sales['Sales'].sum()) * 100
top_20_count = int(len(item_sales) * 0.20)
top_20_pct = item_sales.iloc[top_20_count]['cumulative_pct']
print(f"\n--- Task 4.1: Pareto Analysis ---")
print(f"Top 20% of products ({top_20_count} items) contribute {top_20_pct:.2f}% of total sales.")

# Task 4.2 & 4.3: Outlet Benchmarking
outlet_perf = df_clean.groupby(['Outlet Identifier', 'Outlet Type', 'Outlet Location Type', 'Outlet Size']).agg(
    total_sales=('Sales', 'sum'),
    avg_sales=('Sales', 'mean'),
    item_count=('Sales', 'count'),
    avg_rating=('Rating', 'mean')
).reset_index().sort_values('total_sales', ascending=False)
print("\n--- Task 4.2 & 4.3: Outlet Performance Benchmark ---")
print(outlet_perf)

print("\nAnalysis and chart generation completed successfully!")
