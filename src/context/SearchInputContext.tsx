import React, { createContext, useRef, useContext } from "react";

const SearchInputContext =
  createContext<React.RefObject<HTMLInputElement> | null>(null);

export const SearchInputProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const searchRef = useRef<HTMLInputElement>(null);
  return (
    <SearchInputContext.Provider value={searchRef}>
      {children}
    </SearchInputContext.Provider>
  );
};

export const useSearchInput = () => {
  const ctx = useContext(SearchInputContext);
  if (!ctx)
    throw new Error("useSearchInput must be used inside SearchInputProvider");
  return ctx;
};
