import React, { useState } from 'react';
import { Edit, Trash2, Eye, Search, Download, Trash, FileText } from 'lucide-react';
import { SalesOrder, PurchaseOrder } from '../../types/erp';

interface OrderListProps {
  orders: (SalesOrder | PurchaseOrder)[];
  type: 'sales' | 'purchase';
  onEdit: (order: SalesOrder | PurchaseOrder) => void;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
}

export default function OrderList({ orders, type, onEdit, onDelete, onBulkDelete }: OrderListProps) {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showOrderDetails, setShowOrderDetails] = useState<SalesOrder | PurchaseOrder | null>(null);

  const filteredOrders = orders
    .filter(order => filter === 'all' || order.status === filter)
    .filter(order =>
      searchTerm === '' ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (type === 'sales' 
        ? (order as SalesOrder).customerName.toLowerCase().includes(searchTerm.toLowerCase())
        : (order as PurchaseOrder).vendorName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const multiplier = sortOrder === 'desc' ? -1 : 1;
      if (sortBy === 'date') {
        return (new Date(b.date).getTime() - new Date(a.date).getTime()) * multiplier;
      }
      return (b.total - a.total) * multiplier;
    });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredOrders.map(o => o.id));
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
      if (confirm(`Are you sure you want to delete ${selectedItems.length} orders?`)) {
        onBulkDelete(selectedItems);
        setSelectedItems([]);
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Order #', type === 'sales' ? 'Customer' : 'Vendor', 'Date', 'Status', 'Items', 'Total'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.orderNumber,
        type === 'sales' ? (order as SalesOrder).customerName : (order as PurchaseOrder).vendorName,
        order.date,
        order.status,
        order.items.length,
        order.total.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-slate-100 text-slate-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-slate-900">
              {type === 'sales' ? 'Sales' : 'Purchase'} Orders
            </h3>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
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
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="confirmed">Confirmed</option>
                <option value={type === 'sales' ? 'shipped' : 'received'}>
                  {type === 'sales' ? 'Shipped' : 'Received'}
                </option>
                <option value={type === 'sales' ? 'delivered' : 'received'}>
                  {type === 'sales' ? 'Delivered' : 'Received'}
                </option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'total')}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="total">Sort by Amount</option>
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
                    checked={selectedItems.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {type === 'sales' ? 'Customer' : 'Vendor'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(order.id)}
                      onChange={(e) => handleSelectItem(order.id, e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {type === 'sales' ? (order as SalesOrder).customerName : (order as PurchaseOrder).vendorName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    ${order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowOrderDetails(order)}
                        className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                        title="View Details"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(order)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(order.id)}
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
        
        {filteredOrders.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-slate-500 mb-4">
              {searchTerm || filter !== 'all'
                ? 'No orders match your search criteria.' 
                : `No orders found. Create your first ${type} order to get started.`
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

      {/* Order Details Modal */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                Order Details - {showOrderDetails.orderNumber}
              </h3>
              <button
                onClick={() => setShowOrderDetails(null)}
                className="p-1 rounded-md hover:bg-slate-100"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Order Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Order Number:</span>
                      <span className="text-sm font-medium">{showOrderDetails.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">{type === 'sales' ? 'Customer:' : 'Vendor:'}</span>
                      <span className="text-sm font-medium">
                        {type === 'sales' 
                          ? (showOrderDetails as SalesOrder).customerName 
                          : (showOrderDetails as PurchaseOrder).vendorName
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Date:</span>
                      <span className="text-sm font-medium">{new Date(showOrderDetails.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(showOrderDetails.status)}`}>
                        {showOrderDetails.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Subtotal:</span>
                      <span className="text-sm font-medium">${showOrderDetails.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Tax:</span>
                      <span className="text-sm font-medium">${showOrderDetails.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium text-slate-900">Total:</span>
                      <span className="text-sm font-bold text-slate-900">${showOrderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Order Items</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-slate-200 rounded-lg">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Unit Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {showOrderDetails.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-slate-900">{item.productName}</td>
                          <td className="px-4 py-2 text-sm text-slate-900">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-slate-900">${item.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm font-medium text-slate-900">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
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