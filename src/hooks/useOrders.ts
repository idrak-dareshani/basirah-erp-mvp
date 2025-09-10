import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { Database } from '../lib/database.types';

type SalesOrder = Database['public']['Tables']['sales_orders']['Row'] & {
  customer_name: string;
  items: OrderItem[];
};

type PurchaseOrder = Database['public']['Tables']['purchase_orders']['Row'] & {
  vendor_name: string;
  items: OrderItem[];
};

type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
};

// Helper function to create financial transaction
const createFinancialTransaction = async (
  type: 'income' | 'expense',
  orderNumber: string,
  total: number,
  date: string,
  entityName: string
) => {
  // Check if transaction already exists to prevent duplicates
  const { data: existingTransaction } = await supabase
    .from('transactions')
    .select('id')
    .eq('reference', orderNumber)
    .single();

  if (existingTransaction) {
    return; // Transaction already exists, skip creation
  }

  const category = type === 'income' ? 'Sales Revenue' : 'Cost of Goods Sold';
  const description = type === 'income' 
    ? `Sales to ${entityName} - Order ${orderNumber}`
    : `Purchase from ${entityName} - Order ${orderNumber}`;

  const transaction = {
    type,
    category,
    description,
    amount: total,
    date,
    reference: orderNumber
  };

  const { error } = await supabase
    .from('transactions')
    .insert(transaction);

  if (error) {
    console.error('Error creating financial transaction:', error);
  }
};
export function useSalesOrders() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: ordersData, error: ordersError } = await supabase
        .from('sales_orders')
        .select(`
          *,
          customers!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              *,
              products!inner(name)
            `)
            .eq('sales_order_id', order.id);

          if (itemsError) throw itemsError;

          const items: OrderItem[] = (itemsData || []).map(item => ({
            id: item.id,
            product_id: item.product_id,
            product_name: (item.products as any).name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total
          }));

          return {
            ...order,
            customer_name: (order.customers as any).name,
            items
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: any): Promise<SalesOrder | null> => {
    try {
      const { items, ...order } = orderData;

      // Create the order
      const { data: newOrder, error: orderError } = await supabase
        .from('sales_orders')
        .insert({
          customer_id: order.customerId,
          order_number: order.orderNumber,
          date: order.date,
          status: order.status,
          subtotal: order.subtotal,
          tax: order.tax,
          total: order.total
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      if (items && items.length > 0) {
        const orderItems = items.map((item: any) => ({
          sales_order_id: newOrder.id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total: item.total
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Create financial transaction if order is delivered
      if (order.status === 'delivered') {
        await createFinancialTransaction(
          'income',
          order.orderNumber,
          order.total,
          order.date,
          order.customerName || 'Customer'
        );
      }
      await fetchOrders();
      return newOrder as SalesOrder;
    } catch (err) {
      handleSupabaseError(err);
      return null;
    }
  };

  const updateOrder = async (id: string, orderData: any): Promise<boolean> => {
    try {
      const { items, ...order } = orderData;

      // Get the current order to check previous status
      const { data: currentOrder } = await supabase
        .from('sales_orders')
        .select('status')
        .eq('id', id)
        .single();
      // Update the order
      const { error: orderError } = await supabase
        .from('sales_orders')
        .update({
          customer_id: order.customerId,
          order_number: order.orderNumber,
          date: order.date,
          status: order.status,
          subtotal: order.subtotal,
          tax: order.tax,
          total: order.total
        })
        .eq('id', id);

      if (orderError) throw orderError;

      // Delete existing items
      const { error: deleteError } = await supabase
        .from('order_items')
        .delete()
        .eq('sales_order_id', id);

      if (deleteError) throw deleteError;

      // Create new items
      if (items && items.length > 0) {
        const orderItems = items.map((item: any) => ({
          sales_order_id: id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total: item.total
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Create financial transaction if status changed to delivered
      if (order.status === 'delivered' && currentOrder?.status !== 'delivered') {
        await createFinancialTransaction(
          'income',
          order.orderNumber,
          order.total,
          order.date,
          order.customerName || 'Customer'
        );
      }
      await fetchOrders();
      return true;
    } catch (err) {
      handleSupabaseError(err);
      return false;
    }
  };

  const deleteOrder = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sales_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setOrders(prev => prev.filter(order => order.id !== id));
      return true;
    } catch (err) {
      handleSupabaseError(err);
      return false;
    }
  };

  const bulkDeleteOrders = async (ids: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sales_orders')
        .delete()
        .in('id', ids);

      if (error) throw error;
      
      setOrders(prev => prev.filter(order => !ids.includes(order.id)));
      return true;
    } catch (err) {
      handleSupabaseError(err);
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    bulkDeleteOrders,
    refetch: fetchOrders
  };
}

export function usePurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: ordersData, error: ordersError } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          vendors!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              *,
              products!inner(name)
            `)
            .eq('purchase_order_id', order.id);

          if (itemsError) throw itemsError;

          const items: OrderItem[] = (itemsData || []).map(item => ({
            id: item.id,
            product_id: item.product_id,
            product_name: (item.products as any).name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total
          }));

          return {
            ...order,
            vendor_name: (order.vendors as any).name,
            items
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: any): Promise<PurchaseOrder | null> => {
    try {
      const { items, ...order } = orderData;

      // Create the order
      const { data: newOrder, error: orderError } = await supabase
        .from('purchase_orders')
        .insert({
          vendor_id: order.vendorId,
          order_number: order.orderNumber,
          date: order.date,
          status: order.status,
          subtotal: order.subtotal,
          tax: order.tax,
          total: order.total
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      if (items && items.length > 0) {
        const orderItems = items.map((item: any) => ({
          purchase_order_id: newOrder.id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total: item.total
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Create financial transaction if order is received
      if (order.status === 'received') {
        await createFinancialTransaction(
          'expense',
          order.orderNumber,
          order.total,
          order.date,
          order.vendorName || 'Vendor'
        );
      }
      await fetchOrders();
      return newOrder as PurchaseOrder;
    } catch (err) {
      handleSupabaseError(err);
      return null;
    }
  };

  const updateOrder = async (id: string, orderData: any): Promise<boolean> => {
    try {
      const { items, ...order } = orderData;

      // Get the current order to check previous status
      const { data: currentOrder } = await supabase
        .from('purchase_orders')
        .select('status')
        .eq('id', id)
        .single();
      // Update the order
      const { error: orderError } = await supabase
        .from('purchase_orders')
        .update({
          vendor_id: order.vendorId,
          order_number: order.orderNumber,
          date: order.date,
          status: order.status,
          subtotal: order.subtotal,
          tax: order.tax,
          total: order.total
        })
        .eq('id', id);

      if (orderError) throw orderError;

      // Delete existing items
      const { error: deleteError } = await supabase
        .from('order_items')
        .delete()
        .eq('purchase_order_id', id);

      if (deleteError) throw deleteError;

      // Create new items
      if (items && items.length > 0) {
        const orderItems = items.map((item: any) => ({
          purchase_order_id: id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total: item.total
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Create financial transaction if status changed to received
      if (order.status === 'received' && currentOrder?.status !== 'received') {
        await createFinancialTransaction(
          'expense',
          order.orderNumber,
          order.total,
          order.date,
          order.vendorName || 'Vendor'
        );
      }
      await fetchOrders();
      return true;
    } catch (err) {
      handleSupabaseError(err);
      return false;
    }
  };

  const deleteOrder = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setOrders(prev => prev.filter(order => order.id !== id));
      return true;
    } catch (err) {
      handleSupabaseError(err);
      return false;
    }
  };

  const bulkDeleteOrders = async (ids: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .in('id', ids);

      if (error) throw error;
      
      setOrders(prev => prev.filter(order => !ids.includes(order.id)));
      return true;
    } catch (err) {
      handleSupabaseError(err);
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    bulkDeleteOrders,
    refetch: fetchOrders
  };
}