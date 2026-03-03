import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { isAuthed, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-slate-800 hover:text-slate-900"
        >
          Platzi <span className="text-indigo-600">Products</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-slate-600 hover:text-slate-900 transition"
          >
            Products
          </Link>

          {isAuthed ? (
            <>
              <Link
                to="/add"
                className="text-sm text-slate-600 hover:text-slate-900 transition"
              >
                Add Product
              </Link>

              <span className="text-xs text-slate-500">{userEmail}</span>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="px-4 py-2 text-sm rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
