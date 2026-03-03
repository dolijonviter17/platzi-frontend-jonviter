import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Toast, { ToastState } from "../components/Toast";
import Container from "../components/Container";

const schema = z.object({
  username: z.string().min(1, "username wajib diisi"),
  password: z.string().min(1, "password wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState<ToastState>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      await login(values);
      setToast({ type: "success", message: "Login berhasil" });
      navigate("/", { replace: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Login gagal";
      setToast({ type: "error", message: msg });
    }
  }

  return (
    <Container className="max-w-md py-10">
      <Toast
        {...(toast ?? { type: "info", message: "" })}
        onClose={() => setToast(null)}
      />
      <h1 className="text-xl font-semibold">Login</h1>
      <p className="text-sm text-slate-600 mt-1">
        Username diperlakukan sebagai <b>email</b>.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">Username</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="john@mail.com"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-xs text-red-600 mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border px-3 py-2"
            placeholder="changeme"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-900 text-white py-2 hover:bg-slate-800 disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </Container>
  );
}
