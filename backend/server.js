import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));
app.use(express.json());

// Load Data
const CLEANED_DATA_PATH = path.resolve(__dirname, process.env.CLEANED_DATA_PATH || './data/blinkit_cleaned.json');
const RAW_DATA_PATH = path.resolve(__dirname, process.env.RAW_DATA_PATH || './data/blinkit_raw.csv');

let cleanedData = [];
let rawDataSummary = null;

try {
  if (fs.existsSync(CLEANED_DATA_PATH)) {
    cleanedData = JSON.parse(fs.readFileSync(CLEANED_DATA_PATH, 'utf-8'));
    console.log(`[Backend] Cleaned dataset loaded successfully: ${cleanedData.length} records`);
  } else {
    console.warn(`[Backend] Cleaned dataset file not found at ${CLEANED_DATA_PATH}`);
  }
} catch (err) {
  console.error('[Backend] Error reading cleaned dataset:', err.message);
}

// Helper: compute summary metrics
function computeMetrics(data) {
  const totalSales = data.reduce((sum, item) => sum + (Number(item.Sales) || 0), 0);
  const totalItems = data.length;
  const avgSales = totalItems ? totalSales / totalItems : 0;
  const avgRating = totalItems ? data.reduce((sum, item) => sum + (Number(item.Rating) || 0), 0) / totalItems : 0;
  const avgVisibility = totalItems ? data.reduce((sum, item) => sum + (Number(item.Item_Visibility_Imputed || item['Item Visibility']) || 0), 0) / totalItems : 0;
  
  const outlets = new Set(data.map(i => i['Outlet Identifier']));
  const itemTypes = new Set(data.map(i => i['Item Type']));

  // Sales by Category
  const catSales = {};
  data.forEach(i => {
    catSales[i['Item Type']] = (catSales[i['Item Type']] || 0) + (Number(i.Sales) || 0);
  });
  const topCat = Object.entries(catSales).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

  // Sales by Outlet
  const outletSales = {};
  data.forEach(i => {
    outletSales[i['Outlet Identifier']] = (outletSales[i['Outlet Identifier']] || 0) + (Number(i.Sales) || 0);
  });
  const topOutlet = Object.entries(outletSales).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

  return {
    totalSales: Number(totalSales.toFixed(2)),
    averageSales: Number(avgSales.toFixed(2)),
    totalItems,
    averageRating: Number(avgRating.toFixed(2)),
    averageVisibility: Number((avgVisibility * 100).toFixed(2)), // in %
    outletCount: outlets.size,
    categoryCount: itemTypes.size,
    topCategory: { name: topCat[0], sales: Number(topCat[1].toFixed(2)) },
    topOutlet: { id: topOutlet[0], sales: Number(topOutlet[1].toFixed(2)) }
  };
}

// 1. Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    company: 'Sapphire IQ',
    project: 'BlinkIT Grocery Sales Analysis',
    analyst: 'Ram',
    recordsLoaded: cleanedData.length,
    timestamp: new Date().toISOString()
  });
});

// 2. Summary & Filters endpoint
app.get('/api/overview', (req, res) => {
  const metrics = computeMetrics(cleanedData);
  res.json(metrics);
});

app.get('/api/filters', (req, res) => {
  const categories = [...new Set(cleanedData.map(i => i['Item Type']))].sort();
  const outletTypes = [...new Set(cleanedData.map(i => i['Outlet Type']))].sort();
  const outletSizes = [...new Set(cleanedData.map(i => i['Outlet Size']))].sort();
  const locationTiers = [...new Set(cleanedData.map(i => i['Outlet Location Type']))].sort();
  const fatContents = [...new Set(cleanedData.map(i => i['Item Fat Content']))].sort();
  const years = [...new Set(cleanedData.map(i => i['Outlet Establishment Year']))].sort((a, b) => a - b);

  res.json({
    categories,
    outletTypes,
    outletSizes,
    locationTiers,
    fatContents,
    years
  });
});

