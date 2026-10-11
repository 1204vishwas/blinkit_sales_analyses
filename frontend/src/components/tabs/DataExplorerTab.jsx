import React, { useState, useEffect } from 'react';
import { Search, Download, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Check, X } from 'lucide-react';
import { fetchItems, getExportUrl } from '../../api';

export default function DataExplorerTab({ filters }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOutletType, setSelectedOutletType] = useState('');
  const [selectedLocationTier, setSelectedLocationTier] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFat, setSelectedFat] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [sortBy, setSortBy] = useState('Sales');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [selectedItem, setSelectedItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchItems({
        page,
        limit,
        search,
        category: selectedCategory,
        outletType: selectedOutletType,
        locationTier: selectedLocationTier,
        outletSize: selectedSize,
        fatContent: selectedFat,
        sortBy,
        sortOrder
      });
      setItems(res.data || []);
      setPagination(res.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, limit, search, selectedCategory, selectedOutletType, selectedLocationTier, selectedSize, selectedFat, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Item Identifier (e.g. FDX32), Category, or Outlet..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Stats & Export */}
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-500">
              Showing <strong>{(items.length).toLocaleString()}</strong> of <strong>{(pagination.total).toLocaleString()}</strong> rows
            </span>
            <a
              href={getExportUrl()}
              download="BlinkIT_Grocery_Cleaned_Data.csv"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </a>
          </div>

        </div>

        {/* Filter Slicers Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-3 pt-3 border-t border-slate-100">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700"
          >
            <option value="">All Categories</option>
            {filters?.categories?.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={selectedOutletType}
            onChange={(e) => { setSelectedOutletType(e.target.value); setPage(1); }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700"
          >
            <option value="">All Outlet Types</option>
            {filters?.outletTypes?.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            value={selectedLocationTier}
            onChange={(e) => { setSelectedLocationTier(e.target.value); setPage(1); }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700"
          >
            <option value="">All Location Tiers</option>
            {filters?.locationTiers?.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            value={selectedSize}
            onChange={(e) => { setSelectedSize(e.target.value); setPage(1); }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700"
          >
            <option value="">All Outlet Sizes</option>
            {filters?.outletSizes?.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={selectedFat}
            onChange={(e) => { setSelectedFat(e.target.value); setPage(1); }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700"
          >
            <option value="">All Fat Content</option>
            {filters?.fatContents?.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('Item Identifier')}>
                  <div className="flex items-center space-x-1">
                    <span>Item ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('Item Type')}>
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('Item Fat Content')}>
                  <div className="flex items-center space-x-1">
                    <span>Fat Content</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('Outlet Identifier')}>
                  <div className="flex items-center space-x-1">
                    <span>Outlet ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Outlet Type</th>
                <th className="py-3 px-3">Location Tier</th>
                <th className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('Item Weight')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>Weight (kg)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('Item Visibility')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>Visibility</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('Rating')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>Rating</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100" onClick={() => handleSort('Sales')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>Sales ($)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">Loading records...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">No records found matching current criteria.</td>
                </tr>
              ) : (
                items.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{row['Item Identifier']}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{row['Item Type']}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row['Item Fat Content'] === 'Regular' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {row['Item Fat Content']}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{row['Outlet Identifier']}</td>
                    <td className="py-2.5 px-3 text-slate-600">{row['Outlet Type']}</td>
                    <td className="py-2.5 px-3 text-slate-600">{row['Outlet Location Type']}</td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {row.Item_Weight_Imputed ? `${Number(row.Item_Weight_Imputed).toFixed(2)}` : row['Item Weight'] ? `${Number(row['Item Weight']).toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {((Number(row.Item_Visibility_Imputed || row['Item Visibility'])) * 100).toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-amber-600">
                      {row.Rating} ★
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      ${Number(row.Sales).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => setSelectedItem(row)}
                        className="p-1 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded transition-colors"
                        title="View Full Item Specs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500">
              Page <strong>{page}</strong> of <strong>{pagination.totalPages || 1}</strong>
            </span>
            <div className="flex space-x-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded">
                SKU Specification
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">{selectedItem['Item Identifier']}</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mt-2">{selectedItem['Item Type']}</h3>

            <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-slate-400 text-[10px]">Gross Sales</p>
                <p className="text-base font-extrabold text-slate-900">${Number(selectedItem.Sales).toFixed(2)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-slate-400 text-[10px]">Customer Rating</p>
                <p className="text-base font-extrabold text-amber-600">{selectedItem.Rating} ★</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-slate-400 text-[10px]">Standardized Fat Content</p>
                <p className="font-semibold text-slate-800">{selectedItem['Item Fat Content']}</p>
                {selectedItem.Item_Fat_Content_Raw && (
                  <p className="text-[10px] text-slate-400">Raw: {selectedItem.Item_Fat_Content_Raw}</p>
                )}
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-slate-400 text-[10px]">Weight (kg)</p>
                <p className="font-semibold text-slate-800">{Number(selectedItem.Item_Weight_Imputed || selectedItem['Item Weight']).toFixed(2)} kg</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-slate-400 text-[10px]">Shelf Visibility</p>
                <p className="font-semibold text-slate-800">{((Number(selectedItem.Item_Visibility_Imputed || selectedItem['Item Visibility'])) * 100).toFixed(2)}%</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-slate-400 text-[10px]">Outlet Fulfillment Hub</p>
                <p className="font-semibold text-slate-800">{selectedItem['Outlet Identifier']}</p>
                <p className="text-[10px] text-slate-400">{selectedItem['Outlet Type']} • {selectedItem['Outlet Location Type']}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
