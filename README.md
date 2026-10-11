# 🛍️ BlinkIT Grocery Sales Analysis
**Domain:** Retail & Grocery Sales Analytics  
**Company:** Sapphire IQ • Brilliant Minds. Intelligent Solutions.  
**Student Analyst:** Ram (Data Analyst)  
**Tools Used:** Python, Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebook, Node.js, Express, React, Vite, Tailwind CSS, Recharts  

---

## 📋 Project Overview & Business Context

Ram is working as a Data Analyst at **Sapphire IQ** and was assigned the **BlinkIT Grocery Sales Analysis** project. The purpose of this project is to study the grocery sales data across products, categories, outlets, and locations to provide executive management with a clear understanding of business performance.

### 🎯 4 Core Objectives & Checkpoints

- **Objective 1: Understand the Business and Its Sales Performance**
  - **Task 1.1:** Catalog composition across 16 product types, item identifiers (`FD`, `DR`, `NC`), and fat contents.
  - **Task 1.2:** Physical footprint across 10 fulfillment outlets, sizes (*Small, Medium, High*), and location tiers (*Tier 1, Tier 2, Tier 3*).
  - **Task 1.3:** Total BlinkIT sales volume (**$1,201,681.49 / ₹1.20M**), mean sales (**$140.99**), and transaction distributions.
  - **Task 1.4:** Overall customer satisfaction ratings (**mean 3.97 / 5.00 ★**).

- **Objective 2: Make Sure the Available Information Is Reliable (Data Quality & Cleaning)**
  - **Task 2.1:** Audited missing values in `Item Weight` (**1,463 records, 17.17% missing**). Implemented two-tier hierarchical imputation using matching `Item Identifier` weights and category medians.
  - **Task 2.2:** Audited duplicate records (**0 exact duplicate rows**; verified SKU distribution across 10 outlets).
  - **Task 2.3:** Detected physical anomalies: **526 items (6.17%) with zero visibility** (`Item Visibility = 0.00`). Imputed using non-zero median visibility. Conducted IQR fence analysis on sales prices.
  - **Task 2.4:** Standardized inconsistent categorizations in `Item Fat Content`: normalized `'LF'` (316), `'low fat'` (112), and `'reg'` (117) into `'Low Fat'` and `'Regular'`. Identified 1,599 non-consumable items (`NC` prefix).

- **Objective 3: Find Out What Is Driving Better Sales Performance**
  - **Task 3.1:** Top selling product types: *Fruits and Vegetables* ($178.1k) and *Snack Foods* ($175.4k) lead revenue.
  - **Task 3.2:** Top outlet formats: *Supermarket Type 1* drives 65.5% ($787.5k). *Tier 3* leads location revenue ($472.1k).
  - **Task 3.3:** Feature correlation matrix & scatter analysis between *Sales, Visibility, Weight, Rating, and Outlet Establishment Year*.
  - **Task 3.4:** Benchmark comparison between high-volume supermarkets (~$131k-$133k) and grocery stores (~$74k-$78k) identifying catalog depth constraints.

- **Objective 4: Help Management Make Better Business Decisions**
  - **Task 4.1:** Pareto 80/20 analysis: top 20% products (311 items) generate 36.6% of total revenue.
  - **Task 4.2:** Identified high-growth geographical clusters in Tier 3 & Tier 2 markets.
  - **Task 4.3:** Action plan for underperforming grocery stores `OUT010` and `OUT019`, plus low-visibility high-velocity SKUs.
  - **Task 4.4:** Strategic business suggestions across 5 operational pillars and interactive scenario simulator.

---

## 📁 Repository Structure

