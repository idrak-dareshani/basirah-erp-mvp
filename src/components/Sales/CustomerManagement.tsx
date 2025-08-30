import React, { useState } from 'react';
import { Plus, Edit, Trash2, User, Building, X, Search, Download, Trash, Eye } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Customer = Database['public']['Tables']['customers']['Row'];
type Vendor = Database['public']['Tables']['vendors']['Row'];

interface CustomerManagementProps {
  customers: (Customer | Vendor)[];
  onUpdate: (action: string, data: any, id?: string) => void;
  type: 'customer' | 'vendor';
}

export default function CustomerManagement({ customers, onUpdate, type }: CustomerManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showCustomerDetails, setShowCustomerDetails] = useState<Customer | Vendor | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '' });
    setEditingCustomer(null);
    setShowForm(false);
  };

  const handleEdit = (customer: Customer | Vendor) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      await onUpdate('update', formData, editingCustomer.id);
    } else {
      await onUpdate('create', formData);
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      await onUpdate('delete', null, id);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredCustomers.map(c => c.id));
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

  const handleBulkDelete = async () => {
    if (selectedItems.length > 0) {
      if (confirm(`Are you sure you want to delete ${selectedItems.length} ${type}s?`)) {
        await onUpdate('bulkDelete', selectedItems);
        setSelectedItems([]);
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Address', 'Created Date', 'Updated Date'];
    const csvContent = [
      headers.join(','),
      ...filteredCustomers.map(c => [
        c.id.slice(0, 8),
        `"${c.name}"`,
        c.email,
        c.phone,
        `"${c.address}"`,
        new Date(c.created_at).toLocaleDateString(),
        new Date(c.updated_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}s-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const entityLabel = type === 'customer' ? 'Customer' : 'Vendor';
  const entityIcon = type === 'customer' ? User : Building;

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">{entityLabel} Management</h3>
          <div className="flex space-x-3">
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add {entityLabel}</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  {React.createElement(entityIcon, { className: "w-5 h-5 text-blue-600" })}
                </div>
                <h4 className="font-medium text-slate-900">{entityLabel}s</h4>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${type}s...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                      checked={selectedItems.length === filteredCustomers.length && filteredCustomers.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(customer.id)}
                        onChange={(e) => handleSelectItem(customer.id, e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">
                      {customer.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{customer.phone}</td>
                    <td className="px-6 py-4 text-sm text-slate-900 max-w-xs truncate">{customer.address}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(customer.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowCustomerDetails(customer)}
                          className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(customer)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
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
          
          {filteredCustomers.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-slate-500 mb-4">
                {searchTerm 
                  ? `No ${type}s match your search criteria.` 
                  : `No ${type}s found. Add your first ${type} to get started.`
                }
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingCustomer ? 'Edit' : 'Add'} {entityLabel}
                </h3>
                <button onClick={resetForm} className="p-1 rounded-md hover:bg-slate-100">
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    required
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
                    {editingCustomer ? 'Update' : 'Add'} {entityLabel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Customer/Vendor Details Modal */}
      {showCustomerDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {entityLabel} Details
              </h3>
              <button
                onClick={() => setShowCustomerDetails(null)}
                className="p-1 rounded-md hover:bg-slate-100"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-slate-500">Name</span>
                      <p className="text-sm font-medium text-slate-900">{showCustomerDetails.name}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Email</span>
                      <p className="text-sm text-slate-900">{showCustomerDetails.email}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Phone</span>
                      <p className="text-sm text-slate-900">{showCustomerDetails.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Additional Details</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-slate-500">Address</span>
                      <p className="text-sm text-slate-900">{showCustomerDetails.address}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Created Date</span>
                      <p className="text-sm text-slate-900">
                        {new Date(showCustomerDetails.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}