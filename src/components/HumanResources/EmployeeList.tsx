import React, { useState } from 'react';
import { Edit, Trash2, Search, Download, Trash, Eye, User, X, Plus } from 'lucide-react';

interface EmployeeListProps {
  employees: any[];
  onEdit: (employee: any) => void;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onShowAddForm?: () => void;
}

export default function EmployeeList({ employees, onEdit, onDelete, onBulkDelete, onShowAddForm }: EmployeeListProps) {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'department' | 'salary'>('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showEmployeeDetails, setShowEmployeeDetails] = useState<any>(null);

  const departments = [...new Set(employees.map(emp => emp.department))];

  const filteredEmployees = employees
    .filter(employee => filter === 'all' || employee.department === filter)
    .filter(employee =>
      searchTerm === '' ||
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortOrder === 'desc' ? -1 : 1;
      if (sortBy === 'name') {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`) * multiplier;
      }
      if (sortBy === 'department') {
        return a.department.localeCompare(b.department) * multiplier;
      }
      return (b.salary - a.salary) * multiplier;
    });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredEmployees.map(emp => emp.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length > 0 && onBulkDelete) {
      if (confirm(`Are you sure you want to delete ${selectedItems.length} employees?`)) {
        onBulkDelete(selectedItems);
        setSelectedItems([]);
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Employee ID', 'Name', 'Email', 'Department', 'Position', 'Salary', 'Hire Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(emp => [
        emp.employeeId,
        `"${emp.firstName} ${emp.lastName}"`,
        emp.email,
        emp.department,
        `"${emp.position}"`,
        emp.salary,
        emp.hireDate,
        emp.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-slate-900">Employee Directory</h3>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'department' | 'salary')}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="department">Sort by Department</option>
                <option value="salary">Sort by Salary</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>

              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export</span>
              </button>

              <button
            onClick={() => onShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Employee</span>
          </button>
              
            </div>
          </div>
          
          {selectedItems.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedItems.length} employee{selectedItems.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <Trash size={14} />
                <span>Delete Selected</span>
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(employee.id)}
                      onChange={(e) => handleSelectItem(employee.id, e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={employee.avatar}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-sm text-slate-500">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{employee.employeeId}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{employee.department}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{employee.position}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    ${employee.salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowEmployeeDetails(employee)}
                        className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(employee)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(employee.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredEmployees.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-slate-500 mb-4">
              {searchTerm || filter !== 'all'
                ? 'No employees match your search criteria.' 
                : 'No employees found. Add your first employee to get started.'
              }
            </div>
            {(searchTerm || filter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Employee Details Modal */}
      {showEmployeeDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Employee Details</h3>
              <button
                onClick={() => setShowEmployeeDetails(null)}
                className="p-1 rounded-md hover:bg-slate-100"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src={showEmployeeDetails.avatar}
                  alt={`${showEmployeeDetails.firstName} ${showEmployeeDetails.lastName}`}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xl font-semibold text-slate-900">
                    {showEmployeeDetails.firstName} {showEmployeeDetails.lastName}
                  </h4>
                  <p className="text-slate-600">{showEmployeeDetails.position}</p>
                  <p className="text-sm text-slate-500">{showEmployeeDetails.employeeId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-slate-700 mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Email:</span>
                      <span className="text-sm font-medium">{showEmployeeDetails.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Phone:</span>
                      <span className="text-sm font-medium">{showEmployeeDetails.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Address:</span>
                      <span className="text-sm font-medium">{showEmployeeDetails.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Emergency Contact:</span>
                      <span className="text-sm font-medium">{showEmployeeDetails.emergencyContact}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-slate-700 mb-3">Employment Details</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Department:</span>
                      <span className="text-sm font-medium">{showEmployeeDetails.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Manager:</span>
                      <span className="text-sm font-medium">{showEmployeeDetails.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Hire Date:</span>
                      <span className="text-sm font-medium">{new Date(showEmployeeDetails.hireDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Salary:</span>
                      <span className="text-sm font-medium">${showEmployeeDetails.salary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-slate-700 mb-3">Benefits</h5>
                <div className="flex flex-wrap gap-2">
                  {showEmployeeDetails.benefits.map((benefit: string, index: number) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}