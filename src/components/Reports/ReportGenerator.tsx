import React, { useState } from 'react';
import { FileText, BarChart3, TrendingUp, Package, Download } from 'lucide-react';

interface ReportGeneratorProps {
  onGenerateReport: (report: any) => void;
}

export default function ReportGenerator({ onGenerateReport }: ReportGeneratorProps) {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [format, setFormat] = useState('PDF');

  const reportTypes = [
    {
      id: 'profit-loss',
      name: 'Profit & Loss Statement',
      description: 'Revenue, expenses, and net income analysis',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      id: 'balance-sheet',
      name: 'Balance Sheet',
      description: 'Assets, liabilities, and equity overview',
      icon: BarChart3,
      color: 'green'
    },
    {
      id: 'cash-flow',
      name: 'Cash Flow Statement',
      description: 'Cash inflows and outflows analysis',
      icon: FileText,
      color: 'purple'
    },
    {
      id: 'sales-report',
      name: 'Sales Performance Report',
      description: 'Sales trends and customer analysis',
      icon: TrendingUp,
      color: 'orange'
    },
    {
      id: 'inventory-report',
      name: 'Inventory Valuation Report',
      description: 'Stock levels and inventory value',
      icon: Package,
      color: 'indigo'
    },
    {
      id: 'customer-report',
      name: 'Customer Analysis Report',
      description: 'Customer behavior and sales patterns',
      icon: FileText,
      color: 'pink'
    }
  ];

  const handleGenerate = () => {
    const reportType = reportTypes.find(r => r.id === selectedReport);
    if (!reportType) return;

    const newReport = {
      id: Date.now().toString(),
      name: reportType.name,
      type: reportType.id.includes('sales') || reportType.id.includes('customer') ? 'sales' : 
            reportType.id.includes('inventory') ? 'inventory' : 'financial',
      description: reportType.description,
      lastGenerated: new Date().toISOString().split('T')[0],
      frequency: 'on-demand',
      format: format,
      dateRange: `${dateRange.startDate} to ${dateRange.endDate}`
    };

    onGenerateReport(newReport);
    alert(`${reportType.name} has been generated successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Report Type</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map(report => {
            const Icon = report.icon;
            const isSelected = selectedReport === report.id;
            
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 bg-${report.color}-50 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${report.color}-600`} />
                  </div>
                  <h4 className="font-medium text-slate-900">{report.name}</h4>
                </div>
                <p className="text-sm text-slate-600">{report.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Configuration */}
      {selectedReport && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGenerate}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Reports Generated</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">24</p>
              <p className="text-sm text-slate-500 mt-1">This month</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Scheduled Reports</p>
              <p className="text-2xl font-bold text-green-600 mt-2">8</p>
              <p className="text-sm text-slate-500 mt-1">Active</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Data Sources</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">5</p>
              <p className="text-sm text-slate-500 mt-1">Connected</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Export Size</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">2.1MB</p>
              <p className="text-sm text-slate-500 mt-1">Average</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}