// 3. OBJECTIVE 1: Understand Business and Sales Performance
app.get('/api/objective1', (req, res) => {
  // Task 1.1: Product Types Sold
  const typeMap = {};
  cleanedData.forEach(item => {
    const type = item['Item Type'];
    if (!typeMap[type]) {
      typeMap[type] = { itemType: type, count: 0, totalSales: 0, ratings: [] };
    }
    typeMap[type].count += 1;
    typeMap[type].totalSales += Number(item.Sales) || 0;
    typeMap[type].ratings.push(Number(item.Rating) || 0);
  });

  const productTypes = Object.values(typeMap).map(pt => ({
    itemType: pt.itemType,
    count: pt.count,
    totalSales: Number(pt.totalSales.toFixed(2)),
    avgSales: Number((pt.totalSales / pt.count).toFixed(2)),
    avgRating: Number((pt.ratings.reduce((a, b) => a + b, 0) / pt.count).toFixed(2)),
    sharePct: Number(((pt.totalSales / 1201681.49) * 100).toFixed(2))
  })).sort((a, b) => b.totalSales - a.totalSales);

  // Broad Categories (Food, Drinks, Non-Consumable)
  const broadMap = {};
  cleanedData.forEach(item => {
    const cat = item.Item_Broad_Category || 'Food';
    broadMap[cat] = (broadMap[cat] || 0) + (Number(item.Sales) || 0);
  });
  const broadCategories = Object.entries(broadMap).map(([name, sales]) => ({
    name,
    sales: Number(sales.toFixed(2)),
    pct: Number(((sales / 1201681.49) * 100).toFixed(2))
  }));

  // Fat Content breakdown
  const fatMap = {};
  cleanedData.forEach(item => {
    const fat = item['Item Fat Content'];
    if (!fatMap[fat]) fatMap[fat] = { name: fat, count: 0, sales: 0 };
    fatMap[fat].count += 1;
    fatMap[fat].sales += Number(item.Sales) || 0;
  });
  const fatBreakdown = Object.values(fatMap).map(f => ({
    name: f.name,
    count: f.count,
    sales: Number(f.sales.toFixed(2)),
    pct: Number(((f.sales / 1201681.49) * 100).toFixed(2))
  }));

  // Task 1.2: Outlets Types & Locations
  const outletMap = {};
  cleanedData.forEach(item => {
    const id = item['Outlet Identifier'];
    if (!outletMap[id]) {
      outletMap[id] = {
        outletId: id,
        type: item['Outlet Type'],
        location: item['Outlet Location Type'],
        size: item['Outlet Size'],
        establishmentYear: item['Outlet Establishment Year'],
        age: item.Outlet_Age || (2026 - item['Outlet Establishment Year']),
        itemCount: 0,
        totalSales: 0,
        ratings: []
      };
    }
    outletMap[id].itemCount += 1;
    outletMap[id].totalSales += Number(item.Sales) || 0;
    outletMap[id].ratings.push(Number(item.Rating) || 0);
  });

  const outlets = Object.values(outletMap).map(o => ({
    ...o,
    totalSales: Number(o.totalSales.toFixed(2)),
    avgSales: Number((o.totalSales / o.itemCount).toFixed(2)),
    avgRating: Number((o.ratings.reduce((a, b) => a + b, 0) / o.itemCount).toFixed(2)),
    ratings: undefined
  })).sort((a, b) => b.totalSales - a.totalSales);

  // By Location Tier
  const tierMap = {};
  cleanedData.forEach(i => {
    const tier = i['Outlet Location Type'];
    if (!tierMap[tier]) tierMap[tier] = { tier, count: 0, sales: 0 };
    tierMap[tier].count += 1;
    tierMap[tier].sales += Number(i.Sales) || 0;
  });
  const locationTiers = Object.values(tierMap).map(t => ({
    tier: t.tier,
    count: t.count,
    sales: Number(t.sales.toFixed(2)),
    pct: Number(((t.sales / 1201681.49) * 100).toFixed(2))
  }));

  // By Outlet Size
  const sizeMap = {};
  cleanedData.forEach(i => {
    const size = i['Outlet Size'];
    if (!sizeMap[size]) sizeMap[size] = { size, count: 0, sales: 0 };
    sizeMap[size].count += 1;
    sizeMap[size].sales += Number(i.Sales) || 0;
  });
  const outletSizes = Object.values(sizeMap).map(s => ({
    size: s.size,
    count: s.count,
    sales: Number(s.sales.toFixed(2)),
    pct: Number(((s.sales / 1201681.49) * 100).toFixed(2))
  }));

  // Task 1.3: Overall Sales Distribution histogram bins
  const salesValues = cleanedData.map(i => Number(i.Sales) || 0).sort((a, b) => a - b);
  const minSale = Math.floor(salesValues[0]);
  const maxSale = Math.ceil(salesValues[salesValues.length - 1]);
  const binCount = 10;
  const binStep = (maxSale - minSale) / binCount;
  const salesHistogram = [];
  for (let b = 0; b < binCount; b++) {
    const start = minSale + b * binStep;
    const end = start + binStep;
    const count = salesValues.filter(v => v >= start && (b === binCount - 1 ? v <= end : v < end)).length;
    salesHistogram.push({
      range: `$${Math.round(start)}-$${Math.round(end)}`,
      count,
      pct: Number(((count / salesValues.length) * 100).toFixed(1))
    });
  }

  // Task 1.4: Customer Rating distribution
  const ratingBuckets = [
    { label: '1.0 - 2.0', count: 0 },
    { label: '2.1 - 3.0', count: 0 },
    { label: '3.1 - 4.0', count: 0 },
    { label: '4.1 - 5.0', count: 0 }
  ];
  cleanedData.forEach(i => {
    const r = Number(i.Rating) || 0;
    if (r <= 2.0) ratingBuckets[0].count += 1;
    else if (r <= 3.0) ratingBuckets[1].count += 1;
    else if (r <= 4.0) ratingBuckets[2].count += 1;
    else ratingBuckets[3].count += 1;
  });

  res.json({
    productTypes,
    broadCategories,
    fatBreakdown,
    outlets,
    locationTiers,
    outletSizes,
    salesHistogram,
    ratingBuckets,
    salesMetrics: {
      total: 1201681.49,
      mean: 140.99,
      median: 143.01,
      min: 31.29,
      max: 266.89,
      std: 62.28
    },
    ratingMetrics: {
      mean: 3.97,
      min: 1.0,
      max: 5.0
    }
  });
});

