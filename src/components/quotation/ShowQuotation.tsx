import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User2,
  CalendarDays,
  ShoppingBag,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { QuotationType } from "../../types";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";


const ShowQuotation: React.FC<{
  quotations: QuotationType[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}> = ({ quotations, onEdit, onDelete }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [saleTypeFilter, setSaleTypeFilter] = useState<string>("All");

  const handleMenuToggle = (index: number) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };


  const filteredQuotations = useMemo(() => {
    return quotations.filter((q) => {
      const matchesSearch =
        q.customer.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        q.quotationId.toString().includes(searchTerm) ||
        q.customer.phone.includes(searchTerm);

      const matchesSaleType =
        saleTypeFilter === "All" ||
        q.saleType.toLowerCase() === saleTypeFilter.toLowerCase();

      return matchesSearch && matchesSaleType;
    });
  }, [quotations, searchTerm, saleTypeFilter]);

  const getTotal = (items: QuotationType["items"]) =>
    items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Search and SaleType filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 relative">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute h-5 w-5 text-primary-500 left-2 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer Name, Phone or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded pl-10 pr-3 py-2 shadow-sm transition w-full input"
          />
        </div>

        <select
          value={saleTypeFilter}
          onChange={(e) => setSaleTypeFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 shadow-sm input transition w-full md:w-1/4"
        >
          <option value="All">All Sales</option>
          <option value="wholesale">WholeSale</option>
          <option value="retailSale">RetailSale</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuotations.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No quotations found.
          </p>
        )}

        {filteredQuotations.map((quote, i) => (
          <motion.div
            key={quote.quotationId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative rounded-2xl shadow-md border border-gray-200 bg-white p-5 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                <CalendarDays size={14} />
                <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => handleMenuToggle(i)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  aria-label="More options"
                >
                  <MoreVertical size={18} />
                </button>

                {openMenuIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-1 w-32 bg-white border rounded shadow-md z-50"
                  >
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
                      onClick={() => onEdit?.(quote._id)}
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => onDelete?.(quote._id)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 text-gray-700 mb-1">
                <User2 size={16} />
                <span>
                  {capitalizeFirstLetter(quote.customer?.customerName)}
                </span>
                |<p>{quote.quotationId}</p>
              </div>
              <p className="text-sm text-gray-500 ml-6">
                {quote.customer.phone}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-1">
                <ShoppingBag size={16} />
                <span>Items ({quote.items.length})</span>

                <button
                  onClick={() => toggleExpand(i)}
                  className="ml-auto p-1 rounded-full hover:bg-gray-100 transition"
                  aria-label={
                    expandedIndex === i ? "Collapse items" : "Expand items"
                  }
                >
                  {expandedIndex === i ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {expandedIndex === i ? (
                  <motion.ul
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-auto max-h-48 border rounded p-3 bg-gray-50 text-sm text-gray-700"
                  >
                    {quote.items.map((item, idx) => (
                      <li key={idx} className="mb-2 last:mb-0">
                        <span className="font-semibold">{item.name}</span> ×{" "}
                        {item.quantity} — ৳{item.price}
                      </li>
                    ))}
                  </motion.ul>
                ) : (
                  <ul className="text-sm text-gray-600 ml-2 list-disc max-h-16 overflow-hidden">
                    {quote.items.slice(0, 3).map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity} — ৳{item.price}
                      </li>
                    ))}
                    {quote.items.length > 3 && (
                      <li className="italic text-gray-400">...and more</li>
                    )}
                  </ul>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full capitalize">
                {quote.saleType}
              </span>
              <span className="text-lg font-semibold text-green-600">
                ৳{getTotal(quote.items) + quote?.shippingCost}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ShowQuotation;
