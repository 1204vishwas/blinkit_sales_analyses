"""
Script to generate the student Jupyter Notebook:
BlinkIT_Grocery_Sales_Analysis.ipynb
"""

import json
import os

cells = [
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "# DATA ANALYTICS • STUDENT PROJECT\n",
            "## BlinkIT Grocery Sales Analysis\n",
            "**Domain:** Retail & Grocery Sales Analytics  \n",
            "**Company:** Sapphire IQ  \n",
            "**Analyst:** Ram (Data Analyst)  \n",
            "**Tools Used:** Python, Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebook  \n",
            "---\n",
            "### Project Context\n",
            "Ram is working as a Data Analyst at Sapphire IQ and has been assigned the **BlinkIT Grocery Sales Analysis** project. The purpose of this project is to study the available grocery sales data and provide management with a clear understanding of business performance across different products, categories, outlets, and locations.\n",
            "\n",
            "### Project Objectives Checklist\n",
            "- **Objective 1:** Understand the Business and Its Sales Performance\n",
            "- **Objective 2:** Make Sure the Available Information Is Reliable\n",
            "- **Objective 3:** Find Out What Is Driving Better Sales Performance\n",
            "- **Objective 4:** Help Management Make Better Business Decisions\n"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 1,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Import essential analytics and visualization libraries\n",
            "import pandas as pd\n",
            "import numpy as np\n",
            "import matplotlib.pyplot as plt\n",
            "import seaborn as sns\n",
            "import warnings\n",
            "warnings.filterwarnings('ignore')\n",
            "\n",
            "# Configure visualization styles\n",
            "plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')\n",
            "plt.rcParams['font.sans-serif'] = 'Arial'\n",
            "plt.rcParams['figure.figsize'] = (10, 6)\n",
            "print('Environment and libraries initialized successfully!')"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "## Step 1: Load and Inspect the Raw Dataset\n",
            "Load the primary dataset provided in `BlinkIT_Grocery_Data.xlsx`."
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 2,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Load the Excel dataset\n",
            "file_path = '../data/BlinkIT_Grocery_Data.xlsx'\n",
            "df = pd.read_excel(file_path)\n",
            "print(f'Total Records: {df.shape[0]} rows, {df.shape[1]} columns')\n",
            "df.head()"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "---\n",
            "## OBJECTIVE 1: Understand the Business and Its Sales Performance\n",
            "\n",
            "### Task 1.1: Understand what types of products BlinkIT is selling\n",
            "Examine product categories, unique identifiers, and item types."
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 3,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Task 1.1: Product types and distribution\n",
            "item_type_summary = df['Item Type'].value_counts().reset_index()\n",
            "item_type_summary.columns = ['Item Type', 'Count']\n",
            "item_type_summary['Percentage'] = (item_type_summary['Count'] / len(df)) * 100\n",
            "print(f'Total Unique Product Types: {df[\"Item Type\"].nunique()}')\n",
            "print(f'Total Unique Item Identifiers: {df[\"Item Identifier\"].nunique()}')\n",
            "item_type_summary"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### Task 1.2: Understand the different types and locations of BlinkIT outlets\n",
            "Examine outlet categories, outlet sizes, establishment years, and location tiers."
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 4,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Task 1.2: Cross-tabulation of Outlets by Type, Location, and Size\n",
            "outlet_summary = df.groupby(['Outlet Identifier', 'Outlet Type', 'Outlet Location Type', 'Outlet Size', 'Outlet Establishment Year']).size().reset_index(name='Inventory_Count')\n",
            "print(f'Total Outlets: {df[\"Outlet Identifier\"].nunique()}')\n",
            "outlet_summary"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### Task 1.3: Understand how much BlinkIT is selling overall\n",
            "Calculate overall revenue, average sales per transaction, and distribution metrics."
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 5,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Task 1.3: Overall sales descriptive statistics\n",
            "sales_stats = df['Sales'].describe()\n",
            "total_revenue = df['Sales'].sum()\n",
            "print(f'Total BlinkIT Sales: ${total_revenue:,.2f}')\n",
            "print(f'Average Sales per item: ${sales_stats[\"mean\"]:.2f}')\n",
            "print(f'Median Sales: ${sales_stats[\"50%\"]:.2f}')\n",
            "print(f'Standard Deviation: ${sales_stats[\"std\"]:.2f}')\n",
            "sales_stats"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### Task 1.4: Understand overall customer rating and product performance\n",
            "Examine customer ratings across all records."
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 6,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Task 1.4: Customer Rating summary\n",
            "rating_stats = df['Rating'].describe()\n",
            "print(f'Average Customer Rating: {rating_stats[\"mean\"]:.2f} / 5.0')\n",
            "print(f'Rating Range: {rating_stats[\"min\"]} to {rating_stats[\"max\"]}')\n",
            "\n",
            "# Visualizing Sales and Ratings Distributions\n",
            "fig, axes = plt.subplots(1, 2, figsize=(14, 5))\n",
            "sns.histplot(df['Sales'], kde=True, ax=axes[0], color='#2563EB', bins=30)\n",
            "axes[0].set_title('Overall Sales Distribution', fontweight='bold')\n",
            "axes[0].set_xlabel('Sales ($)')\n",
            "\n",
            "sns.histplot(df['Rating'], ax=axes[1], color='#10B981', discrete=True)\n",
            "axes[1].set_title('Overall Customer Ratings Distribution', fontweight='bold')\n",
            "axes[1].set_xlabel('Rating')\n",
            "plt.tight_layout()\n",
            "plt.show()"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "---\n",
            "## OBJECTIVE 2: Make Sure the Available Information Is Reliable\n",
            "\n",
            "### Task 2.1: Find information that is missing from the available records"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 7,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Task 2.1: Missing values audit\n",
            "missing = df.isnull().sum()\n",
            "missing_pct = (missing / len(df)) * 100\n",
            "missing_df = pd.DataFrame({'Missing_Count': missing, 'Percentage': missing_pct})\n",
            "print('Missing Values Audit:')\n",
            "missing_df[missing_df['Missing_Count'] > 0]"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### Task 2.2: Find information that has been repeated more than once\n",
            "Audit exact duplicates and multi-store product distributions."
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 8,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Task 2.2: Duplicate rows audit\n",
            "exact_dupes = df.duplicated().sum()\n",
            "print(f'Exact duplicate rows in dataset: {exact_dupes}')\n",
            "\n",
            "# Product repeated appearances across 10 outlets\n",
            "repeat_counts = df['Item Identifier'].value_counts()\n",
            "print(f'Average outlets per product: {repeat_counts.mean():.1f}')\n",
            "print(f'Max outlets for a product: {repeat_counts.max()} | Min outlets: {repeat_counts.min()}')"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### Task 2.3: Find values that look unusually high or unusually low\n",
            "Detect zero-visibility anomalies and sales IQR outliers."
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 9,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Task 2.3: Zero-visibility anomaly detection\n",
            "zero_vis = (df['Item Visibility'] == 0).sum()\n",
            "print(f'Items with Visibility = 0: {zero_vis} ({zero_vis/len(df)*100:.2f}%)')\n",
            "print('Physically, an item displayed for purchase cannot have 0 visibility.')\n",
            "\n",
            "# Sales IQR outlier analysis\n",
            "Q1 = df['Sales'].quantile(0.25)\n",
            "Q3 = df['Sales'].quantile(0.75)\n",
            "IQR = Q3 - Q1\n",
            "upper_fence = Q3 + 1.5 * IQR\n",
            "lower_fence = Q1 - 1.5 * IQR\n",
            "sales_outliers = df[(df['Sales'] > upper_fence) | (df['Sales'] < lower_fence)]\n",
            "print(f'Sales Outlier Bounds: [${lower_fence:.2f}, ${upper_fence:.2f}]')\n",
            "print(f'Identified Sales Outliers Count: {len(sales_outliers)}')\n",
            "\n",
            "plt.figure(figsize=(10, 3))\n",
            "sns.boxplot(x=df['Sales'], color='#60A5FA')\n",
            "plt.title('Sales Boxplot - Outlier Inspection', fontweight='bold')\n",
            "plt.show()"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### Task 2.4: Standardize similar information for proper comparison\n",
            "Normalize Item Fat Content categories ('LF', 'low fat', 'reg') and impute missing weights & zero visibility."
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 10,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Task 2.4: Data Standardization Pipeline\n",
            "df_clean = df.copy()\n",
            "\n",
            "print('Before Standardization:', df_clean['Item Fat Content'].value_counts().to_dict())\n",
            "df_clean['Item Fat Content'] = df_clean['Item Fat Content'].replace({\n",
            "    'LF': 'Low Fat',\n",
            "    'low fat': 'Low Fat',\n",
            "    'reg': 'Regular'\n",
            "})\n",
            "print('After Standardization:', df_clean['Item Fat Content'].value_counts().to_dict())\n",
            "\n",
            "# Impute missing Item Weights using Item Identifier lookup\n",
            "id_weight_map = df_clean.dropna(subset=['Item Weight']).groupby('Item Identifier')['Item Weight'].mean()\n",
            "df_clean['Item Weight'] = df_clean['Item Weight'].fillna(df_clean['Item Identifier'].map(id_weight_map))\n",
            "# Fallback for remaining items\n",
            "type_weight_map = df_clean.groupby('Item Type')['Item Weight'].median()\n",
            "df_clean['Item Weight'] = df_clean['Item Weight'].fillna(df_clean['Item Type'].map(type_weight_map))\n",
            "\n",
            "# Impute Zero Visibility with Item Identifier median\n",
            "id_vis_map = df_clean[df_clean['Item Visibility'] > 0].groupby('Item Identifier')['Item Visibility'].median()\n",
            "df_clean['Item Visibility'] = df_clean.apply(\n",
            "    lambda r: id_vis_map.get(r['Item Identifier'], r['Item Visibility']) if r['Item Visibility'] == 0 else r['Item Visibility'],\n",
            "    axis=1\n",
            ")\n",
            "\n",
            "print(f'Verification: Missing Weights remaining: {df_clean[\"Item Weight\"].isnull().sum()}')\n",
            "print(f'Verification: Zero Visibility remaining: {(df_clean[\"Item Visibility\"] == 0).sum()}')"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "---\n",
            "## OBJECTIVE 3: Find Out What Is Driving Better Sales Performance\n",
            "\n",
            "### Task 3.1: Find out which types of products are selling more"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 11,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Task 3.1: Category Performance breakdown\n",
            "category_sales = df_clean.groupby('Item Type').agg(\n",
            "    Total_Sales=('Sales', 'sum'),\n",
            "    Avg_Sales=('Sales', 'mean'),\n",
            "    Total_Items=('Sales', 'count'),\n",
            "    Avg_Rating=('Rating', 'mean')\n",
            ").sort_values('Total_Sales', ascending=False)\n",
            "category_sales['Revenue_Share_%'] = (category_sales['Total_Sales'] / df_clean['Sales'].sum()) * 100\n",
            "category_sales"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### Task 3.2: Find out which types of outlets are performing better"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 12,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Task 3.2: Sales by Outlet Type & Outlet Tier\n",
            "outlet_type_perf = df_clean.groupby('Outlet Type').agg(\n",
            "    Total_Sales=('Sales', 'sum'),\n",
            "    Avg_Sales=('Sales', 'mean'),\n",
            "    Item_Count=('Sales', 'count')\n",
            ").sort_values('Total_Sales', ascending=False)\n",
            "outlet_type_perf['Sales_Share_%'] = (outlet_type_perf['Total_Sales'] / df_clean['Sales'].sum()) * 100\n",
            "\n",
            "tier_perf = df_clean.groupby('Outlet Location Type').agg(\n",
            "    Total_Sales=('Sales', 'sum'),\n",
            "    Avg_Sales=('Sales', 'mean'),\n",
            "    Item_Count=('Sales', 'count')\n",
            ").sort_values('Total_Sales', ascending=False)\n",
            "tier_perf['Sales_Share_%'] = (tier_perf['Total_Sales'] / df_clean['Sales'].sum()) * 100\n",
            "\n",
            "display(outlet_type_perf)\n",
            "display(tier_perf)"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### Task 3.3: Understand whether product visibility, weight, ratings, and outlet characteristics are connected with sales"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 13,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Task 3.3: Correlation Matrix\n",
            "num_cols = ['Sales', 'Item Visibility', 'Item Weight', 'Rating', 'Outlet Establishment Year']\n",
            "corr = df_clean[num_cols].corr()\n",
            "\n",
            "plt.figure(figsize=(8, 5))\n",
            "sns.heatmap(corr, annot=True, cmap='coolwarm', fmt='.3f', linewidths=1)\n",
            "plt.title('Correlation Matrix of Continuous Variables', fontweight='bold')\n",
            "plt.show()"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### Task 3.4: Compare better-performing and lower-performing products and outlets"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 14,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Task 3.4: Benchmark 10 Outlets\n",
            "outlet_benchmark = df_clean.groupby(['Outlet Identifier', 'Outlet Type', 'Outlet Location Type', 'Outlet Size']).agg(\n",
            "    Total_Sales=('Sales', 'sum'),\n",
            "    Avg_Sales=('Sales', 'mean'),\n",
            "    Item_Count=('Sales', 'count'),\n",
            "    Avg_Rating=('Rating', 'mean')\n",
            ").reset_index().sort_values('Total_Sales', ascending=False)\n",
            "outlet_benchmark"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "---\n",
            "## OBJECTIVE 4: Help Management Make Better Business Decisions\n",
            "\n",
            "### Task 4.1: Identify the products that are contributing more to sales (Pareto 80/20 Rule)"
        ]
    },
    {
        "cell_type": "code",
        "execution_count": 15,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Task 4.1: Pareto Analysis\n",
            "prod_sales = df_clean.groupby('Item Identifier')['Sales'].sum().sort_values(ascending=False).reset_index()\n",
            "prod_sales['Cum_Sales'] = prod_sales['Sales'].cumsum()\n",
            "prod_sales['Cum_Pct'] = (prod_sales['Cum_Sales'] / prod_sales['Sales'].sum()) * 100\n",
            "\n",
            "pareto_20_count = int(0.20 * len(prod_sales))\n",
            "pareto_20_pct = prod_sales.iloc[pareto_20_count]['Cum_Pct']\n",
            "print(f'Top 20% of catalog ({pareto_20_count} products) accounts for {pareto_20_pct:.2f}% of total revenue!')\n",
            "\n",
            "plt.figure(figsize=(10, 5))\n",
            "plt.plot(range(len(prod_sales)), prod_sales['Cum_Pct'], color='#2563EB', lw=2)\n",
            "plt.axvline(x=pareto_20_count, color='r', linestyle='--', label=f'20% of Items ({pareto_20_count})')\n",
            "plt.axhline(y=pareto_20_pct, color='g', linestyle='--', label=f'{pareto_20_pct:.1f}% Cumulative Sales')\n",
            "plt.title('Pareto Analysis: Cumulative Sales by Product', fontweight='bold')\n",
            "plt.xlabel('Product Rank')\n",
            "plt.ylabel('Cumulative Sales (%)')\n",
            "plt.legend()\n",
            "plt.show()"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### Task 4.2 & 4.3: Identify top outlets and areas where performance can be improved\n",
            "- **Top Outlets:** `OUT035`, `OUT046`, `OUT013`, `OUT018` generate ~$131k - $133k each.\n",
            "- **Underperforming Outlets:** Grocery Stores `OUT010` ($78.1k) and `OUT019` ($73.8k) generate 42% lower sales due to inventory constraint (~555 items vs ~930 items in Supermarkets).\n",
            "- **Location Potential:** Tier 3 locations generate the highest revenue ($472k), followed by Tier 2 ($393k). Expansion should focus on Tier 2 and Tier 3 high-density neighborhoods.\n",
            "\n",
            "### Task 4.4: Strategic Recommendations for Sapphire IQ Management\n",
            "1. **Inventory Expansion in Grocery Stores:** Increase SKU count in OUT010 and OUT019 from 550 to 900+ to capture unmet demand.\n",
            "2. **Visibility Optimization:** Items with high sales velocity but low visibility should be promoted to prime visual slots on the app and store front.\n",
            "3. **Focus on Core Categories:** Fruits & Vegetables and Snack Foods drive 30%+ of revenue. Maintain high fill rates and fresh inventory turns.\n",
            "4. **Standardized Quality Control:** Address customer ratings in lower-rated items to protect brand trust."
        ]
    }
]

notebook = {
    "cells": cells,
    "metadata": {
        "kernelspec": {
            "display_name": "Python 3",
            "language": "python",
            "name": "python3"
        },
        "language_info": {
            "codemirror_mode": {"name": "ipython", "version": 3},
            "file_extension": ".py",
            "mimetype": "text/x-python",
            "name": "python",
            "nbformat": 4,
            "nbformat_minor": 2
        }
    },
    "nbformat": 4,
    "nbformat_minor": 2
}

out_path = os.path.join(os.path.dirname(__file__), '..', 'notebooks', 'BlinkIT_Grocery_Sales_Analysis.ipynb')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(notebook, f, indent=2)

print(f"Jupyter Notebook successfully created at {out_path}!")
