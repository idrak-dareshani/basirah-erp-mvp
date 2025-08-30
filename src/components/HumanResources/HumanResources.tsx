import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import PayrollManagement from './PayrollManagement';
import LeaveManagement from './LeaveManagement';
import HRSummary from './HRSummary';
import { mockEmployees, mockPayroll, mockLeaveRequests } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function HumanResources() {
  const [activeTab, setActiveTab] = useState<'employees' | 'payroll' | 'leave'>('employees');
  const [employees, setEmployees] = useLocalStorage('employees', mockEmployees);
  const [payroll, setPayroll] = useLocalStorage('payroll', mockPayroll);
  const [leaveRequests, setLeaveRequests] = useLocalStorage('leaveRequests', mockLeaveRequests);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  const handleSaveEmployee = (employeeData: any) => {
    if (editingEmployee) {
      setEmployees(prev => prev.map(emp => 
        emp.id === editingEmployee.id ? { ...employeeData, id: editingEmployee.id } : emp
      ));
    } else {
      const newEmployee = {
        ...employeeData,
        id: Date.now().toString(),
        employeeId: `EMP${(employees.length + 1).toString().padStart(3, '0')}`
      };
      setEmployees(prev => [newEmployee, ...prev]);
    }
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const handleBulkDeleteEmployees = (ids: string[]) => {
    setEmployees(prev => prev.filter(emp => !ids.includes(emp.id)));
  };

  const handleUpdateLeaveRequest = (id: string, status: string) => {
    setLeaveRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status } : req
    ));
  };

  const tabs = [
    { id: 'employees', label: 'Employees' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'leave', label: 'Leave Management' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Human Resources</h2>
        {activeTab === 'employees' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      <HRSummary 
        employees={employees}
        payroll={payroll}
        leaveRequests={leaveRequests}
      />

      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'employees' && (
        <EmployeeList 
          employees={employees}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
          onBulkDelete={handleBulkDeleteEmployees}
        />
      )}

      {activeTab === 'payroll' && (
        <PayrollManagement 
          employees={employees}
          payroll={payroll}
          onUpdatePayroll={setPayroll}
        />
      )}

      {activeTab === 'leave' && (
        <LeaveManagement 
          employees={employees}
          leaveRequests={leaveRequests}
          onUpdateLeaveRequest={handleUpdateLeaveRequest}
          onUpdateLeaveRequests={setLeaveRequests}
        />
      )}

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSaveEmployee}
          onCancel={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
        />
      )}
    </div>
  );
}