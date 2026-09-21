import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  Package,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-xl font-bold text-blue-600"
          >
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <span>MyShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/products"
              className={`flex items-center gap-1.5 text-sm font-medium ${
                isActive("/products")
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </Link>

            {user && (
              <Link
                to="/cart"
                className={`flex items-center gap-1.5 text-sm font-medium ${
                  isActive("/cart")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart</span>
              </Link>
            )}

            {user && (
              <Link
                to="/orders"
                className={`flex items-center gap-1.5 text-sm font-medium ${
                  isActive("/orders")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>My Orders</span>
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 text-sm font-medium ${
                  location.pathname.startsWith("/admin")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Hi, <span className="font-semibold text-gray-800">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded border border-red-100"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-1.5"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3.5 py-1.5 rounded"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          <Link
            to="/products"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium ${
              isActive("/products")
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Package className="w-4 h-4 text-blue-600" />
            <span>Products</span>
          </Link>

          {user && (
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium ${
                isActive("/cart")
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <span>Cart</span>
            </Link>
          )}

          {user && (
            <Link
              to="/orders"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium ${
                isActive("/orders")
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ClipboardList className="w-4 h-4 text-blue-600" />
              <span>My Orders</span>
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium ${
                location.pathname.startsWith("/admin")
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <div className="pt-3 mt-2 border-t border-gray-100">
            {user ? (
              <div className="space-y-2">
                <p className="px-3 text-xs text-gray-500">
                  Signed in as <span className="font-semibold text-gray-700">{user.name}</span>
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 rounded bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
