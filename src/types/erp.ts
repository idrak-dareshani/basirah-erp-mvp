export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  stock: number;
  minStock: number;
  createdAt: string;
}

export interface SalesOrder {
  id: string;
  customerId: string;
  customerName: string;
  orderNumber: string;
  date: string;
  status: 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  orderNumber: string;
  date: string;
  status: 'draft' | 'confirmed' | 'received' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  reference?: string;
  createdAt: string;
}

export interface FinanceCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  description: string;
}