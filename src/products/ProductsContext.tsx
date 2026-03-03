import React, { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "../types";

type ProductsContextValue = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProductLocal: (p: Product) => void;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  function addProductLocal(p: Product) {
    setProducts((prev) => [p, ...prev]);
  }

  const value = useMemo<ProductsContextValue>(
    () => ({ products, setProducts, addProductLocal }),
    [products],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
