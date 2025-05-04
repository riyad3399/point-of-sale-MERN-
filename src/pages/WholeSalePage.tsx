import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash, ShoppingCart } from "lucide-react";
import SearchableDropdown from "../components/SearchableDropdown";
import axios from "axios";
import { Product } from "../types";
import { TbCurrencyTaka } from "react-icons/tb";
import CheckoutModal from "../components/checkout/CheckoutModal";

export default function WholeSalePage() {
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allProduct, setAllProduct] = useState<Product[]>([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [selectReturnSale, setSelectReturnSale] = useState(0);
  const [open, setOpen] = useState(false);

  const addToCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    setSelectReturnSale(0);
    setShippingCost(0);
  };

  const total = cart.reduce((acc, item) => {
    console.log("item id", acc);
    const product = allProduct.find((p) => p._id === item.id);
    return acc + item.quantity * (product?.wholesalePrice || 0);
  }, 0);

  const categories = ["All", ...new Set(allProduct.map((p) => p.category))];

  const filteredProducts = allProduct.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleReturnSale = (
    product: Product,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const returnSale = e.target.value === "return";
    if (returnSale) {
      setSelectReturnSale(product.wholesalePrice);
    } else {
      setSelectReturnSale(0);
    }
  };

  const totalAmount = (total + shippingCost - selectReturnSale);

  useEffect(() => {
    const handleGetProduct = async () => {
      const res = await axios.get("http://localhost:3000/pos");
      const data = await res.data;
      setAllProduct(data);
    };
    handleGetProduct();
  }, []);

  return (
    <div className=" min-h-screen ">
      <details className="pb-4 px-4 rounded-md">
        <SearchableDropdown />
      </details>

      <div className="flex flex-col lg:flex-row gap-6 mt-4 p-4 shadow-sm rounded-md">
        {/* Product List */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="border px-4 py-2 rounded-lg w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="col-span-full text-center py-20 text-gray-400"
              >
                <img
                  src="/images/empty-box.png"
                  alt="No products"
                  className="mx-auto mb-4 h-24 opacity-70"
                />
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm text-gray-500">
                  Try changing the search or category filter
                </p>
              </motion.div>
            ) : (
              filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 w-full"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => addToCart(product._id)}
                >
                  <div className="overflow-hidden inline-block w-full h-28">
                    <img
                      src={`http://localhost:3000/pos/image/${product._id}`}
                      alt={product.productName}
                      className="hover:scale-110 duration-500 transition-transform object-cover w-full h-full rounded-t-md "
                    />
                  </div>
                  <div className="p-2">
                    <h2 className="font-semibold text-sm  text-gray-800">
                      {product.productName}
                    </h2>
                    <p className="text-blue-600 font-bold text-sm mt-2 flex items-center gap-1">
                      <span>
                        {" "}
                        <TbCurrencyTaka size={20} />
                      </span>
                      {product.wholesalePrice.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Cart Panel */}
        <div className="w-full lg:w-[35%] bg-white shadow-xl rounded-2xl p-4 flex flex-col max-h-screen">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <ShoppingCart /> Items
          </h2>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            <AnimatePresence>
              {cart.map(({ id, quantity }) => {
                const product = allProduct.find((p) => p._id === id);
                if (!product) return null;
                return (
                  <motion.div
                    key={id}
                    className="flex items-start gap-3 border-b pb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        src={`http://localhost:3000/pos/image/${product._id}`}
                        alt={product.productName}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {product.productName}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <span>
                          {" "}
                          <TbCurrencyTaka size={17} />
                        </span>
                        {product.wholesalePrice.toFixed(2)} each
                      </p>
                      <p className="font-semibold text-sm mt-1 flex items-center gap-1">
                        <span>
                          {" "}
                          <TbCurrencyTaka size={18} />
                        </span>
                        {(product.wholesalePrice * quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="relative">
                      <select
                        className="bg-cyan-100 absolute right-6 top-4  focus:outline-none rounded-sm ring-2 ring-blue-500"
                        onChange={() => handleReturnSale(product, event)}
                      >
                        <option value="sale">Sale</option>
                        <option value="return">Return</option>
                      </select>
                    </div>

                    {/* Quantity Buttons in Column */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => updateQuantity(id, 1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Plus size={14} />
                      </button>
                      <span className="text-sm font-medium">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(id, -1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Static Summary */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 80 }}
            className="mt-4 pt-4 border-t space-y-3 text-sm text-gray-700 bg-white z-10"
          >
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping</span>
              <input
                type="number"
                className="border w-20 text-right px-2 py-1 rounded-md"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-800">
              <span>Total</span>
              <span className="flex items-center gap-1">
                <span>
                  <TbCurrencyTaka size={20} />
                </span>
                {(total + shippingCost - selectReturnSale).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500 flex items-center"
              >
                <Trash size={16} className="mr-1" /> Clear Cart
              </motion.button>
              <div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                  onClick={() => setOpen(true)}
                >
                  <ShoppingCart size={18} /> Checkout
                </motion.button>

                {open && (
                  <CheckoutModal
                    totalAmount={totalAmount}
                    onClose={() => setOpen(false)}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
