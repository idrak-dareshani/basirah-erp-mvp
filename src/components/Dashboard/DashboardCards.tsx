import React from 'react';
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

function DashboardCard({ title, value, change, changeType, icon }: DashboardCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-slate-600'
  }[changeType];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
          <p className={`text-sm mt-2 ${changeColor}`}>{change}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

interface DashboardCardsProps {
  transactions: Transaction[];
  products: Product[];
  salesOrders: any[];
  purchaseOrders: any[];
}

export default function DashboardCards({ transactions, products, salesOrders }: DashboardCardsProps) {
  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOrders = salesOrders.length;
  const lowStockCount = products.filter(p => p.stock <= p.min_stock).length;
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <DashboardCard
        title="Total Revenue"
        value={`$${totalRevenue.toLocaleString()}`}
        change={`${transactions.filter(t => t.type === 'income').length} transactions`}
        changeType="positive"
        icon={<DollarSign className="w-6 h-6 text-blue-600" />}
      />
      <DashboardCard
        title="Sales Orders"
        value={totalOrders.toString()}
        change={`${salesOrders.filter(o => o.status === 'confirmed').length} confirmed`}
        changeType="positive"
        icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
      />
      <DashboardCard
        title="Low Stock Items"
        value={lowStockCount.toString()}
        change={`${products.length} total products`}
        changeType={lowStockCount > 0 ? "negative" : "positive"}
        icon={<Package className="w-6 h-6 text-blue-600" />}
      />
      <DashboardCard
        title="Profit Margin"
        value={`${profitMargin.toFixed(1)}%`}
        change={`$${(totalRevenue - totalExpenses).toLocaleString()} profit`}
        changeType={profitMargin > 0 ? "positive" : "negative"}
        icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
      />
    </div>
  );
}