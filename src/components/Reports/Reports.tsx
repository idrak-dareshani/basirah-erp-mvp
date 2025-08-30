import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart3, TrendingUp, Package } from 'lucide-react';
import ReportGenerator from './ReportGenerator';
import ReportsList from './ReportsList';
import { mockReports } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function Reports() {
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate');
  const [reports, setReports] = useLocalStorage('reports', mockReports);

  const tabs = [
    { id: 'generate', label: 'Generate Reports' },
    { id: 'saved', label: 'Saved Reports' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'generate' && (
        <ReportGenerator onGenerateReport={(report) => setReports(prev => [report, ...prev])} />
      )}

      {activeTab === 'saved' && (
        <ReportsList 
          reports={reports}
          onDeleteReport={(id) => setReports(prev => prev.filter(r => r.id !== id))}
        />
      )}
    </div>
  );
}