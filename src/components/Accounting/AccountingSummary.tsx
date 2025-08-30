import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface AccountingSummaryProps {
  accounts: any[];
  journalEntries: any[];
}

export default function AccountingSummary({ accounts, journalEntries }: AccountingSummaryProps) {
  const totalAssets = accounts
    .filter(acc => acc.accountType === 'Asset')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalLiabilities = accounts
    .filter(acc => acc.accountType === 'Liability')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalEquity = accounts
    .filter(acc => acc.accountType === 'Equity')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalJournalEntries = journalEntries.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Assets</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              ${totalAssets.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Liabilities</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              ${totalLiabilities.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Owner's Equity</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              ${totalEquity.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Journal Entries</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalJournalEntries}</p>
            <p className="text-sm text-slate-500 mt-1">This month</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}