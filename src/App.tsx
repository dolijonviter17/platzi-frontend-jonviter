import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import "./index.css";
import AddProductPage from "./pages/AddProductPage";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProductsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/add" element={<AddProductPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
