import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Download, X } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Account = Database['public']['Tables']['accounts']['Row'];
type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
type AccountUpdate = Database['public']['Tables']['accounts']['Update'];

interface ChartOfAccountsProps {
  accounts: Account[];
  createAccount: (account: AccountInsert) => Promise<Account | null>;
  updateAccount: (id: string, updates: AccountUpdate) => Promise<Account | null>;
  removeAccount: (id: string) => Promise<boolean>;
}

export default function ChartOfAccounts({ accounts, createAccount, updateAccount, removeAccount }: ChartOfAccountsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    account_number: '',
    account_name: '',
    account_type: '' as 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense' | '',
    category: '',
    balance: 0,
    description: ''
  });

  const accountTypes: ('Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense')[] = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];
  
  const categories = {
    'Asset': ['Current Assets', 'Fixed Assets', 'Other Assets'],
    'Liability': ['Current Liabilities', 'Long-term Liabilities'],
    'Equity': ['Owner Equity', 'Retained Earnings'],
    'Revenue': ['Sales Revenue', 'Service Revenue', 'Other Revenue'],
    'Expense': ['Operating Expenses', 'Administrative Expenses', 'Other Expenses']
  };

  const resetForm = () => {
    setFormData({
      account_number: '',
      account_name: '',
      account_type: '' as any,
      category: '',
      balance: 0,
      description: ''
    });
    setEditingAccount(null);
    setShowForm(false);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      account_number: account.account_number,
      account_name: account.account_name,
      account_type: account.account_type,
      category: account.category,
      balance: account.balance,
      description: account.description || ''
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const accountData: AccountInsert | AccountUpdate = {
      account_number: formData.account_number,
      account_name: formData.account_name,
      account_type: formData.account_type as 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense',
      category: formData.category,
      balance: formData.balance,
      description: formData.description || null
    };

    if (editingAccount) {
      await updateAccount(editingAccount.id, accountData);
    } else {
      await createAccount(accountData);
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      await removeAccount(id);
    }
  };

  const filteredAccounts = accounts
    .filter(account => filter === 'all' || account.account_type === filter)
    .filter(account =>
      searchTerm === '' ||
      account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.account_number.includes(searchTerm)
    );

  const exportToCSV = () => {
    const headers = ['Account Number', 'Account Name', 'Type', 'Category', 'Balance'];
    const csvContent = [
      headers.join(','),
      ...filteredAccounts.map(acc => [
        acc.account_number,
        `"${acc.account_name}"`,
        acc.account_type,
        `"${acc.category}"`,
        acc.balance.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart-of-accounts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-slate-900">Chart of Accounts</h3>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search accounts..."
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
                {accountTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export</span>
              </button>

              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Account</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Account #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Account Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{account.account_number}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{account.account_name}</p>
                      <p className="text-xs text-slate-500">{account.description || ''}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{account.account_type}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{account.category}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <span className={account.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${Math.abs(account.balance).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(account)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingAccount ? 'Edit Account' : 'Add Account'}
              </h3>
              <button onClick={resetForm} className="p-1 rounded-md hover:bg-slate-100">
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={formData.account_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Account Name</label>
                <input
                  type="text"
                  value={formData.account_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, account_name: e.target.value }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Account Type</label>
                <select
                  value={formData.account_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, account_type: e.target.value as any, category: '' }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  {accountTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!formData.account_type}
                >
                  <option value="">Select Category</option>
                  {formData.account_type && categories[formData.account_type as keyof typeof categories]?.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Opening Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingAccount ? 'Update' : 'Add'} Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}