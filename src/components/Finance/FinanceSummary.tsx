import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface FinanceSummaryProps {
  transactions: Transaction[];
}

export default function FinanceSummary({ transactions }: FinanceSummaryProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  // Calculate monthly trends
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const averageTransactionAmount = transactions.length > 0 
    ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
    : 0;

  const cashFlow = netProfit;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Income</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              ${totalIncome.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              ${monthlyIncome.toLocaleString()} this month
            </p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              ${totalExpenses.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              ${monthlyExpenses.toLocaleString()} this month
            </p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Net Profit</p>
            <p className={`text-2xl font-bold mt-2 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netProfit.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {profitMargin.toFixed(1)}% margin
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Cash Flow</p>
            <p className={`text-2xl font-bold mt-2 ${cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${cashFlow.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {transactions.length} transactions
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
            <p className="text-sm font-medium text-slate-600">Avg Transaction</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              ${averageTransactionAmount.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Per transaction
            </p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>
    </div>
  );
}