import React from 'react';
import { Package, ShoppingCart, DollarSign } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

interface RecentActivityProps {
  transactions: Transaction[];
  salesOrders: any[];
  purchaseOrders: any[];
  products: Product[];
}

export default function RecentActivity({ transactions, salesOrders, purchaseOrders, products }: RecentActivityProps) {
  const activities = React.useMemo(() => {
    const allActivities = [];
    
    // Add recent transactions
    transactions.slice(0, 3).forEach((transaction, index) => {
      allActivities.push({
        id: `transaction-${transaction.id}`,
        type: transaction.type === 'income' ? 'income' : 'expense',
        title: transaction.type === 'income' ? 'Payment received' : 'Expense recorded',
        description: `${transaction.description} - $${transaction.amount.toLocaleString()}`,
        time: getTimeAgo(transaction.created_at),
        icon: DollarSign,
        iconBg: transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100',
        iconColor: transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
      });
    });
    
    // Add recent sales orders
    salesOrders.slice(0, 2).forEach((order) => {
      allActivities.push({
        id: `sales-${order.id}`,
        type: 'sale',
        title: `Sales order ${order.order_number}`,
        description: `Order from ${order.customer_name} - $${order.total.toLocaleString()}`,
        time: getTimeAgo(order.created_at),
        icon: ShoppingCart,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      });
    });
    
    // Add recent purchase orders
    purchaseOrders.slice(0, 1).forEach((order) => {
      allActivities.push({
        id: `purchase-${order.id}`,
        type: 'purchase',
        title: `Purchase order ${order.order_number}`,
        description: `Order to ${order.vendor_name} - $${order.total.toLocaleString()}`,
        time: getTimeAgo(order.created_at),
        icon: ShoppingCart,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      });
    });
    
    // Add low stock alerts
    const lowStockProducts = products.filter(p => p.stock <= p.min_stock).slice(0, 2);
    lowStockProducts.forEach((product) => {
      allActivities.push({
        id: `stock-${product.id}`,
        type: 'inventory',
        title: 'Low stock alert',
        description: `Product "${product.name}" below minimum (${product.stock}/${product.min_stock})`,
        time: 'Now',
        icon: Package,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
      });
    });
    
    // Sort by most recent and limit to 6 items
    return allActivities
      .sort((a, b) => {
        if (a.time === 'Now') return -1;
        if (b.time === 'Now') return 1;
        return 0;
      })
      .slice(0, 6);
  }, [transactions, salesOrders, purchaseOrders, products]);
  
  function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className={`w-10 h-10 rounded-lg ${activity.iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                <p className="text-sm text-slate-500">{activity.description}</p>
                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}