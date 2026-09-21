import { Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, Headphones } from "lucide-react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Products from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCategories from "./pages/admin/AdminCategories";

function Home() {
  const { user } = useAuth();

  return (
    <div className="flex-1 flex flex-col">
      {/* Clean Simple Hero Section */}
      <section className="bg-white border-b border-gray-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
            {user ? `Welcome back, ${user.name}!` : "Welcome to MyShop"}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mb-6">
            A simple and easy-to-use store. Browse our available products and place your order in a few clicks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {!user ? (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-gray-700 text-sm font-medium border border-gray-300 hover:bg-gray-50"
              >
                Register
              </Link>
            ) : (
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-gray-700 text-sm font-medium border border-gray-300 hover:bg-gray-50"
              >
                My Orders
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Simple 3-Box Features */}
      <section className="py-10 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Fast Shipping</h3>
              <p className="text-xs text-gray-500">Quick delivery on all orders</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Safe & Secure</h3>
              <p className="text-xs text-gray-500">Protected order processing</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Customer Support</h3>
              <p className="text-xs text-gray-500">Help when you need it</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;