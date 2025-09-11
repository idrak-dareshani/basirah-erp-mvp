```typescript
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Database } from '../../lib/database.types';

type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];
type JournalEntryInsert = Database['public']['Tables']['journal_entries']['Insert'];
type JournalEntryUpdate = Database['public']['Tables']['journal_entries']['Update'];
type Account = Database['public']['Tables']['accounts']['Row'];

interface JournalEntryItemForm {
  id: string; // Client-side ID for managing items in the form
  account_id: string; // Supabase account ID
  account_name: string; // Display name for the account
  debit: number;
  credit: number;
}

interface JournalEntryFormProps {
  journalEntry?: JournalEntry | null;
  accounts: Account[];
  onSave: (entry: JournalEntryInsert | JournalEntryUpdate) => void;
  onCancel: () => void;
}

export default function JournalEntryForm({ journalEntry, accounts, onSave, onCancel }: JournalEntryFormProps) {
  const [formData, setFormData] = useState({
    entry_number: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    status: 'draft' as 'draft' | 'posted' | 'voided',
    entries: [] as JournalEntryItemForm[],
  });
  const [balanceError, setBalanceError] = useState(false);

  useEffect(() => {
    if (journalEntry) {
      // When editing, populate form with existing data
      // Note: journal_entry_items are not directly in journal_entries table row,
      // so we'd need to fetch them or pass them from parent.
      // For now, we'll assume a simplified structure or mock them for editing.
      // In a real app, you'd fetch journal_entry_items related to this journalEntry.id
      setFormData({
        entry_number: journalEntry.entry_number,
        date: journalEntry.date,
        description: journalEntry.description,
        reference: journalEntry.reference || '',
        status: journalEntry.status,
        // This part needs actual data from journal_entry_items table
        // For now, we'll use a placeholder or assume it's handled by parent
        entries: [], // Placeholder: actual items would be loaded here
      });
    } else {
      // Generate a new entry number for new entries
      const timestamp = Date.now().toString().slice(-6);
      setFormData(prev => ({
        ...prev,
        entry_number: \`JE-${timestamp}`,
        entries: [{ id: \`item-${Date.now()}-1`, account_id: '', account_name: '', debit: 0, credit: 0 }],
      }));
    }
  }, [journalEntry]);

  const addEntry = () => {
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, { id: \`item-${Date.now()}-${prev.entries.length + 1}`, account_id: '', account_name: '', debit: 0, credit: 0 }],
    }));
  };

  const updateEntry = (index: number, field: keyof JournalEntryItemForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'account_id' && value) {
            const selectedAccount = accounts.find(acc => acc.id === value);
            if (selectedAccount) {
              updatedItem.account_name = selectedAccount.account_name;
            }
          }
          // Ensure only one of debit/credit has a value
          if (field === 'debit' && value > 0) {
            updatedItem.credit = 0;
          } else if (field === 'credit' && value > 0) {
            updatedItem.debit = 0;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.filter(item => item.id !== id),
    }));
  };

  const totalDebit = formData.entries.reduce((sum, item) => sum + (item.debit || 0), 0);
  const totalCredit = formData.entries.reduce((sum, item) => sum + (item.credit || 0), 0);

  useEffect(() => {
    setBalanceError(totalDebit !== totalCredit);
  }, [totalDebit, totalCredit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (balanceError) {
      alert('Total Debits must equal Total Credits.');
      return;
    }

    // Basic validation for entries
    const isValidEntries = formData.entries.every(item =>
      item.account_id && ((item.debit > 0 && item.credit === 0) || (item.credit > 0 && item.debit === 0))
    );

    if (!isValidEntries) {
      alert('Each journal entry item must have an account and either a debit or a credit amount.');
      return;
    }

    const entryData: JournalEntryInsert | JournalEntryUpdate = {
      entry_number: formData.entry_number,
      date: formData.date,
      description: formData.description,
      reference: formData.reference || null,
      status: formData.status,
      total_debit: totalDebit,
      total_credit: totalCredit,
    };

    // Pass entries separately if the API expects them
    onSave({ ...entryData, items: formData.entries });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            {journalEntry ? 'Edit Journal Entry' : 'Create Journal Entry'}
          </h3>
          <button onClick={onCancel} className="p-1 rounded-md hover:bg-slate-100">
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Entry Number</label>
              <input
                type="text"
                value={formData.entry_number}
                onChange={(e) => setFormData(prev => ({ ...prev, entry_number: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Brief description of the transaction"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Reference (Optional)</label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Invoice #, Check #, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'posted' | 'voided' }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="posted">Posted</option>
                <option value="voided">Voided</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-slate-900">Journal Entry Items</h4>
              <button
                type="button"
                onClick={addEntry}
                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Line Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.entries.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg">
                  <div className="flex-1">
                    <select
                      value={item.account_id}
                      onChange={(e) => updateEntry(index, 'account_id', e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Account</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.account_name} ({account.account_number})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-32">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.debit === 0 ? '' : item.debit} // Display empty if 0
                      onChange={(e) => updateEntry(index, 'debit', parseFloat(e.target.value) || 0)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Debit"
                    />
                  </div>

                  <div className="w-32">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.credit === 0 ? '' : item.credit} // Display empty if 0
                      onChange={(e) => updateEntry(index, 'credit', parseFloat(e.target.value) || 0)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Credit"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {balanceError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                Total Debits and Total Credits must balance.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                <span className="text-sm font-medium text-slate-700">Total Debits:</span>
                <span className="text-lg font-bold text-green-600">${totalDebit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                <span className="text-sm font-medium text-slate-700">Total Credits:</span>
                <span className="text-lg font-bold text-blue-600">${totalCredit.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {journalEntry ? 'Update' : 'Create'} Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```