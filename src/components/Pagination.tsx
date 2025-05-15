import { motion, AnimatePresence } from "framer-motion";

interface PaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  currentTransactions: any[];
  prevPage: () => void;
  nextPage: () => void;
  setPage: (page: number) => void;
}

const Pagination = ({
  page,
  totalPages,
  pageSize,
  currentTransactions,
  prevPage,
  nextPage,
  setPage,
}: PaginationProps) => {
  const renderPages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((p, idx) =>
      typeof p === "string" ? (
        <span key={idx} className="mx-1 text-gray-400 text-sm">
          {p}
        </span>
      ) : (
        <motion.button
          key={idx}
          onClick={() => setPage(p)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-8 h-8 rounded-full mx-1 text-sm font-medium transition-all duration-200 ${
            p === page
              ? "btn-primary text-white shadow-md"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          {p}
        </motion.button>
      )
    );
  };

  return (
    <div className="flex items-center justify-center mt-6">
      <div className="bg-white shadow-md px-3 py-2 rounded-full flex items-center overflow-x-auto max-w-full sm:px-4">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="mx-1 text-gray-600 hover:text-black disabled:opacity-30 text-xl"
        >
          ❮
        </button>

        <AnimatePresence>{renderPages()}</AnimatePresence>

        <button
          onClick={nextPage}
          disabled={currentTransactions.length < pageSize}
          className="mx-1 text-gray-600 hover:text-black disabled:opacity-30 text-xl"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default Pagination;
