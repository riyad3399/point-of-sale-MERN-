import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash, ShoppingCart, Notebook } from "lucide-react";
import SearchableDropdown from "../components/SearchableDropdown";
import axios from "axios";
import { OptionType, Product, QuotationType } from "../types";
import { TbCurrencyTaka } from "react-icons/tb";
import CheckoutModal from "../components/checkout/CheckoutModal";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { clearCart } from "../utils/clearCart";
import { handleInsertAndUpdateQuotation } from "../utils/handleInsertAndUpdateQuotation";
import { addToCart } from "../utils/cartUtils";
import { handleGetProduct } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import { Howl } from "howler";


export default function WholeSalePage() {
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allProduct, setAllProduct] = useState<Product[]>([]);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [selectReturnSale, setSelectReturnSale] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customers, setCustomers] = useState<OptionType[]>([]);
  const [selectWalking, setSelectWalking] = useState<OptionType | null>(null);
  const [addedCustomer, setAddedCustomer] = useState<OptionType | null>(null);
  const [selectValues, setSelectValues] = useState<{
    [productId: string]: string;
  }>({});
  const { token } = useAuth();

  const location = useLocation();
  const editQuotation = location.state;
  const BASE_URL = import.meta.env.VITE_BASE_URI;

  useEffect(() => {
    if (editQuotation) {
      const cartItems = editQuotation.items.map((item) => ({
        id: item.productId, // depends on your structure
        quantity: item.quantity,
      }));
      setCart(cartItems); // এই cart UI তে render হবে
      if (editQuotation.customer) {
        const selected = {
          value: editQuotation.customer.value || "",
          label: `${editQuotation.customer.customerName} | ${editQuotation.customer.phone}`,
          customerName: editQuotation.customer.customerName.toLowerCase(),
          phone: editQuotation.customer.phone,
        };
        setSelectWalking(selected);
        setAddedCustomer(selected);
      }

      setShippingCost(editQuotation.shippingCost);
    }
  }, [editQuotation]);

  const deleteSelectedItems = () => {
    setCart((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]); // clear selection
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const getProductById = (id: string) => {
    return allProduct.find((p) => p._id === id);
  };

  const handleAddToCart = (id: string) => {
    const sound = new Howl({ src: ["/add-product.mp3"], preload: true });
    sound.play();
    addToCart(id, getProductById, setCart, cart);
  };

  const updateQuantity = (id: string, delta: number) => {
    const product = getProductById(id);
    if (!product) return;

    const sound = new Howl({ src: ["/add-product.mp3"], preload: true });
    sound.play();

    setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.id !== id) return item;

            const newQty = item.quantity + delta;

            if (newQty > product.quantity) {
              Swal.fire({
                icon: "warning",
                title: "স্টকে অতিরিক্ত পণ্য নেই",
                text: `সর্বোচ্চ ${product.quantity}টি নেওয়া যাবে`,
                timer: 1500,
                showConfirmButton: false,
              });
              return item;
            }

            if (newQty <= 0) return null;

            return { ...item, quantity: newQty };
          })
          .filter(Boolean) // remove nulls
    );
  };

  const total = cart.reduce((acc, item) => {
    const product = allProduct.find((p) => p._id === item.id);
    if (!product || !product.fifoStock?.length) return acc;

    let qtyLeft = item.quantity;
    let subTotal = 0;

    for (const stock of product.fifoStock) {
      if (qtyLeft <= 0) break;

      const usedQty = Math.min(stock.remainingQuantity, qtyLeft);
      qtyLeft -= usedQty;

      subTotal += usedQty * stock.wholesalePrice;
    }

    return acc + subTotal;
  }, 0);

  const categories = ["All", ...new Set(allProduct.map((p) => p.category))];

  const filteredProducts = allProduct.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = (product.productName || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleReturnSale = (
    product: Product,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSelectValues((prev) => ({
      ...prev,
      [product._id]: value,
    }));

    const returnSale = e.target.value === "return";
    if (returnSale) {
      setSelectReturnSale(product.wholesalePrice);
    } else {
      setSelectReturnSale(0);
    }
  };

  const handleCheckoutModalOpen = () => {
    if (selectWalking === null) {
      Swal.fire({
        icon: "error",
        title: "Please select a Customer",
      });
      setOpen(false);
    } else if (cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Cart is empty",
      });
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const productsInCart = cart
    .map((item) => {
      const fullProduct = allProduct.find((p) => p._id === item.id);
      if (!fullProduct || !fullProduct.fifoStock?.length) return null;

      let qtyLeft = item.quantity;
      const stockUsed = [];

      for (const stock of fullProduct.fifoStock) {
        if (qtyLeft <= 0) break;

        const usedQty = Math.min(stock.remainingQuantity, qtyLeft);
        qtyLeft -= usedQty;

        stockUsed.push({
          productId: fullProduct._id,
          name: fullProduct.productName,
          quantity: usedQty,
          price: stock.wholesalePrice,
          purchasePrice: stock.purchasePrice,
          status: selectValues[fullProduct._id] || "sale",
        });
      }

      return stockUsed;
    })
    .flat()
    .filter(Boolean);

  const totalAmount = total + shippingCost - selectReturnSale;

  useEffect(() => {
    handleGetProduct(setAllProduct, token, setLoading);

    axios
      .get(`${BASE_URL}/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const options = res.data.map((customer: any) => ({
          value: customer.customerId,
          label: `${customer.customerName} | ${customer.phone}`,
          customerName: customer.customerName.toLowerCase(),
          phone: customer.phone,
        }));

        const optionsWithWalkingCustomer = [
          {
            value: "walking",
            label: "🚶 Walking Customer",
            phone: "",
            customerName: "",
          },
          ...options,
        ];
        setCustomers(optionsWithWalkingCustomer);
      });
  }, []);

  const quotationProduct = [...productsInCart];
  const wholeSale = "wholeSale";

  const newQuotationProduct = quotationProduct.map(
    ({ status: s, ...rest }) => rest
  );

  const quotation: QuotationType = {
    items: newQuotationProduct,
    customer: selectWalking,
    saleType: wholeSale,
    shippingCost: shippingCost,
  };

  return (
    <div className="">
      <Helmet>
        <title>Whole Sale | POS System</title>
      </Helmet>
      <div className="my-2">
        <SearchableDropdown
          customers={customers}
          selectWalking={selectWalking}
          setSelectWalking={setSelectWalking}
          setAddedCustomer={setAddedCustomer}
        />
      </div>

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

          <div className="max-h-screen overflow-y-auto py-4">
            {loading ? (
              <Loading />
            ) : (
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
                  filteredProducts.map((product) => {
                    // FIFO stock থেকে মোট পরিমাণ স্টক বের করো
                    const totalQuantity =
                      product.fifoStock?.reduce(
                        (sum, stock) => sum + stock.remainingQuantity,
                        0
                      ) || 0;

                    // FIFO অনুযায়ী প্রোডাক্টের বর্তমান বিক্রয় মূল্য
                    const currentwholesalePrice =
                      product.fifoStock?.[0]?.wholesalePrice ??
                      product.wholesalePrice;

                    return (
                      <motion.div
                        key={product._id}
                        className="bg-white rounded-xl shadow-md w-full transform transition-all duration-300"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={() =>
                          totalQuantity > 0 && handleAddToCart(product._id)
                        }
                      >
                        {/* ✅ Stock Image and Stock Out Badge */}
                        <div className="relative overflow-hidden inline-block w-full h-28">
                          <img
                            src={
                              product.photo
                                ? `${BASE_URL}${product.photo}`
                                : "/images/no-image.png"
                            }
                            alt={product.productName}
                            loading="lazy"
                            className="hover:scale-110 duration-500 transition-transform object-cover w-full h-full rounded-t-md"
                          />
                          {totalQuantity === 0 && (
                            <div className="absolute top-0 left-0 bg-primary-900 text-sm px-2 py-1 rounded z-0 font-bold w-full h-full flex items-center justify-center opacity-80">
                              <span className="text-white">Stock Out</span>
                            </div>
                          )}
                        </div>

                        {/* ✅ Product Info */}
                        <div className="p-2 space-y-1">
                          <h2 className="font-semibold text-sm text-gray-800">
                            {product.productName}
                          </h2>
                          <p className="text-sm font-semibold text-gray-800">
                            Stock:{" "}
                            <span className="text-blue-600">
                              {totalQuantity}
                            </span>
                          </p>
                          <strong className="text-blue-600 text-sm flex items-center gap-1">
                            <TbCurrencyTaka size={20} />
                            {currentwholesalePrice.toFixed(2)}
                          </strong>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cart Panel */}
        <div className="w-full lg:w-[35%] bg-white shadow-xl rounded-2xl p-4 flex flex-col max-h-screen">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <ShoppingCart /> Items
            </h2>
            {selectedItems.length > 0 && (
              <div className="flex justify-end mb-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={deleteSelectedItems}
                  className="text-sm text-white btn-danger px-3 py-1 rounded-md flex items-center gap-1"
                >
                  <Trash size={16} />
                  Remove
                </motion.button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2">
            <AnimatePresence>
              {cart.map(({ id, quantity }) => {
                const product = allProduct.find((p) => p._id === id);
                if (!product) return null;

                const fifoEntry = product.fifoStock?.find(
                  (stock) => stock.remainingQuantity > 0
                );

                const wholesalePrice =
                  fifoEntry?.wholesalePrice ?? product.wholesalePrice;
                const totalPrice = wholesalePrice * quantity;

                return (
                  <motion.div
                    key={id}
                    className="flex items-start gap-3 border-b pb-4 relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(id)}
                      onChange={() => toggleSelectItem(id)}
                      className="mt-4"
                    />

                    <div className="w-12 h-12 rounded-md overflow-hidden">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        src={
                          product.photo
                            ? `${BASE_URL}${product.photo}`
                            : "/images/no-image.png"
                        }
                        alt={product.productName}
                        loading="lazy"
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-sm">
                          {product.productName}
                        </p>
                        <select
                          className="text-xs absolute right-12 top-6 px-1 py-0.5 rounded-md ring-1 ring-blue-400 focus:outline-none"
                          onChange={(e) => handleReturnSale(product, e)}
                        >
                          <option value="sale">Sale</option>
                          <option value="return">Return</option>
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <TbCurrencyTaka size={17} />
                        {wholesalePrice.toFixed(2)} each
                      </p>
                      <p className="font-semibold text-sm mt-1 flex items-center gap-1">
                        <TbCurrencyTaka size={18} />
                        {total.toFixed(2)}
                      </p>
                    </div>

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
            <div className="flex gap-0.5 justify-between items-center mt-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  clearCart(setCart, setSelectReturnSale, setShippingCost)
                }
                className="text-xs md:text-sm text-gray-500 hover:text-red-500 flex items-center font-semibold"
              >
                <Trash size={16} className="mr-1" /> Clear Cart
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInsertAndUpdateQuotation(quotation)}
                className="text-xs md:text-sm btn-sm md:btn-md btn-success flex items-center font-semibold"
              >
                <Notebook size={16} className="mr-1" /> Quotation
              </motion.button>
              <div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-white btn-sm md:btn-md rounded-lg text-xs md:text-sm flex items-center gap-2"
                  onClick={handleCheckoutModalOpen}
                >
                  <ShoppingCart size={18} /> Checkout
                </motion.button>

                {open && (
                  <CheckoutModal
                    saleSystemValue={"wholeSale"}
                    products={productsInCart}
                    addedCustomer={addedCustomer}
                    selectWalking={selectWalking}
                    totalAmount={totalAmount}
                    customers={customers}
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
