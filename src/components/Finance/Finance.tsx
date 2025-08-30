import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import FinanceSummary from './FinanceSummary';
import { useSupabaseTable } from '../../hooks/useSupabase';
import { Database } from '../../lib/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

export default function Finance() {
  const { 
    data: transactions, 
    loading, 
    error, 
    create, 
    update, 
    remove, 
    bulkRemove 
  } = useSupabaseTable('transactions');
  
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleSave = async (transactionData: any) => {
    if (editingTransaction) {
      await update(editingTransaction.id, transactionData);
    } else {
      await create(transactionData);
    }
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await remove(id);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    await bulkRemove(ids);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Finance Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      <FinanceSummary transactions={transactions} />
      
      <TransactionList 
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
      />

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
}