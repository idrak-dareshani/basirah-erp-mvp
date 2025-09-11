import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import InventorySummary from './InventorySummary';
import StockAlerts from './StockAlerts';
import { useSupabaseTable } from '../../hooks/useSupabase';
import { Database } from '../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

export default function Inventory() {
  const { 
    data: products, 
    loading, 
    error, 
    create, 
    update, 
    remove, 
    bulkRemove 
  } = useSupabaseTable('products');
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSaveProduct = async (productData: any) => {
    if (editingProduct) {
      await update(editingProduct.id, productData);
    } else {
      await create(productData);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await remove(id);
    }
  };

  const handleBulkDeleteProducts = async (ids: string[]) => {
    await bulkRemove(ids);
  };

  const lowStockProducts = products.filter(p => p.stock <= p.min_stock);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      <InventorySummary products={products} />
      
      {lowStockProducts.length > 0 && (
        <StockAlerts products={lowStockProducts} />
      )}
      
      <ProductList 
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onBulkDelete={handleBulkDeleteProducts}
        onShowAddForm={() => setShowForm(true)}
      />

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}