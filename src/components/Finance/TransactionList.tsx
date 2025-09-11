import React, { useState } from 'react';
import { Edit, Trash2, Filter, Search, Download, Upload, Trash, Plus } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onShowAddForm?: () => void;
}

export default function TransactionList({ transactions, onEdit, onDelete, onBulkDelete, onShowAddForm }: TransactionListProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredTransactions = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => 
      searchTerm === '' || 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.reference && t.reference.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const multiplier = sortOrder === 'desc' ? -1 : 1;
      if (sortBy === 'date') {
        return (new Date(b.date).getTime() - new Date(a.date).getTime()) * multiplier;
      }
      return (b.amount - a.amount) * multiplier;
    });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredTransactions.map(t => t.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length > 0 && onBulkDelete) {
      if (confirm(`Are you sure you want to delete ${selectedItems.length} transactions?`)) {
        onBulkDelete(selectedItems);
        setSelectedItems([]);
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount', 'Reference', 'Balance', 'Created'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.id.slice(0, 8),
        t.date,
        t.type,
        t.category,
        `"${t.description}"`,
        t.amount,
        t.reference || '',
        calculateRunningBalance(t, filteredTransactions),
        new Date(t.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const calculateRunningBalance = (currentTransaction: Transaction, allTransactions: Transaction[]) => {
    const sortedTransactions = allTransactions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let balance = 0;
    for (const transaction of sortedTransactions) {
      if (transaction.type === 'income') {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
      if (transaction.id === currentTransaction.id) break;
    }
    return balance;
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-slate-900">Transactions</h3>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'income' | 'expense')}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>

            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export</span>
            </button>

            <button
              onClick={() => onShowAddForm?.()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
        
        {selectedItems.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-1 text-sm"
            >
              <Trash size={14} />
              <span>Delete Selected</span>
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredTransactions.length && filteredTransactions.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(transaction.id)}
                    onChange={(e) => handleSelectItem(transaction.id, e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{transaction.description}</p>
                    {transaction.reference && (
                      <p className="text-xs text-slate-500">Ref: {transaction.reference}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">{transaction.category}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-500">
                  {transaction.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  {transaction.reference || '-'}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <span className="text-blue-600">
                    ${calculateRunningBalance(transaction, filteredTransactions).toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(transaction.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
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
      
      {filteredTransactions.length === 0 && (
        <div className="p-8 text-center">
          <div className="text-slate-500 mb-4">
            {searchTerm || filter !== 'all' 
              ? 'No transactions match your search criteria.' 
              : 'No transactions found. Create your first transaction to get started.'
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
  );
}