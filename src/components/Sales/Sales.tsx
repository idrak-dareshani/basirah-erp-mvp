import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import OrderList from './OrderList';
import OrderForm from './OrderForm';
import SalesSummary from './SalesSummary';
import CustomerManagement from './CustomerManagement';
import { useSupabaseTable } from '../../hooks/useSupabase';
import { useSalesOrders, usePurchaseOrders } from '../../hooks/useOrders';
import { Database } from '../../lib/database.types';

type Customer = Database['public']['Tables']['customers']['Row'];
type Vendor = Database['public']['Tables']['vendors']['Row'];

export default function Sales() {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchase' | 'customers' | 'vendors'>('sales');
  
  const { 
    orders: salesOrders, 
    loading: salesLoading, 
    createOrder: createSalesOrder, 
    updateOrder: updateSalesOrder, 
    deleteOrder: deleteSalesOrder, 
    bulkDeleteOrders: bulkDeleteSalesOrders 
  } = useSalesOrders();
  
  const { 
    orders: purchaseOrders, 
    loading: purchaseLoading, 
    createOrder: createPurchaseOrder, 
    updateOrder: updatePurchaseOrder, 
    deleteOrder: deletePurchaseOrder, 
    bulkDeleteOrders: bulkDeletePurchaseOrders 
  } = usePurchaseOrders();
  
  const { 
    data: customers, 
    loading: customersLoading, 
    create: createCustomer, 
    update: updateCustomer, 
    remove: removeCustomer, 
    bulkRemove: bulkRemoveCustomers 
  } = useSupabaseTable('customers');
  
  const { 
    data: vendors, 
    loading: vendorsLoading, 
    create: createVendor, 
    update: updateVendor, 
    remove: removeVendor, 
    bulkRemove: bulkRemoveVendors 
  } = useSupabaseTable('vendors');
  
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);

  const handleSaveOrder = async (orderData: any) => {
    if (activeTab === 'sales') {
      if (editingOrder) {
        await updateSalesOrder(editingOrder.id, orderData);
      } else {
        await createSalesOrder(orderData);
      }
    } else {
      if (editingOrder) {
        await updatePurchaseOrder(editingOrder.id, orderData);
      } else {
        await createPurchaseOrder(orderData);
      }
    }
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleDeleteOrder = async (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      if (activeTab === 'sales') {
        await deleteSalesOrder(id);
      } else {
        await deletePurchaseOrder(id);
      }
    }
  };

  const handleBulkDeleteOrders = async (ids: string[]) => {
    if (activeTab === 'sales') {
      await bulkDeleteSalesOrders(ids);
    } else {
      await bulkDeletePurchaseOrders(ids);
    }
  };

  const handleUpdateCustomers = async (action: string, data: any, id?: string) => {
    switch (action) {
      case 'create':
        await createCustomer(data);
        break;
      case 'update':
        if (id) await updateCustomer(id, data);
        break;
      case 'delete':
        if (id) await removeCustomer(id);
        break;
      case 'bulkDelete':
        await bulkRemoveCustomers(data);
        break;
    }
  };

  const handleUpdateVendors = async (action: string, data: any, id?: string) => {
    switch (action) {
      case 'create':
        await createVendor(data);
        break;
      case 'update':
        if (id) await updateVendor(id, data);
        break;
      case 'delete':
        if (id) await removeVendor(id);
        break;
      case 'bulkDelete':
        await bulkRemoveVendors(data);
        break;
    }
  };

  const tabs = [
    { id: 'sales', label: 'Sales Orders' },
    { id: 'purchase', label: 'Purchase Orders' },
    { id: 'customers', label: 'Customers' },
    { id: 'vendors', label: 'Vendors' }
  ];

  return (
    <div className="space-y-6">
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
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Sales Orders</h3>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>New Sales Order</span>
            </button>
          </div>
          {salesLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <SalesSummary orders={salesOrders} type="sales" />
          <OrderList 
            orders={salesOrders}
            type="sales"
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
            onBulkDelete={handleBulkDeleteOrders}
          />
        </div>
      )}

      {activeTab === 'purchase' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Purchase Orders</h3>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>New Purchase Order</span>
            </button>
          </div>
          {purchaseLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <SalesSummary orders={purchaseOrders} type="purchase" />
          <OrderList 
            orders={purchaseOrders}
            type="purchase"
            onEdit={handleEditOrder}
            onDelete={handleDeleteOrder}
            onBulkDelete={handleBulkDeleteOrders}
          />
        </div>
      )}

      {activeTab === 'customers' && (
        <>
          {customersLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        <CustomerManagement 
          customers={customers}
          onUpdate={handleUpdateCustomers}
          type="customer"
        />
        </>
      )}

      {activeTab === 'vendors' && (
        <>
          {vendorsLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        <CustomerManagement 
          customers={vendors}
          onUpdate={handleUpdateVendors}
          type="vendor"
        />
        </>
      )}

      {showForm && (
        <OrderForm
          order={editingOrder}
          type={activeTab as 'sales' | 'purchase'}
          customers={customers}
          vendors={vendors}
          onSave={handleSaveOrder}
          onCancel={() => {
            setShowForm(false);
            setEditingOrder(null);
          }}
        />
      )}
    </div>
  );
}