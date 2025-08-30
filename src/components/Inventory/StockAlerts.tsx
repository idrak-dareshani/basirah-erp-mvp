import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface StockAlertsProps {
  products: Product[];
}

export default function StockAlerts({ products }: StockAlertsProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600" />
        <h3 className="text-lg font-semibold text-red-800">Low Stock Alerts</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-slate-900">{product.name}</h4>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                Critical
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-3">SKU: {product.sku}</p>
            <div className="flex justify-between text-sm">
              <span className="text-red-600 font-medium">
                Current: {product.stock}
              </span>
              <span className="text-slate-600">
                Min: {product.min_stock}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}