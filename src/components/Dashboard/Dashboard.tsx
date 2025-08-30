import React from 'react';
import DashboardCards from './DashboardCards';
import RecentActivity from './RecentActivity';
import ChartSection from './ChartSection';
import { useSupabaseTable } from '../../hooks/useSupabase';
import { useSalesOrders, usePurchaseOrders } from '../../hooks/useOrders';

export default function Dashboard() {
  const { data: transactions, loading: transactionsLoading } = useSupabaseTable('transactions');
  const { data: products, loading: productsLoading } = useSupabaseTable('products');
  const { orders: salesOrders, loading: salesLoading } = useSalesOrders();
  const { orders: purchaseOrders, loading: purchaseLoading } = usePurchaseOrders();

  const loading = transactionsLoading || productsLoading || salesLoading || purchaseLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardCards 
        transactions={transactions}
        products={products}
        salesOrders={salesOrders}
        purchaseOrders={purchaseOrders}
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ChartSection transactions={transactions} />
        </div>
        <div>
          <RecentActivity 
            transactions={transactions}
            salesOrders={salesOrders}
            purchaseOrders={purchaseOrders}
            products={products}
          />
        </div>
      </div>
    </div>
  );
}