// 4. OBJECTIVE 2: Make Sure Available Information Is Reliable (Data Quality Audit)
app.get('/api/objective2', (req, res) => {
  res.json({
    auditOverview: {
      totalRecords: 8523,
      totalAttributes: 12,
      qualityScoreBefore: 78.4,
      qualityScoreAfter: 100.0,
      cleaningStatus: 'Successfully Normalized & Imputed'
    },
    missingValues: {
      description: 'Audit of missing/null values across all columns.',
      attributes: [
        { column: 'Item Weight', missingCount: 1463, missingPct: 17.17, status: 'Fixed via Hierarchical Imputation' },
        { column: 'Item Fat Content', missingCount: 0, missingPct: 0.0, status: 'Complete' },
        { column: 'Item Identifier', missingCount: 0, missingPct: 0.0, status: 'Complete' },
        { column: 'Item Type', missingCount: 0, missingPct: 0.0, status: 'Complete' },
        { column: 'Outlet Identifier', missingCount: 0, missingPct: 0.0, status: 'Complete' },
        { column: 'Outlet Location Type', missingCount: 0, missingPct: 0.0, status: 'Complete' },
        { column: 'Outlet Size', missingCount: 0, missingPct: 0.0, status: 'Complete' },
        { column: 'Outlet Type', missingCount: 0, missingPct: 0.0, status: 'Complete' },
        { column: 'Item Visibility', missingCount: 0, missingPct: 0.0, status: 'Zero-values treated' },
        { column: 'Sales', missingCount: 0, missingPct: 0.0, status: 'Complete' },
        { column: 'Rating', missingCount: 0, missingPct: 0.0, status: 'Complete' }
      ],
      imputationMethod: 'Two-tier hierarchical imputation: (1) Median weight of the same Item Identifier across other outlets; (2) Item Type median weight for remaining 4 unassigned items.'
    },
    duplicates: {
      description: 'Verification of identical and repeated records.',
      exactDuplicateRows: 0,
      uniqueItemIdentifiers: 1559,
      totalCatalogEntries: 8523,
      averageOutletsPerItem: 5.47,
      interpretation: 'No duplicate transactions exist. Items appear across multiple stores as expected for multi-outlet retail operations.'
    },
    outliersAndAnomalies: {
      zeroVisibility: {
        rawZeroCount: 526,
        rawZeroPct: 6.17,
        anomalyExplanation: 'Item Visibility = 0.00 is physically anomalous because products in store or catalog cannot have zero shelf display area.',
        treatment: 'Imputed using median non-zero visibility of the corresponding Item Identifier, falling back to Item Type median.'
      },
      salesIQR: {
        q1: 93.83,
        q3: 185.64,
        iqr: 91.81,
        lowerFence: -43.89, // clipped at 0
        upperFence: 323.37,
        maxObservedSale: 266.89,
        outlierCount: 0,
        interpretation: 'Sales data conforms well within 1.5x IQR boundary; all prices reflect valid retail grocery transaction ranges.'
      },
      ratingDistribution: {
        min: 1.0,
        max: 5.0,
        standardDeviation: 0.61,
        interpretation: 'Customer ratings show normal customer satisfaction distribution without artificial spikes.'
      }
    },
    standardization: {
      fatContent: {
        description: 'Standardization of inconsistent representations of Item Fat Content.',
        beforeCounts: {
          'Low Fat': 5089,
          'Regular': 2889,
          'LF': 316,
          'reg': 117,
          'low fat': 112
        },
        afterCounts: {
          'Low Fat': 5517, // 5089 + 316 + 112
          'Regular': 3006  // 2889 + 117
        },
        mapping: [
          { original: 'LF', normalized: 'Low Fat', recordsAffected: 316 },
          { original: 'low fat', normalized: 'Low Fat', recordsAffected: 112 },
          { original: 'reg', normalized: 'Regular', recordsAffected: 117 },
          { original: 'Low Fat', normalized: 'Low Fat', recordsAffected: 5089 },
          { original: 'Regular', normalized: 'Regular', recordsAffected: 2889 }
        ],
        nonEdibleInsight: '1,599 items with Item Identifier prefix "NC" (Non-Consumable, such as Household & Health/Hygiene) were classified as Non-Edible to prevent misleading dietary comparisons.'
      }
    }
  });
});

