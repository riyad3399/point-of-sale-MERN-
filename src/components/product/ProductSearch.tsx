import React, { useEffect, useRef } from "react";

interface Props {
  search: string;
  setSearch: (val: string) => void;
}

const ProductSearch: React.FC<Props> = ({ search, setSearch }) => {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleFocus = () => {
      searchRef.current?.focus();
    };

    window.addEventListener("focusProductSearch", handleFocus);
    return () => {
      window.removeEventListener("focusProductSearch", handleFocus);
    };
  }, []);

  return (
    <input
      ref={searchRef}
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search products..."
      className="border px-4 py-2 rounded-lg w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
    />
  );
};

export default ProductSearch;
