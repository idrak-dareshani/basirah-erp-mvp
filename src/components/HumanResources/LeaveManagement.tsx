import React, { useState } from 'react';
import { Calendar, Check, X, Clock, Plus } from 'lucide-react';

interface LeaveManagementProps {
  employees: any[];
  leaveRequests: any[];
  onUpdateLeaveRequest: (id: string, status: string) => void;
  onUpdateLeaveRequests: (requests: any[]) => void;
}

export default function LeaveManagement({ 
  employees, 
  leaveRequests, 
  onUpdateLeaveRequest, 
  onUpdateLeaveRequests 
}: LeaveManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const leaveTypes = ['Vacation', 'Sick Leave', 'Personal Leave', 'Maternity/Paternity', 'Emergency Leave'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employee = employees.find(emp => emp.employeeId === formData.employeeId);
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newRequest = {
      id: Date.now().toString(),
      employeeId: formData.employeeId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      reason: formData.reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    onUpdateLeaveRequests([newRequest, ...leaveRequests]);
    setShowForm(false);
    setFormData({
      employeeId: '',
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const filteredRequests = leaveRequests.filter(req => 
    filter === 'all' || req.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check size={16} className="text-green-600" />;
      case 'rejected': return <X size={16} className="text-red-600" />;
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-slate-900">Leave Requests</h3>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>New Request</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{request.employeeName}</p>
                        <p className="text-sm text-slate-500">{request.employeeId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{request.leaveType}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{request.days}</td>
                    <td className="px-6 py-4 text-sm text-slate-900 max-w-xs truncate">{request.reason}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onUpdateLeaveRequest(request.id, 'approved')}
                            className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => onUpdateLeaveRequest(request.id, 'rejected')}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Leave Request Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">New Leave Request</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-md hover:bg-slate-100">
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Employee</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.employeeId}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Leave Type</label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData(prev => ({ ...prev, leaveType: e.target.value }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Please provide a reason for your leave request"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}