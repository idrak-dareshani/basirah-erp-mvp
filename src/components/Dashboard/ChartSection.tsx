import React from 'react';
import { Database } from '../../lib/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface ChartSectionProps {
  transactions: Transaction[];
}

export default function ChartSection({ transactions }: ChartSectionProps) {
  // Group transactions by month
  const monthlyData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map(month => {
      const monthIndex = months.indexOf(month);
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === monthIndex && transactionDate.getFullYear() === currentYear;
      });
      
      const revenue = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return { month, revenue, expenses };
    });
  }, [transactions]);

  const maxValue = Math.max(...monthlyData.flatMap(d => [d.revenue, d.expenses]));
  
  // Ensure we have a minimum height for the chart
  const chartMaxValue = Math.max(maxValue, 1000);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Revenue vs Expenses</h3>
      
      <div className="relative">
        <div className="flex items-end justify-between h-64 border-b border-slate-200">
          {monthlyData.map((data, index) => (
            <div key={data.month} className="flex flex-col items-center space-y-2 flex-1">
              <div className="w-full flex justify-center space-x-1">
                <div
                  className="bg-blue-500 rounded-t"
                  style={{
                    height: `${(data.revenue / chartMaxValue) * 240}px`,
                    width: '16px'
                  }}
                  title={`Revenue: $${data.revenue.toLocaleString()}`}
                />
                <div
                  className="bg-red-500 rounded-t"
                  style={{
                    height: `${(data.expenses / chartMaxValue) * 240}px`,
                    width: '16px'
                  }}
                  title={`Expenses: $${data.expenses.toLocaleString()}`}
                />
              </div>
              <span className="text-xs text-slate-600">{data.month}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-slate-600">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-slate-600">Expenses</span>
          </div>
        </div>
      </div>
    </div>
  );
}