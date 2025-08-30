import React from 'react';
import { Users, DollarSign, Calendar, UserCheck } from 'lucide-react';

interface HRSummaryProps {
  employees: any[];
  payroll: any[];
  leaveRequests: any[];
}

export default function HRSummary({ employees, payroll, leaveRequests }: HRSummaryProps) {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const totalPayroll = payroll.reduce((sum, p) => sum + p.netPay, 0);
  const pendingLeaveRequests = leaveRequests.filter(req => req.status === 'pending').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Employees</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalEmployees}</p>
            <p className="text-sm text-green-600 mt-1">{activeEmployees} active</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Monthly Payroll</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              ${totalPayroll.toLocaleString()}
            </p>
            <p className="text-sm text-slate-500 mt-1">Last period</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Pending Leave</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{pendingLeaveRequests}</p>
            <p className="text-sm text-slate-500 mt-1">Requests</p>
          </div>
          <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Attendance Rate</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">96.5%</p>
            <p className="text-sm text-slate-500 mt-1">This month</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}