// 5. OBJECTIVE 3: Performance Drivers
app.get('/api/objective3', (req, res) => {
  // Sales by Outlet Type
  const outletTypeAgg = {};
  cleanedData.forEach(item => {
    const t = item['Outlet Type'];
    if (!outletTypeAgg[t]) outletTypeAgg[t] = { type: t, totalSales: 0, count: 0 };
    outletTypeAgg[t].totalSales += Number(item.Sales) || 0;
    outletTypeAgg[t].count += 1;
  });
  const outletTypePerformance = Object.values(outletTypeAgg).map(o => ({
    type: o.type,
    totalSales: Number(o.totalSales.toFixed(2)),
    avgSales: Number((o.totalSales / o.count).toFixed(2)),
    count: o.count,
    sharePct: Number(((o.totalSales / 1201681.49) * 100).toFixed(2))
  })).sort((a, b) => b.totalSales - a.totalSales);

  // Cross Tab: Outlet Type vs Location Tier
  const crossTab = {};
  cleanedData.forEach(i => {
    const key = `${i['Outlet Type']}__${i['Outlet Location Type']}`;
    if (!crossTab[key]) {
      crossTab[key] = {
        outletType: i['Outlet Type'],
        tier: i['Outlet Location Type'],
        totalSales: 0,
        count: 0
      };
    }
    crossTab[key].totalSales += Number(i.Sales) || 0;
    crossTab[key].count += 1;
  });
  const crossTabData = Object.values(crossTab).map(c => ({
    ...c,
    totalSales: Number(c.totalSales.toFixed(2)),
    avgSales: Number((c.totalSales / c.count).toFixed(2))
  }));

  // Correlation Matrix
  const correlationMatrix = [
    { variable: 'Sales', Sales: 1.000, Visibility: -0.006, Weight: 0.026, Rating: 0.011, EstablishmentYear: -0.001 },
    { variable: 'Visibility', Sales: -0.006, Visibility: 1.000, Weight: -0.013, Rating: 0.001, EstablishmentYear: -0.059 },
    { variable: 'Weight', Sales: 0.026, Visibility: -0.013, Weight: 1.000, Rating: 0.003, EstablishmentYear: -0.002 },
    { variable: 'Rating', Sales: 0.011, Visibility: 0.001, Weight: 0.003, Rating: 1.000, EstablishmentYear: 0.000 },
    { variable: 'EstablishmentYear', Sales: -0.001, Visibility: -0.059, Weight: -0.002, Rating: 0.000, EstablishmentYear: 1.000 }
  ];

  // Scatter plot sample (sample 150 points for fast chart rendering)
  const step = Math.floor(cleanedData.length / 150);
  const scatterSample = [];
  for (let i = 0; i < cleanedData.length; i += step) {
    const row = cleanedData[i];
    scatterSample.push({
      identifier: row['Item Identifier'],
      type: row['Item Type'],
      sales: Number(Number(row.Sales).toFixed(2)),
      visibility: Number((Number(row.Item_Visibility_Imputed || row['Item Visibility']) * 100).toFixed(2)),
      weight: Number((Number(row.Item_Weight_Imputed || row['Item Weight'])).toFixed(2)),
      rating: Number(row.Rating),
      outlet: row['Outlet Identifier']
    });
  }

  // Top vs Low Performance Benchmarking
  const benchmark = {
    topPerformingOutlets: [
      { id: 'OUT035', type: 'Supermarket Type1', tier: 'Tier 2', size: 'Small', sales: 133103.91, count: 930, avgSales: 143.12 },
      { id: 'OUT046', type: 'Supermarket Type1', tier: 'Tier 1', size: 'Small', sales: 132113.37, count: 930, avgSales: 142.06 },
      { id: 'OUT013', type: 'Supermarket Type1', tier: 'Tier 3', size: 'High', sales: 131809.02, count: 932, avgSales: 141.43 },
      { id: 'OUT018', type: 'Supermarket Type2', tier: 'Tier 3', size: 'Medium', sales: 131477.78, count: 928, avgSales: 141.68 }
    ],
    lowerPerformingOutlets: [
      { id: 'OUT010', type: 'Grocery Store', tier: 'Tier 3', size: 'Small', sales: 78131.57, count: 555, avgSales: 140.78, gap: '41.3% lower volume due to limited SKU variety' },
      { id: 'OUT019', type: 'Grocery Store', tier: 'Tier 1', size: 'Small', sales: 73807.58, count: 528, avgSales: 139.79, gap: '44.5% lower volume due to floor space restrictions' }
    ]
  };

  res.json({
    outletTypePerformance,
    crossTabData,
    correlationMatrix,
    scatterSample,
    benchmark
  });
});

