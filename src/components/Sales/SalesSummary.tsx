import React from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react';
import { SalesOrder, PurchaseOrder } from '../../types/erp';

interface SalesSummaryProps {
  orders: (SalesOrder | PurchaseOrder)[];
  type: 'sales' | 'purchase';
}

export default function SalesSummary({ orders, type }: SalesSummaryProps) {
  const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'draft' || o.status === 'confirmed').length;
  const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'received').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  const title = type === 'sales' ? 'Sales' : 'Purchase';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total {title} Value</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              ${totalValue.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Pending Orders</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{pendingOrders}</p>
          </div>
          <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Completed Orders</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{completedOrders}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Cancelled Orders</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{cancelledOrders}</p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}