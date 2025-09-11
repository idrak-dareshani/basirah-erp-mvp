import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Download, Eye, X, Plus } from 'lucide-react';

interface JournalEntriesProps {
  journalEntries: any[];
  accounts: any[];
  onUpdateJournalEntries: (entries: any[]) => void;
}

export default function JournalEntries({ journalEntries, accounts, onUpdateJournalEntries }: JournalEntriesProps) {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const exportToCSV = () => {
    const headers = ['Entry Number', 'Date', 'Description', 'Reference', 'Total Debit', 'Total Credit', 'Status'];
    const csvContent = [
      headers.join(','),
      ...journalEntries.map(entry => [
        entry.entryNumber,
        entry.date,
        `"${entry.description}"`,
        entry.reference || '',
        entry.totalDebit.toFixed(2),
        entry.totalCredit.toFixed(2),
        entry.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-entries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredEntries = journalEntries.filter(entry =>
    searchTerm === '' ||
    entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.reference && entry.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-slate-900">Journal Entries</h3>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Entry #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Debit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Credit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{entry.entryNumber}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{entry.description}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{entry.reference || '-'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    ${entry.totalDebit.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    ${entry.totalCredit.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => setShowDetails(entry)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Journal Entry Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                Journal Entry Details - {showDetails.entryNumber}
              </h3>
              <button
                onClick={() => setShowDetails(null)}
                className="p-1 rounded-md hover:bg-slate-100"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Entry Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Entry Number:</span>
                      <span className="text-sm font-medium">{showDetails.entryNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Date:</span>
                      <span className="text-sm font-medium">{new Date(showDetails.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Reference:</span>
                      <span className="text-sm font-medium">{showDetails.reference || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(showDetails.status)}`}>
                        {showDetails.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Description</h4>
                  <p className="text-sm text-slate-900">{showDetails.description}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Journal Entry Details</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-slate-200 rounded-lg">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Account</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Debit</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Credit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {showDetails.entries.map((entry: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-slate-900">{entry.account}</td>
                          <td className="px-4 py-2 text-sm font-medium text-green-600">
                            {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : '-'}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-blue-600">
                            {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-medium">
                        <td className="px-4 py-2 text-sm text-slate-900">Total:</td>
                        <td className="px-4 py-2 text-sm font-bold text-green-600">
                          ${showDetails.totalDebit.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm font-bold text-blue-600">
                          ${showDetails.totalCredit.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}