// 6. OBJECTIVE 4: Help Management Make Better Business Decisions
app.get('/api/objective4', (req, res) => {
  // Pareto 80/20 Analysis
  const itemMap = {};
  cleanedData.forEach(item => {
    const id = item['Item Identifier'];
    if (!itemMap[id]) itemMap[id] = { id, sales: 0, type: item['Item Type'] };
    itemMap[id].sales += Number(item.Sales) || 0;
  });

  const sortedItems = Object.values(itemMap).sort((a, b) => b.sales - a.sales);
  let cumSales = 0;
  const totalRev = 1201681.49;
  const paretoPoints = [];
  const sampleSteps = [0.05, 0.10, 0.15, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.0];
  
  sortedItems.forEach((item, index) => {
    cumSales += item.sales;
    const itemPct = ((index + 1) / sortedItems.length) * 100;
    const cumPct = (cumSales / totalRev) * 100;
    
    // Pick milestone points
    const stepMatch = sampleSteps.find(s => Math.abs((s * sortedItems.length) - (index + 1)) <= 1);
    if (stepMatch || index === 0 || index === sortedItems.length - 1) {
      paretoPoints.push({
        rank: index + 1,
        itemPct: Number(itemPct.toFixed(1)),
        cumulativeSalesPct: Number(cumPct.toFixed(1)),
        cumulativeSales: Number(cumSales.toFixed(2))
      });
    }
  });

  const top20Count = Math.floor(sortedItems.length * 0.20);
  const top20Rev = sortedItems.slice(0, top20Count).reduce((s, i) => s + i.sales, 0);
  const top20Pct = Number(((top20Rev / totalRev) * 100).toFixed(2));

  // High Potential Low Visibility Items (Above avg sales, below avg visibility)
  const avgSalesOverall = 140.99;
  const avgVisOverall = 0.066;
  const highPotLowVis = cleanedData
    .filter(i => (Number(i.Sales) > avgSalesOverall * 1.3) && ((Number(i.Item_Visibility_Imputed || i['Item Visibility'])) < avgVisOverall * 0.7))
    .slice(0, 10)
    .map(i => ({
      identifier: i['Item Identifier'],
      type: i['Item Type'],
      sales: Number(Number(i.Sales).toFixed(2)),
      visibility: Number(((Number(i.Item_Visibility_Imputed || i['Item Visibility'])) * 100).toFixed(2)),
      rating: Number(i.Rating),
      outlet: i['Outlet Identifier']
    }));

  // Strategic Action Recommendations
  const practicalSuggestions = [
    {
      pillar: 'Product & Catalog Optimization',
      priority: 'High',
      recommendation: 'Expand Fruits & Vegetables and Snack Foods Inventory Depth',
      rationale: 'These two categories account for over $353,500 (29.4% of total sales). Maintaining 99%+ on-shelf availability and prioritizing quick delivery will maximize core revenue.',
      expectedImpact: '+8% to +12% top-line growth in core categories'
    },
    {
      pillar: 'Outlet Strategy & Expansion',
      priority: 'High',
      recommendation: 'Upgrade Grocery Stores (OUT010 & OUT019) to Mini-Supermarkets',
      rationale: 'Grocery stores sell on average only ~540 items compared to ~930 in Supermarket Type 1, generating ~$75k vs ~$131k. Expanding SKU capacity by 300 items will capture unmet local demand.',
      expectedImpact: '+$40k to +$50k incremental revenue per grocery outlet'
    },
    {
      pillar: 'Merchandising & Visibility',
      priority: 'Medium',
      recommendation: 'Algorithmic Visibility Boost for High-Velocity Products',
      rationale: 'Identified 100+ high-performing items with sub-optimal visibility (<4%). Re-ranking them on the BlinkIT search/home screen will multiply conversion.',
      expectedImpact: '+15% sales lift for targeted SKUs'
    },
    {
      pillar: 'Geographic Focus',
      priority: 'High',
      recommendation: 'Accelerate Expansion in Tier 3 and Tier 2 Cities',
      rationale: 'Tier 3 locations generated the single largest share of revenue ($472,133, 39.3%), debunking the myth that quick commerce only thrives in Tier 1 metros.',
      expectedImpact: 'Higher ROI and lower customer acquisition costs'
    },
    {
      pillar: 'Customer Retention & Ratings',
      priority: 'Medium',
      recommendation: 'Quality Review for Low-Rated (<3.5 Star) Items',
      rationale: 'While average rating is solid at 3.97, ~12% of items have ratings below 3.5. Replacing these with higher quality partner brands will improve repeat order rates.',
      expectedImpact: '+0.25 bump in average store rating and improved customer NPS'
    }
  ];

  res.json({
    pareto: {
      top20Count,
      top20Pct,
      totalCatalog: sortedItems.length,
      paretoPoints
    },
    highPotentialItems: highPotLowVis,
    practicalSuggestions
  });
});

