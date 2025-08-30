import React, { useState } from 'react';
import { DollarSign, Download, Calculator, Eye, X } from 'lucide-react';

interface PayrollManagementProps {
  employees: any[];
  payroll: any[];
  onUpdatePayroll: (payroll: any[]) => void;
}

export default function PayrollManagement({ employees, payroll, onUpdatePayroll }: PayrollManagementProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [showPayslipDetails, setShowPayslipDetails] = useState<any>(null);

  const generatePayroll = () => {
    const newPayroll = employees.map(emp => {
      const grossPay = emp.salary / 24; // Bi-weekly pay
      const deductions = grossPay * 0.16; // Approximate 16% for taxes and benefits
      const netPay = grossPay - deductions;
      
      return {
        id: Date.now().toString() + emp.id,
        employeeId: emp.employeeId,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        payPeriod: `${selectedPeriod}-01 to ${selectedPeriod}-15`,
        grossPay,
        deductions,
        netPay,
        status: 'pending',
        payDate: new Date().toISOString().split('T')[0]
      };
    });
    
    onUpdatePayroll([...newPayroll, ...payroll]);
  };

  const updatePayrollStatus = (id: string, status: string) => {
    onUpdatePayroll(payroll.map(p => 
      p.id === id ? { ...p, status } : p
    ));
  };

  const exportPayroll = () => {
    const headers = ['Employee ID', 'Employee Name', 'Pay Period', 'Gross Pay', 'Deductions', 'Net Pay', 'Status'];
    const csvContent = [
      headers.join(','),
      ...payroll.map(p => [
        p.employeeId,
        `"${p.employeeName}"`,
        `"${p.payPeriod}"`,
        p.grossPay.toFixed(2),
        p.deductions.toFixed(2),
        p.netPay.toFixed(2),
        p.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-${selectedPeriod}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const totalGrossPay = payroll.reduce((sum, p) => sum + p.grossPay, 0);
  const totalDeductions = payroll.reduce((sum, p) => sum + p.deductions, 0);
  const totalNetPay = payroll.reduce((sum, p) => sum + p.netPay, 0);

  return (
    <>
      <div className="space-y-6">
        {/* Payroll Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Gross Pay</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  ${totalGrossPay.toLocaleString()}
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
                <p className="text-sm font-medium text-slate-600">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600 mt-2">
                  ${totalDeductions.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Net Pay</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  ${totalNetPay.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Payroll Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-slate-900">Payroll Management</h3>
            
            <div className="flex flex-wrap gap-3">
              <input
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <button
                onClick={generatePayroll}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Calculator size={16} />
                <span>Generate Payroll</span>
              </button>

              <button
                onClick={exportPayroll}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pay Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Deductions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Net Pay</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payroll.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{pay.employeeName}</p>
                        <p className="text-sm text-slate-500">{pay.employeeId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{pay.payPeriod}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      ${pay.grossPay.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600">
                      ${pay.deductions.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">
                      ${pay.netPay.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={pay.status}
                        onChange={(e) => updatePayrollStatus(pay.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(pay.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => setShowPayslipDetails(pay)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                        title="View Payslip"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {payroll.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-slate-500 mb-4">
                No payroll records found. Generate payroll for the selected period to get started.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payslip Details Modal */}
      {showPayslipDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Payslip Details</h3>
              <button
                onClick={() => setShowPayslipDetails(null)}
                className="p-1 rounded-md hover:bg-slate-100"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center border-b pb-4">
                <h4 className="text-xl font-semibold text-slate-900">{showPayslipDetails.employeeName}</h4>
                <p className="text-slate-600">{showPayslipDetails.employeeId}</p>
                <p className="text-sm text-slate-500">{showPayslipDetails.payPeriod}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-slate-700 mb-3">Earnings</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Basic Salary:</span>
                      <span className="text-sm font-medium">${showPayslipDetails.grossPay.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium text-slate-900">Gross Pay:</span>
                      <span className="text-sm font-bold text-slate-900">${showPayslipDetails.grossPay.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-slate-700 mb-3">Deductions</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Federal Tax:</span>
                      <span className="text-sm font-medium">${(showPayslipDetails.deductions * 0.6).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">State Tax:</span>
                      <span className="text-sm font-medium">${(showPayslipDetails.deductions * 0.2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Benefits:</span>
                      <span className="text-sm font-medium">${(showPayslipDetails.deductions * 0.2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium text-slate-900">Total Deductions:</span>
                      <span className="text-sm font-bold text-red-600">${showPayslipDetails.deductions.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-900">Net Pay:</span>
                  <span className="text-2xl font-bold text-green-600">${showPayslipDetails.netPay.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}