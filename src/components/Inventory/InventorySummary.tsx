import React from 'react';
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface InventorySummaryProps {
  products: Product[];
}

export default function InventorySummary({ products }: InventorySummaryProps) {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.unit_price), 0);
  const lowStockCount = products.filter(p => p.stock <= p.min_stock).length;
  const avgMargin = products.length > 0 
    ? products.reduce((sum, p) => sum + ((p.unit_price - p.cost_price) / p.unit_price * 100), 0) / products.length
    : 0;

  const totalCostValue = products.reduce((sum, p) => sum + (p.stock * p.cost_price), 0);
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const highValueProducts = products.filter(p => (p.stock * p.unit_price) > 1000).length;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Products</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalProducts}</p>
            <p className="text-sm text-slate-500 mt-1">
              {outOfStockCount} out of stock
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Inventory Value</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              ${totalValue.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              At selling price
            </p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Low Stock Items</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{lowStockCount}</p>
            <p className="text-sm text-slate-500 mt-1">
              Need reordering
            </p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Avg. Margin</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{avgMargin.toFixed(1)}%</p>
            <p className="text-sm text-slate-500 mt-1">
              Profit margin
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
            <p className="text-sm font-medium text-slate-600">Cost Value</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              ${totalCostValue.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              At cost price
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">High Value Items</p>
            <p className="text-2xl font-bold text-indigo-600 mt-2">{highValueProducts}</p>
            <p className="text-sm text-slate-500 mt-1">
              {'Value > $1,000'}
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>
    </div>
  );
}