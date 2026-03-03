import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/client";
import { useProducts } from "../products/ProductsContext";
import type { Product } from "../types";
import Container from "../components/Container";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const { products, setProducts } = useProducts();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * PAGE_SIZE;
      const data = await apiFetch<Product[]>(
        `/products?offset=${offset}&limit=${PAGE_SIZE}`,
      );
      setProducts(data);
      setHasNext(data.length === PAGE_SIZE);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal memuat produk";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => (p.title || "").toLowerCase().includes(q));
  }, [products, search]);

  return (
    <Container>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Products</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse our latest collection
          </p>
        </div>

        <input
          className="w-full sm:w-80 rounded-xl border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-6 text-sm text-slate-600">Loading...</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border bg-white overflow-hidden"
            >
              <div className="aspect-[4/3] bg-slate-100">
                <img
                  src={
                    (p.images && p.images[0]) || "https://placehold.co/600x400"
                  }
                  alt={p.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="font-medium line-clamp-2">{p.title}</div>
                <div className="mt-1 text-sm text-slate-700">${p.price}</div>
                <div className="mt-2 text-xs text-slate-500">
                  Category: {p.category?.name ?? "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>

        <div className="text-sm text-slate-600">Page {page}</div>

        <button
          className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
          disabled={!hasNext || loading}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </Container>
  );
}