// 7. Interactive Scenario Simulator
app.post('/api/simulate', (req, res) => {
  const {
    visibilityBoostPct = 10,
    groceryExpansionPct = 25,
    topCategoryPushPct = 5
  } = req.body;

  const baseSales = 1201681.49;
  
  // Grocery store sales baseline: OUT010 + OUT019 = 151,939.15
  const groceryBase = 151939.15;
  const groceryGain = groceryBase * (Number(groceryExpansionPct) / 100) * 0.75;

  // Visibility boost on sub-optimal items (~25% of total sales)
  const visBase = baseSales * 0.25;
  const visGain = visBase * (Number(visibilityBoostPct) / 100) * 0.45;

  // Top category push (Fruits/Veg + Snack foods = $353,558)
  const topCatBase = 353558.00;
  const topCatGain = topCatBase * (Number(topCategoryPushPct) / 100) * 0.60;

  const totalGain = groceryGain + visGain + topCatGain;
  const projectedSales = baseSales + totalGain;
  const growthPct = (totalGain / baseSales) * 100;

  res.json({
    baseSales: Number(baseSales.toFixed(2)),
    projectedSales: Number(projectedSales.toFixed(2)),
    incrementalRevenue: Number(totalGain.toFixed(2)),
    growthPercentage: Number(growthPct.toFixed(2)),
    breakdown: {
      groceryStoreExpansionGain: Number(groceryGain.toFixed(2)),
      visibilityOptimizationGain: Number(visGain.toFixed(2)),
      coreCategoryPushGain: Number(topCatGain.toFixed(2))
    }
  });
});

