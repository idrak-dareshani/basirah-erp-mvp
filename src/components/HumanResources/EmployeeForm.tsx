import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EmployeeFormProps {
  employee?: any;
  onSave: (employee: any) => void;
  onCancel: () => void;
}

const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Customer Support'
];

const positions = {
  'Engineering': ['Software Engineer', 'Senior Developer', 'Tech Lead', 'Engineering Manager'],
  'Marketing': ['Marketing Specialist', 'Marketing Manager', 'Content Creator', 'SEO Specialist'],
  'Sales': ['Sales Representative', 'Sales Manager', 'Account Executive', 'Sales Director'],
  'Human Resources': ['HR Specialist', 'HR Manager', 'Recruiter', 'HR Director'],
  'Finance': ['Accountant', 'Financial Analyst', 'Finance Manager', 'CFO'],
  'Operations': ['Operations Specialist', 'Operations Manager', 'Project Manager'],
  'Customer Support': ['Support Agent', 'Support Manager', 'Customer Success Manager']
};

const benefits = [
  'Health Insurance',
  'Dental',
  'Vision',
  '401k',
  'Stock Options',
  'Flexible Hours',
  'Remote Work',
  'Paid Time Off'
];

export default function EmployeeForm({ employee, onSave, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'active',
    manager: '',
    address: '',
    emergencyContact: '',
    benefits: [] as string[],
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        salary: employee.salary.toString(),
        hireDate: employee.hireDate,
        status: employee.status,
        manager: employee.manager,
        address: employee.address,
        emergencyContact: employee.emergencyContact,
        benefits: employee.benefits || [],
        avatar: employee.avatar
      });
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      salary: parseFloat(formData.salary)
    });
  };

  const handleBenefitToggle = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  const availablePositions = formData.department ? positions[formData.department as keyof typeof positions] || [] : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            {employee ? 'Edit Employee' : 'Add Employee'}
          </h3>
          <button onClick={onCancel} className="p-1 rounded-md hover:bg-slate-100">
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value, position: '' }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Position</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!formData.department}
              >
                <option value="">Select Position</option>
                {availablePositions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Salary</label>
              <input
                type="number"
                min="0"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hire Date</label>
              <input
                type="date"
                value={formData.hireDate}
                onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Manager</label>
            <input
              type="text"
              value={formData.manager}
              onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Contact</label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Name - Phone Number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Benefits</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {benefits.map(benefit => (
                <label key={benefit} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.benefits.includes(benefit)}
                    onChange={() => handleBenefitToggle(benefit)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{benefit}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {employee ? 'Update' : 'Add'} Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}