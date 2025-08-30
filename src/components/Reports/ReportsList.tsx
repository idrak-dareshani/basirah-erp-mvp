import React, { useState } from 'react';
import { FileText, Download, Trash2, Calendar, Search } from 'lucide-react';

interface ReportsListProps {
  reports: any[];
  onDeleteReport: (id: string) => void;
}

export default function ReportsList({ reports, onDeleteReport }: ReportsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filteredReports = reports
    .filter(report => filter === 'all' || report.type === filter)
    .filter(report =>
      searchTerm === '' ||
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'financial': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'sales': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'inventory': return <Package className="w-5 h-5 text-purple-600" />;
      default: return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'bg-blue-100 text-blue-800';
      case 'sales': return 'bg-green-100 text-green-800';
      case 'inventory': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const downloadReport = (reportName: string) => {
    alert(`Downloading ${reportName}...`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-slate-900">Saved Reports</h3>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="financial">Financial</option>
                <option value="sales">Sales</option>
                <option value="inventory">Inventory</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map(report => (
              <div key={report.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                      {getReportIcon(report.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{report.name}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteReport(report.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <p className="text-sm text-slate-600 mb-3">{report.description}</p>
                
                <div className="space-y-2 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Generated:</span>
                    <span>{new Date(report.lastGenerated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span>{report.format}</span>
                  </div>
                  {report.dateRange && (
                    <div className="flex justify-between">
                      <span>Period:</span>
                      <span>{report.dateRange}</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => downloadReport(report.name)}
                  className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
          
          {filteredReports.length === 0 && (
            <div className="text-center py-8">
              <div className="text-slate-500 mb-4">
                {searchTerm || filter !== 'all'
                  ? 'No reports match your search criteria.'
                  : 'No reports found. Generate your first report to get started.'
                }
              </div>
              {(searchTerm || filter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}