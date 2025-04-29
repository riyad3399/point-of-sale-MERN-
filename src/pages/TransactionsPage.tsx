import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CalendarRange, Filter, FileText, Eye, Download, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const TransactionsPage: React.FC = () => {
  const { transactions } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-gray-500">View and manage your sales history</p>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            className="btn-outline btn-sm flex items-center gap-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="h-4 w-4" />
            Export
          </motion.button>
          
          <motion.button
            className="btn-outline btn-sm flex items-center gap-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </motion.button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="input pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button className="btn-outline">
            <CalendarRange className="h-4 w-4 mr-2" />
            Date Range
          </button>
          
          <button className="btn-outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>
      
      {/* Transactions Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-gray-500 text-sm">Total Sales</p>
          <h3 className="text-2xl font-bold mt-1">$1,452.25</h3>
          <p className="text-success-600 text-sm mt-1">+24% from last week</p>
        </div>
        <div className="card p-4">
          <p className="text-gray-500 text-sm">Average Order Value</p>
          <h3 className="text-2xl font-bold mt-1">$34.58</h3>
          <p className="text-success-600 text-sm mt-1">+2% from last week</p>
        </div>
        <div className="card p-4">
          <p className="text-gray-500 text-sm">Total Transactions</p>
          <h3 className="text-2xl font-bold mt-1">42</h3>
          <p className="text-success-600 text-sm mt-1">+12% from last week</p>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Transaction ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Cashier</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Payment Method</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Items</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Total</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <motion.tr 
                    key={transaction.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="py-3 px-4 font-medium">#{transaction.id.substring(0, 8)}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{transaction.cashierName}</td>
                    <td className="py-3 px-4 capitalize">{transaction.paymentMethod}</td>
                    <td className="py-3 px-4 text-right">{transaction.items.length}</td>
                    <td className="py-3 px-4 text-right font-medium">${transaction.total.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-success-100 text-success-700">
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <motion.button 
                          className="p-1 text-gray-500 hover:text-primary-600 rounded-full hover:bg-primary-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="h-4 w-4" />
                        </motion.button>
                        <motion.button 
                          className="p-1 text-gray-500 hover:text-primary-600 rounded-full hover:bg-primary-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FileText className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No transactions found</p>
                    <p className="text-sm">Complete your first sale to see it here</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;