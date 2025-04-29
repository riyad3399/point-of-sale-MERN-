import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Layers, ArrowUpRight, ArrowDownRight, BarChart3, Users } from 'lucide-react';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Today's Sales"
          value="$1,452.25"
          trend="up"
          percentage="24%"
          icon={<DollarSign className="h-5 w-5" />}
          color="primary"
        />
        <StatsCard 
          title="Total Orders"
          value="42"
          trend="up"
          percentage="12%"
          icon={<Layers className="h-5 w-5" />}
          color="success"
        />
        <StatsCard 
          title="Items Sold"
          value="186"
          trend="up"
          percentage="18%"
          icon={<BarChart3 className="h-5 w-5" />}
          color="warning"
        />
        <StatsCard 
          title="Customers"
          value="14"
          trend="down"
          percentage="5%"
          icon={<Users className="h-5 w-5" />}
          color="danger"
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">Sales Overview</h2>
          <div className="bg-gray-100 rounded-lg h-[250px] flex items-center justify-center">
            {/* Placeholder for chart */}
            <p className="text-gray-500">Sales chart will be displayed here</p>
          </div>
        </div>
        
        <div className="card p-6">
          <h2 className="text-lg font-bold mb-4">Popular Items</h2>
          <div className="space-y-3">
            {['Cappuccino', 'Avocado Toast', 'Blueberry Muffin', 'Latte', 'Breakfast Sandwich'].map((item, index) => (
              <div 
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="h-10 w-10 bg-gray-200 rounded-md mr-3"></div>
                <div className="flex-1">
                  <h3 className="font-medium">{item}</h3>
                  <p className="text-sm text-gray-500">{Math.floor(Math.random() * 100)} sold</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(Math.random() * 10).toFixed(2)}</p>
                  <p className="text-xs text-success-600">
                    +{Math.floor(Math.random() * 30)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Transaction ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Cashier</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Total</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">#TRX-{Math.floor(Math.random() * 10000)}</td>
                  <td className="py-3 px-4 text-gray-600">{new Date().toLocaleDateString()}</td>
                  <td className="py-3 px-4">John Smith</td>
                  <td className="py-3 px-4 text-right font-medium">${(Math.random() * 100).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-success-100 text-success-700">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down';
  percentage: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'danger';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, percentage, icon, color }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    danger: 'bg-danger-50 text-danger-600',
  };
  
  return (
    <motion.div 
      className="card p-5"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center mt-3">
        {trend === 'up' ? (
          <ArrowUpRight className="h-4 w-4 text-success-600 mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-danger-600 mr-1" />
        )}
        <span className={`text-sm font-medium ${
          trend === 'up' ? 'text-success-600' : 'text-danger-600'
        }`}>
          {percentage}
        </span>
        <span className="text-gray-500 text-sm ml-1">vs last week</span>
      </div>
    </motion.div>
  );
};

export default DashboardPage;