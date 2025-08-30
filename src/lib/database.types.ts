export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          sku: string
          description: string
          category: string
          unit_price: number
          cost_price: number
          stock: number
          min_stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          sku: string
          description?: string
          category: string
          unit_price: number
          cost_price: number
          stock: number
          min_stock: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          sku?: string
          description?: string
          category?: string
          unit_price?: number
          cost_price?: number
          stock?: number
          min_stock?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          type: 'income' | 'expense'
          category: string
          description: string
          amount: number
          date: string
          reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'income' | 'expense'
          category: string
          description: string
          amount: number
          date: string
          reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'income' | 'expense'
          category?: string
          description?: string
          amount?: number
          date?: string
          reference?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sales_orders: {
        Row: {
          id: string
          customer_id: string
          order_number: string
          date: string
          status: 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          subtotal: number
          tax: number
          total: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          order_number: string
          date: string
          status?: 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          subtotal: number
          tax: number
          total: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          order_number?: string
          date?: string
          status?: 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          subtotal?: number
          tax?: number
          total?: number
          created_at?: string
          updated_at?: string
        }
      }
      purchase_orders: {
        Row: {
          id: string
          vendor_id: string
          order_number: string
          date: string
          status: 'draft' | 'confirmed' | 'received' | 'cancelled'
          subtotal: number
          tax: number
          total: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          order_number: string
          date: string
          status?: 'draft' | 'confirmed' | 'received' | 'cancelled'
          subtotal: number
          tax: number
          total: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          order_number?: string
          date?: string
          status?: 'draft' | 'confirmed' | 'received' | 'cancelled'
          subtotal?: number
          tax?: number
          total?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          sales_order_id: string | null
          purchase_order_id: string | null
          product_id: string
          quantity: number
          unit_price: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          sales_order_id?: string | null
          purchase_order_id?: string | null
          product_id: string
          quantity: number
          unit_price: number
          total: number
          created_at?: string
        }
        Update: {
          id?: string
          sales_order_id?: string | null
          purchase_order_id?: string | null
          product_id?: string
          quantity?: number
          unit_price?: number
          total?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}