```text
blinkit_sales/
├── backend/
│   ├── data/
│   │   ├── BlinkIT_Grocery_Data.xlsx        # Primary Excel dataset
│   │   ├── blinkit_raw.csv                  # Raw CSV export
│   │   ├── blinkit_cleaned.csv              # Fully normalized & imputed CSV
│   │   └── blinkit_cleaned.json             # Fast JSON dataset for API
│   ├── notebooks/
│   │   ├── BlinkIT_Grocery_Sales_Analysis.ipynb # Jupyter Notebook student submission
│   │   └── charts/                          # Matplotlib/Seaborn exported figures
│   ├── scripts/
│   │   ├── data_analysis.py                 # Python script reproducing all analysis
│   │   └── create_notebook.py               # Notebook generator script
│   ├── .env                                 # Environment file (PORT=5002)
│   ├── .env.example                         # Environment template
│   ├── package.json                         # Scripts: "dev": "node --watch server.js"
│   └── server.js                            # Express REST API endpoints
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx                   # Sapphire IQ branding & actions
│   │   │   ├── KpiCards.jsx                 # Key executive metric cards
│   │   │   ├── FilterBar.jsx                # Multi-dimensional slicers
│   │   │   └── tabs/
│   │   │       ├── OverviewTab.jsx          # Executive Dashboard & Highlights
│   │   │       ├── Objective1Tab.jsx        # Business & Sales Performance (1.1-1.4)
│   │   │       ├── Objective2Tab.jsx        # Data Reliability & Quality (2.1-2.4)
│   │   │       ├── Objective3Tab.jsx        # Sales Drivers & Correlations (3.1-3.4)
│   │   │       ├── Objective4Tab.jsx        # Strategic Decisions & Pareto (4.1-4.4)
│   │   │       ├── DataExplorerTab.jsx      # 8,523 rows table with search & filters
│   │   │       ├── NotebookTab.jsx          # Python codebook & submission viewer
│   │   │       └── ScenarioSimulatorModal.jsx # What-If Growth Modeler
│   │   ├── api.js                           # Centralized API fetch helper
│   │   ├── App.jsx                          # Main React root application
│   │   ├── main.jsx                         # React DOM mount point
│   │   └── index.css                        # Tailwind CSS styles
│   ├── .env                                 # Environment file (VITE_API_BASE_URL=http://localhost:5002/api)
│   ├── .env.example                         # Environment template
│   ├── index.html                           # HTML template
│   ├── package.json                         # Scripts: "dev": "vite"
│   ├── tailwind.config.js                   # Tailwind theme setup
│   └── vite.config.js                       # Vite build configuration
│
└── README.md                                # Project Documentation
```

---

## 🚀 How to Run the Project

### 1. Backend Server

In a terminal:
```bash
cd backend
npm run dev
```
- **Backend Port:** `http://localhost:5002`
- **Health Check:** `http://localhost:5002/api/health`
- **Environment:** Configured in `backend/.env`

### 2. Frontend Application

In a separate terminal:
```bash
cd frontend
npm run dev
```
- **Frontend Port:** `http://localhost:5173`
- **Environment:** Configured in `frontend/.env`

---

## 🐍 Running the Python Analytics Script & Jupyter Notebook

To reproduce the Python data analytics, charts, and Jupyter Notebook:

```bash
# 1. Run Python data analysis pipeline
python backend/scripts/data_analysis.py

# 2. Open the Jupyter Notebook
jupyter notebook backend/notebooks/BlinkIT_Grocery_Sales_Analysis.ipynb
```

---

## 📊 Key Executive Findings

1. **Revenue Drivers:** *Fruits and Vegetables* ($178,124) and *Snack Foods* ($175,434) make up nearly 30% of total revenue.
2. **Tier 3 Dominance:** Tier 3 stores generate **$472,133 (39.3%)**, surpassing Tier 2 ($393k) and Tier 1 ($336k).
3. **Grocery Store Optimization:** Grocery stores `OUT010` and `OUT019` suffer from catalog limitation (average ~540 items vs ~930 items in supermarkets), providing an immediate expansion opportunity.
4. **Data Hygiene:** 100% data quality achieved after imputing 1,463 missing weights, replacing 526 zero-visibility anomalies, and standardizing 545 inconsistent fat-content labels.
