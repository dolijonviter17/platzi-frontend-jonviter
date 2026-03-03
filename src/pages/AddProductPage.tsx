import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "../api/client";
import { useProducts } from "../products/ProductsContext";
import Toast, { ToastState } from "../components/Toast";
import type { Category, Product } from "../types";

const schema = z.object({
  title: z
    .string()
    .min(1, "title wajib diisi")
    .max(150, "maksimal 150 karakter"),
  price: z.coerce.number().optional(),
  description: z.string().optional(),
  categoryId: z.coerce.number().min(1, "categoryId wajib diisi"),
  images: z.string().optional(), // comma separated
});

type FormValues = z.infer<typeof schema>;

type CreateProductPayload = {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
};

export default function AddProductPage() {
  const { addProductLocal } = useProducts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [toast, setToast] = useState<ToastState>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    apiFetch<Category[]>("/categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  async function onSubmit(values: FormValues) {
    try {
      const imagesArr = values.images
        ? values.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const payload: CreateProductPayload = {
        title: values.title,
        price: values.price ?? 0,
        description: values.description ?? "",
        categoryId: values.categoryId,
        images: imagesArr.length ? imagesArr : ["https://placehold.co/600x400"],
      };

      const created = await apiFetch<Product, CreateProductPayload>(
        "/products",
        {
          method: "POST",
          body: payload,
        },
      );

      addProductLocal(created);
      setToast({ type: "success", message: "Produk berhasil ditambahkan" });
      reset();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal menambahkan produk";
      setToast({ type: "error", message: msg });
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-xl font-semibold">Add Product</h1>
      <p className="text-sm text-slate-600 mt-1">
        Images: masukkan URL, pisahkan dengan koma.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
        <div>
          <label className="text-sm">Title *</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm">Price</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            type="number"
            step="0.01"
            {...register("price")}
          />
          {errors.price && (
            <p className="text-xs text-red-600 mt-1">
              {String(errors.price.message)}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm">Description</label>
          <textarea
            className="mt-1 w-full rounded-xl border px-3 py-2"
            rows={4}
            {...register("description")}
          />
        </div>

        <div>
          <label className="text-sm">Category *</label>
          <select
            className="mt-1 w-full rounded-xl border px-3 py-2"
            defaultValue=""
            {...register("categoryId")}
          >
            <option value="" disabled>
              Pilih kategori
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (id: {c.id})
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-red-600 mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm">Images (opsional)</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="https://.../1.jpg, https://.../2.jpg"
            {...register("images")}
          />
        </div>

        <button
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 text-white py-2 hover:bg-slate-800 disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
