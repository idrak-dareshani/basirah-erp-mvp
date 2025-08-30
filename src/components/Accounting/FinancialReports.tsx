import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart3, Package } from 'lucide-react';
import { mockReports } from '../../data/mockData';

interface FinancialReportsProps {
  accounts: any[];
  journalEntries: any[];
}

export default function FinancialReports({ accounts, journalEntries }: FinancialReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [reports] = useState(mockReports);

  const generateReport = (reportType: string) => {
    // Mock report generation
    alert(`Generating ${reportType} report for ${selectedPeriod}...`);
  };

  const downloadReport = (reportName: string) => {
    // Mock download
    alert(`Downloading ${reportName}...`);
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'financial': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'sales': return <BarChart3 className="w-5 h-5 text-green-600" />;
      case 'inventory': return <Package className="w-5 h-5 text-purple-600" />;
      default: return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  // Generate sample P&L data
  const assets = accounts.filter(acc => acc.accountType === 'Asset');
  const liabilities = accounts.filter(acc => acc.accountType === 'Liability');
  const equity = accounts.filter(acc => acc.accountType === 'Equity');

  const totalAssets = assets.reduce((sum, acc) => sum + acc.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, acc) => sum + acc.balance, 0);
  const totalEquity = equity.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="space-y-6">
      {/* Report Generation Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-slate-900">Financial Reports</h3>
          
          <div className="flex flex-wrap gap-3">
            <input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <button
              onClick={() => generateReport('Balance Sheet')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FileText size={16} />
              <span>Generate Balance Sheet</span>
            </button>

            <button
              onClick={() => generateReport('P&L Statement')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <BarChart3 size={16} />
              <span>Generate P&L</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Balance Sheet View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Balance Sheet Summary</h4>
          
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-slate-700 mb-2">Assets</h5>
              <div className="space-y-1">
                {assets.map(asset => (
                  <div key={asset.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{asset.accountName}</span>
                    <span className="font-medium">${asset.balance.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold border-t pt-2">
                  <span>Total Assets</span>
                  <span>${totalAssets.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-slate-700 mb-2">Liabilities</h5>
              <div className="space-y-1">
                {liabilities.map(liability => (
                  <div key={liability.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{liability.accountName}</span>
                    <span className="font-medium">${liability.balance.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold border-t pt-2">
                  <span>Total Liabilities</span>
                  <span>${totalLiabilities.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-slate-700 mb-2">Equity</h5>
              <div className="space-y-1">
                {equity.map(eq => (
                  <div key={eq.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{eq.accountName}</span>
                    <span className="font-medium">${eq.balance.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold border-t pt-2">
                  <span>Total Equity</span>
                  <span>${totalEquity.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Reports */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Available Reports</h4>
          
          <div className="space-y-3">
            {reports.map(report => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    {getReportIcon(report.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{report.name}</p>
                    <p className="text-xs text-slate-500">{report.description}</p>
                    <p className="text-xs text-slate-400">Last: {new Date(report.lastGenerated).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => downloadReport(report.name)}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50"
                  title="Download Report"
                >
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}