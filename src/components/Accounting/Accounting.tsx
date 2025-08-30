import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ChartOfAccounts from './ChartOfAccounts';
import JournalEntries from './JournalEntries';
import FinancialReports from './FinancialReports';
import AccountingSummary from './AccountingSummary';
import { mockAccounts, mockJournalEntries } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function Accounting() {
  const [activeTab, setActiveTab] = useState<'accounts' | 'journal' | 'reports'>('accounts');
  const [accounts, setAccounts] = useLocalStorage('accounts', mockAccounts);
  const [journalEntries, setJournalEntries] = useLocalStorage('journalEntries', mockJournalEntries);

  const tabs = [
    { id: 'accounts', label: 'Chart of Accounts' },
    { id: 'journal', label: 'Journal Entries' },
    { id: 'reports', label: 'Financial Reports' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Accounting</h2>
        {activeTab === 'journal' && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>New Journal Entry</span>
          </button>
        )}
      </div>

      <AccountingSummary accounts={accounts} journalEntries={journalEntries} />

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
      {activeTab === 'accounts' && (
        <ChartOfAccounts 
          accounts={accounts}
          onUpdateAccounts={setAccounts}
        />
      )}

      {activeTab === 'journal' && (
        <JournalEntries 
          journalEntries={journalEntries}
          accounts={accounts}
          onUpdateJournalEntries={setJournalEntries}
        />
      )}

      {activeTab === 'reports' && (
        <FinancialReports 
          accounts={accounts}
          journalEntries={journalEntries}
        />
      )}
    </div>
  );
}