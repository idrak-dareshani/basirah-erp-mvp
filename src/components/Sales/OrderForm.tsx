import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useSupabaseTable } from '../../hooks/useSupabase';
import { Database } from '../../lib/database.types';

type Customer = Database['public']['Tables']['customers']['Row'];
type Vendor = Database['public']['Tables']['vendors']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface OrderFormProps {
  order?: any;
  type: 'sales' | 'purchase';
  customers: Customer[];
  vendors: Vendor[];
  onSave: (order: any) => void;
  onCancel: () => void;
}

export default function OrderForm({ order, type, customers, vendors, onSave, onCancel }: OrderFormProps) {
  const { data: products } = useSupabaseTable('products');
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerId: '',
    vendorId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'draft' as any,
    items: [] as OrderItem[],
    tax: 0
  });

  useEffect(() => {
    if (order) {
      setFormData({
        orderNumber: order.orderNumber,
        customerId: 'customerId' in order ? order.customerId : '',
        vendorId: 'vendorId' in order ? order.vendorId : '',
        date: order.date,
        status: order.status,
        items: order.items,
        tax: order.tax
      });
    } else {
      // Generate order number
      const prefix = type === 'sales' ? 'SO' : 'PO';
      const year = new Date().getFullYear();
      const orderNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData(prev => ({
        ...prev,
        orderNumber: `${prefix}-${year}-${orderNum}`
      }));
    }
  }, [order, type]);

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        productId: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }]
    }));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'productId' && value) {
            const product = products.find((p: Product) => p.id === value);
            if (product) {
              updatedItem.productName = product.name;
              updatedItem.unitPrice = product.unit_price;
            }
          }
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal + formData.tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      orderNumber: formData.orderNumber,
      ...(type === 'sales' 
        ? { 
            customerId: formData.customerId,
            customerName: customers.find(c => c.id === formData.customerId)?.name || ''
          }
        : { 
            vendorId: formData.vendorId,
            vendorName: vendors.find(v => v.id === formData.vendorId)?.name || ''
          }
      ),
      date: formData.date,
      status: formData.status,
      items: formData.items,
      subtotal,
      tax: formData.tax,
      total
    };
    onSave(orderData);
  };

  const entityList = type === 'sales' ? customers : vendors;
  const entityLabel = type === 'sales' ? 'Customer' : 'Vendor';
  const entityId = type === 'sales' ? formData.customerId : formData.vendorId;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            {order ? 'Edit' : 'Create'} {type === 'sales' ? 'Sales' : 'Purchase'} Order
          </h3>
          <button onClick={onCancel} className="p-1 rounded-md hover:bg-slate-100">
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Order Number</label>
              <input
                type="text"
                value={formData.orderNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, orderNumber: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{entityLabel}</label>
              <select
                value={entityId}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  [type === 'sales' ? 'customerId' : 'vendorId']: e.target.value 
                }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select {entityLabel}</option>
                {entityList.map((entity) => (
                  <option key={entity.id} value={entity.id}>{entity.name}</option>
                ))}
              </select>
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
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
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-slate-900">Items</h4>
              <button
                type="button"
                onClick={addItem}
                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="flex space-x-3 p-4 border border-slate-200 rounded-lg">
                  <div className="flex-1">
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((product: any) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ${product.unit_price}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Qty"
                      required
                    />
                  </div>
                  
                  <div className="w-32">
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Unit Price"
                      required
                    />
                  </div>
                  
                  <div className="w-32 flex items-center">
                    <span className="text-sm font-medium text-slate-900">
                      ${item.total.toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div></div>
            <div></div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Subtotal:</span>
                <span className="text-sm font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Tax:</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.tax}
                  onChange={(e) => setFormData(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                  className="w-24 border border-slate-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-base font-medium text-slate-900">Total:</span>
                <span className="text-base font-bold text-slate-900">${total.toFixed(2)}</span>
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
              {order ? 'Update' : 'Create'} Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}