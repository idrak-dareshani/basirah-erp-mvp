// Mock data for ERP system components

export const mockEmployees = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    phone: '+1-555-0101',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 85000,
    hireDate: '2023-01-15',
    status: 'active',
    manager: 'Jane Wilson',
    address: '123 Main St, New York, NY 10001',
    emergencyContact: 'Sarah Smith - +1-555-0102',
    benefits: ['Health Insurance', 'Dental', '401k'],
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0103',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 75000,
    hireDate: '2022-08-20',
    status: 'active',
    manager: 'Mike Davis',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    emergencyContact: 'Tom Johnson - +1-555-0104',
    benefits: ['Health Insurance', 'Dental', 'Vision'],
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Mike',
    lastName: 'Davis',
    email: 'mike.davis@company.com',
    phone: '+1-555-0105',
    department: 'Sales',
    position: 'Sales Director',
    salary: 95000,
    hireDate: '2021-03-10',
    status: 'active',
    manager: 'CEO',
    address: '789 Pine St, Chicago, IL 60601',
    emergencyContact: 'Lisa Davis - +1-555-0106',
    benefits: ['Health Insurance', 'Dental', '401k', 'Stock Options'],
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export const mockPayroll = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Smith',
    payPeriod: '2024-01-01 to 2024-01-15',
    grossPay: 3269.23,
    deductions: 523.08,
    netPay: 2746.15,
    status: 'paid',
    payDate: '2024-01-16'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Sarah Johnson',
    payPeriod: '2024-01-01 to 2024-01-15',
    grossPay: 2884.62,
    deductions: 461.54,
    netPay: 2423.08,
    status: 'paid',
    payDate: '2024-01-16'
  }
];

export const mockLeaveRequests = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Smith',
    leaveType: 'Vacation',
    startDate: '2024-02-15',
    endDate: '2024-02-20',
    days: 5,
    reason: 'Family vacation',
    status: 'approved',
    appliedDate: '2024-01-20'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Sarah Johnson',
    leaveType: 'Sick Leave',
    startDate: '2024-01-25',
    endDate: '2024-01-26',
    days: 2,
    reason: 'Medical appointment',
    status: 'pending',
    appliedDate: '2024-01-22'
  }
];

export const mockAccounts = [
  {
    id: '1',
    accountNumber: '1000',
    accountName: 'Cash',
    accountType: 'Asset',
    category: 'Current Assets',
    balance: 25000,
    description: 'Company cash account'
  },
  {
    id: '2',
    accountNumber: '1200',
    accountName: 'Accounts Receivable',
    accountType: 'Asset',
    category: 'Current Assets',
    balance: 15000,
    description: 'Money owed by customers'
  },
  {
    id: '3',
    accountNumber: '2000',
    accountName: 'Accounts Payable',
    accountType: 'Liability',
    category: 'Current Liabilities',
    balance: 8000,
    description: 'Money owed to suppliers'
  },
  {
    id: '4',
    accountNumber: '3000',
    accountName: 'Owner Equity',
    accountType: 'Equity',
    category: 'Owner Equity',
    balance: 50000,
    description: 'Owner investment in business'
  }
];

export const mockJournalEntries = [
  {
    id: '1',
    entryNumber: 'JE001',
    date: '2024-01-15',
    description: 'Sales revenue for January',
    reference: 'INV-2024-001',
    entries: [
      { account: 'Cash', debit: 5000, credit: 0 },
      { account: 'Sales Revenue', debit: 0, credit: 5000 }
    ],
    totalDebit: 5000,
    totalCredit: 5000,
    status: 'posted'
  },
  {
    id: '2',
    entryNumber: 'JE002',
    date: '2024-01-16',
    description: 'Office supplies purchase',
    reference: 'PO-2024-001',
    entries: [
      { account: 'Office Supplies', debit: 500, credit: 0 },
      { account: 'Cash', debit: 0, credit: 500 }
    ],
    totalDebit: 500,
    totalCredit: 500,
    status: 'posted'
  }
];

export const mockReports = [
  {
    id: '1',
    name: 'Profit & Loss Statement',
    type: 'financial',
    description: 'Monthly profit and loss report',
    lastGenerated: '2024-01-31',
    frequency: 'monthly',
    format: 'PDF'
  },
  {
    id: '2',
    name: 'Balance Sheet',
    type: 'financial',
    description: 'Company balance sheet',
    lastGenerated: '2024-01-31',
    frequency: 'monthly',
    format: 'PDF'
  },
  {
    id: '3',
    name: 'Sales Report',
    type: 'sales',
    description: 'Monthly sales performance report',
    lastGenerated: '2024-01-31',
    frequency: 'monthly',
    format: 'Excel'
  },
  {
    id: '4',
    name: 'Inventory Report',
    type: 'inventory',
    description: 'Current inventory status and valuation',
    lastGenerated: '2024-01-31',
    frequency: 'weekly',
    format: 'PDF'
  }
];

export const mockCompanySettings = {
  companyName: 'Acme Corporation',
  address: '123 Business Ave, Suite 100, New York, NY 10001',
  phone: '+1-555-COMPANY',
  email: 'info@acmecorp.com',
  website: 'www.acmecorp.com',
  taxId: '12-3456789',
  currency: 'USD',
  fiscalYearStart: 'January',
  timezone: 'America/New_York',
  logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200'
};

export const mockUserSettings = {
  theme: 'light',
  language: 'English',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12-hour',
  notifications: {
    email: true,
    push: true,
    lowStock: true,
    orderUpdates: true,
    paymentReminders: true
  }
};