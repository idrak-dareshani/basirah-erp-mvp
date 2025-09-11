import React, { useState } from 'react';
import { Edit, Trash2, AlertTriangle, Search, Download, Trash, Eye, X, Plus } from 'lucide-react';
import { Database } from '../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onShowAddForm?: () => void;
}

export default function ProductList({ products, onEdit, onDelete, onBulkDelete, onShowAddForm }: ProductListProps) {
  const [filter, setFilter] = useState<'all' | 'low-stock' | 'category'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showProductDetails, setShowProductDetails] = useState<Product | null>(null);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products
    .filter(product => {
      if (filter === 'low-stock') return product.stock <= product.min_stock;
      if (filter === 'category' && categoryFilter) return product.category === categoryFilter;
      return true;
    })
    .filter(product =>
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortOrder === 'desc' ? -1 : 1;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * multiplier;
      if (sortBy === 'stock') return (b.stock - a.stock) * multiplier;
      return (b.unit_price - a.unit_price) * multiplier;
    });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredProducts.map(p => p.id));
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
      if (confirm(`Are you sure you want to delete ${selectedItems.length} products?`)) {
        onBulkDelete(selectedItems);
        setSelectedItems([]);
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'SKU', 'Category', 'Cost Price', 'Unit Price', 'Margin %', 'Stock', 'Min Stock', 'Total Value', 'Created'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(p => [
        `"${p.name}"`,
        p.sku,
        p.category,
        p.cost_price.toFixed(2),
        p.unit_price.toFixed(2),
        (((p.unit_price - p.cost_price) / p.unit_price) * 100).toFixed(1),
        p.stock,
        p.min_stock,
        (p.stock * p.unit_price).toFixed(2),
        new Date(p.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-slate-900">Products</h3>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value as 'all' | 'low-stock' | 'category');
                  if (e.target.value !== 'category') setCategoryFilter('');
                }}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Products</option>
                <option value="low-stock">Low Stock</option>
                <option value="category">By Category</option>
              </select>
              
              {filter === 'category' && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              )}
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'stock' | 'price')}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="stock">Sort by Stock</option>
                <option value="price">Sort by Price</option>
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
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
              
            </div>
          </div>
          
          {selectedItems.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
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
                    checked={selectedItems.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cost Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Margin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.map((product) => {
                const isLowStock = product.stock <= product.min_stock;
                const margin = ((product.unit_price - product.cost_price) / product.unit_price) * 100;
                return (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(product.id)}
                        onChange={(e) => handleSelectItem(product.id, e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-slate-900">{product.name}</p>
                          {isLowStock && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{product.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      ${product.cost_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-slate-900'}`}>
                          {product.stock}
                        </span>
                        <span className="text-slate-500"> / {product.min_stock} min</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      ${product.unit_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <span className={`${margin > 20 ? 'text-green-600' : margin > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {margin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      ${(product.stock * product.unit_price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowProductDetails(product)}
                          className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onEdit(product)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-slate-500 mb-4">
              {searchTerm || filter !== 'all' || categoryFilter
                ? 'No products match your search criteria.' 
                : 'No products found. Add your first product to get started.'
              }
            </div>
            {(searchTerm || filter !== 'all' || categoryFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                  setCategoryFilter('');
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {showProductDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Product Details</h3>
              <button
                onClick={() => setShowProductDetails(null)}
                className="p-1 rounded-md hover:bg-slate-100"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Basic Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-slate-500">Product Name</span>
                      <p className="text-sm font-medium text-slate-900">{showProductDetails.name}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">SKU</span>
                      <p className="text-sm text-slate-900">{showProductDetails.sku}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Category</span>
                      <p className="text-sm text-slate-900">{showProductDetails.category}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Description</span>
                      <p className="text-sm text-slate-900">{showProductDetails.description || 'No description'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Pricing & Stock</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-slate-500">Unit Price</span>
                      <p className="text-sm font-medium text-green-600">${showProductDetails.unit_price.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Cost Price</span>
                      <p className="text-sm text-slate-900">${showProductDetails.cost_price.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Profit Margin</span>
                      <p className="text-sm font-medium text-blue-600">
                        {(((showProductDetails.unit_price - showProductDetails.cost_price) / showProductDetails.unit_price) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Current Stock</span>
                      <p className={`text-sm font-medium ${showProductDetails.stock <= showProductDetails.min_stock ? 'text-red-600' : 'text-slate-900'}`}>
                        {showProductDetails.stock} units
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Minimum Stock</span>
                      <p className="text-sm text-slate-900">{showProductDetails.min_stock} units</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Total Value</span>
                      <p className="text-sm font-medium text-slate-900">
                        ${(showProductDetails.stock * showProductDetails.unit_price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {showProductDetails.stock <= showProductDetails.min_stock && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Low Stock Alert</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    This product is running low on stock. Consider reordering soon.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => onShowAddForm?.()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}