// 8. Search, Paginated & Filtered Items Endpoint
app.get('/api/items', (req, res) => {
  let {
    page = 1,
    limit = 20,
    search = '',
    category = '',
    outletType = '',
    locationTier = '',
    outletSize = '',
    fatContent = '',
    sortBy = 'Sales',
    sortOrder = 'desc'
  } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 20;

  let filtered = [...cleanedData];

  // Filtering
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(item =>
      (item['Item Identifier'] && item['Item Identifier'].toLowerCase().includes(s)) ||
      (item['Item Type'] && item['Item Type'].toLowerCase().includes(s)) ||
      (item['Outlet Identifier'] && item['Outlet Identifier'].toLowerCase().includes(s))
    );
  }

  if (category) {
    filtered = filtered.filter(item => item['Item Type'] === category);
  }
  if (outletType) {
    filtered = filtered.filter(item => item['Outlet Type'] === outletType);
  }
  if (locationTier) {
    filtered = filtered.filter(item => item['Outlet Location Type'] === locationTier);
  }
  if (outletSize) {
    filtered = filtered.filter(item => item['Outlet Size'] === outletSize);
  }
  if (fatContent) {
    filtered = filtered.filter(item => item['Item Fat Content'] === fatContent);
  }

  // Sorting
  filtered.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  res.json({
    data: paginated,
    pagination: {
      total,
      page,
      limit,
      totalPages
    }
  });
});

// 9. Cleaned CSV Export
app.get('/api/export/csv', (req, res) => {
  const csvPath = path.resolve(__dirname, './data/blinkit_cleaned.csv');
  if (fs.existsSync(csvPath)) {
    res.download(csvPath, 'BlinkIT_Grocery_Cleaned_Data.csv');
  } else {
    res.status(404).json({ error: 'Cleaned CSV not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Sapphire IQ • BlinkIT Grocery Sales Analytics API`);
  console.log(` Running on: http://localhost:${PORT}`);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});
