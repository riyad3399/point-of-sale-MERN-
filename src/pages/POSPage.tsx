import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Filter,
  Tag,
  Plus,
  Minus,
  X,
  CreditCard,
} from "lucide-react";
import NumPad from "../components/pos/NumPad";
import CheckoutModal from "../components/pos/CheckoutModal";
import { sampleCategories, sampleProducts } from "../data/sampleData";
import { useAppContext } from "../context/AppContext";
import Card from "../components/card/Card";

const POSPage: React.FC = () => {
  const { addToCart,  removeFromCart } = useAppContext();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const getAllProducts = async () => {
    const res = await fetch("http://localhost:3000/pos/");
    const data = await res.json();
    setAllProducts(data);
  };
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Point of Sale</h1>
          <p className="text-gray-500">Create a new transaction</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Products Panel */}
        <div className="flex-1 flex flex-col">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
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
              <button className="btn-outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <button className="btn-outline">
                <Tag className="h-4 w-4 mr-2" />
                Sort
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex overflow-x-auto pb-2 mb-4 gap-2">
            <button
              className={`btn px-4 py-1 whitespace-nowrap ${
                selectedCategory === null
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All Items
            </button>

            {sampleCategories.map((category) => (
              <button
                key={category}
                className={`btn px-4 py-1 whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-4 flex-1">
            <AnimatePresence>
              {allProducts.map((product) => (
                <Card product={product} key={product._id}/>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Cart Panel */}
        <div className="md:w-96 lg:w-[400px] flex flex-col bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Cart Header */}
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-medium">Current Order</h2>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {allProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingCart className="h-12 w-12 mb-2 opacity-20" />
                <p className="text-center">Your cart is empty</p>
                <p className="text-center text-sm">Add items from the menu</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allProducts.map((item) => (
                  <motion.div
                    key={item._id}
                    className="flex items-center gap-3 pb-3 border-b border-gray-100"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {/* Product image */}
                    {item.photo && (
                      <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={item.photo}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    {/* Product details */}
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ${item.retailPrice.toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        className="btn-sm p-1 bg-gray-100 rounded"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Minus className="h-4 w-4" />
                      </motion.button>

                      <span className="w-5 text-center font-medium">
                        {item.retailPrice}
                      </span>

                      <motion.button
                        className="btn-sm p-1 bg-gray-100 rounded"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus className="h-4 w-4" />
                      </motion.button>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        ${(item.retailPrice * item.retailPrice).toFixed(2)}
                      </span>

                      <motion.button
                        className="text-gray-400 hover:text-red-500"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Number Pad */}
          <div className="border-t border-gray-100 p-4">
            <NumPad />
          </div>

          {/* Cart Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-medium"></span>
            </div>

            <button
              className="btn-primary w-full flex justify-center items-center gap-2"
              disabled={sampleProducts.length === 0}
              onClick={() => setShowCheckoutModal(true)}
            >
              <CreditCard className="h-5 w-5" />
              Checkout ($)
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <CheckoutModal onClose={() => setShowCheckoutModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default POSPage;
