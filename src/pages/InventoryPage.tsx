import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Edit, Trash2, Tag, Box } from 'lucide-react';
import { Product } from '../types';

const InventoryPage: React.FC = () => {
  const { products, categories } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredProducts = products.filter(product => {
    // Filter by category
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-gray-500">Manage your products and stock</p>
        </div>
        
        <motion.button
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </motion.button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="input pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            className="input"
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <button className="btn-outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>
      
      {/* Inventory Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">SKU</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Price</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Stock</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="py-6 text-center text-gray-500">
            <Box className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ProductRowProps {
  product: Product;
}

const ProductRow: React.FC<ProductRowProps> = ({ product }) => {
  return (
    <motion.tr 
      className="border-b border-gray-100 hover:bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <td className="py-3 px-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden mr-3">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-xs text-gray-500">{product.description.substring(0, 30)}...</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600">{product.sku}</td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <Tag className="h-3 w-3 mr-1 text-gray-400" />
          <span>{product.category}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-right font-medium">${product.price.toFixed(2)}</td>
      <td className="py-3 px-4 text-right">
        <span className={`font-medium ${
          product.stock < 10 ? 'text-warning-600' : 'text-gray-700'
        }`}>
          {product.stock}
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
          product.isActive 
            ? 'bg-success-100 text-success-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {product.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="py-3 px-4 text-right whitespace-nowrap">
        <div className="flex justify-end gap-2">
          <motion.button 
            className="p-1 text-gray-500 hover:text-primary-600 rounded-full hover:bg-primary-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit className="h-4 w-4" />
          </motion.button>
          <motion.button 
            className="p-1 text-gray-500 hover:text-danger-600 rounded-full hover:bg-danger-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default InventoryPage;