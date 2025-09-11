import React from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle, TrendingUp, DollarSign } from 'lucide-react';
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

  const averageOrderValue = orders.length > 0 ? totalValue / orders.length : 0;
  const totalTax = orders.reduce((sum, order) => sum + order.tax, 0);
  const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);
  const title = type === 'sales' ? 'Sales' : 'Purchase';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total {title} Value</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              ${totalValue.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {orders.length} orders
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
            <p className="text-sm text-slate-500 mt-1">
              Awaiting action
            </p>
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
            <p className="text-sm text-slate-500 mt-1">
              Successfully fulfilled
            </p>
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
            <p className="text-sm text-slate-500 mt-1">
              Cancelled/Rejected
            </p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Average Order Value</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              ${averageOrderValue.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Per order
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Tax</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              ${totalTax.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {totalItems} items
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}