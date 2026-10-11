import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import FilterBar from './components/FilterBar';
import OverviewTab from './components/tabs/OverviewTab';
import Objective1Tab from './components/tabs/Objective1Tab';
import Objective2Tab from './components/tabs/Objective2Tab';
import Objective3Tab from './components/tabs/Objective3Tab';
import Objective4Tab from './components/tabs/Objective4Tab';
import DataExplorerTab from './components/tabs/DataExplorerTab';
import NotebookTab from './components/tabs/NotebookTab';
import ScenarioSimulatorModal from './components/tabs/ScenarioSimulatorModal';

import {
  fetchHealth,
  fetchOverview,
  fetchFilters,
  fetchObjective1,
  fetchObjective2,
  fetchObjective3,
  fetchObjective4
} from './api';

import {
  BarChart3,
  CheckCircle,
  Database,
  TrendingUp,
  Lightbulb,
  Table,
  BookOpen,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [apiHealthy, setApiHealthy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Data states
  const [overview, setOverview] = useState(null);
  const [filters, setFilters] = useState(null);
  const [obj1Data, setObj1Data] = useState(null);
  const [obj2Data, setObj2Data] = useState(null);
  const [obj3Data, setObj3Data] = useState(null);
  const [obj4Data, setObj4Data] = useState(null);

  // Active filters
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    outletType: '',
    locationTier: '',
    outletSize: '',
    fatContent: ''
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [h, ov, filt, o1, o2, o3, o4] = await Promise.all([
        fetchHealth().catch(() => ({ status: 'error' })),
        fetchOverview().catch(() => null),
        fetchFilters().catch(() => null),
        fetchObjective1().catch(() => null),
        fetchObjective2().catch(() => null),
        fetchObjective3().catch(() => null),
        fetchObjective4().catch(() => null)
      ]);

      setApiHealthy(h.status === 'healthy');
      setOverview(ov);
      setFilters(filt);
      setObj1Data(o1);
      setObj2Data(o2);
      setObj3Data(o3);
      setObj4Data(o4);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setApiHealthy(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setActiveFilters({
      category: '',
      outletType: '',
      locationTier: '',
      outletSize: '',
      fatContent: ''
    });
  };

  const navTabs = [
    { id: 'overview', label: 'Executive Overview', icon: BarChart3, badge: null },
    { id: 'obj1', label: 'Obj 1: Business & Sales', icon: TrendingUp, badge: 'Tasks 1.1-1.4' },
    { id: 'obj2', label: 'Obj 2: Data Reliability', icon: Database, badge: 'Tasks 2.1-2.4' },
    { id: 'obj3', label: 'Obj 3: Sales Drivers', icon: CheckCircle, badge: 'Tasks 3.1-3.4' },
    { id: 'obj4', label: 'Obj 4: Management Strategy', icon: Lightbulb, badge: 'Tasks 4.1-4.4' },
    { id: 'explorer', label: 'Data Explorer', icon: Table, badge: '8,523 Rows' },
    { id: 'notebook', label: 'Python & Jupyter Guide', icon: BookOpen, badge: 'Student Code' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header */}
      <Header
        apiHealthy={apiHealthy}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onRefresh={loadAllData}
        loading={loading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* KPI Ribbons */}
        <KpiCards overview={overview} />

        {/* Multi-Dimensional Filter Slicers Bar */}
        <FilterBar
          filters={filters}
          activeFilters={activeFilters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 mb-6 border-b border-slate-200 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    isActive ? 'bg-blue-500/40 text-blue-100' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        {activeTab === 'overview' && (
          <OverviewTab
            obj1Data={obj1Data}
            obj3Data={obj3Data}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'obj1' && (
          <Objective1Tab data={obj1Data} />
        )}

        {activeTab === 'obj2' && (
          <Objective2Tab data={obj2Data} />
        )}

        {activeTab === 'obj3' && (
          <Objective3Tab data={obj3Data} />
        )}

        {activeTab === 'obj4' && (
          <Objective4Tab
            data={obj4Data}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
          />
        )}

        {activeTab === 'explorer' && (
          <DataExplorerTab filters={filters} />
        )}

        {activeTab === 'notebook' && (
          <NotebookTab />
        )}

      </main>

      {/* Scenario Simulator Modal */}
      <ScenarioSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">Sapphire IQ</span>
            <span>• Data Analytics Student Project: BlinkIT Grocery Sales</span>
          </div>
          <div>
            Built with <strong>React, Tailwind CSS, Recharts, Node.js, Express & Python</strong> by Ram
          </div>
        </div>
      </footer>

    </div>
  );
}
