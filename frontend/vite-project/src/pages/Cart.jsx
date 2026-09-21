import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Package,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const fetchCart = () => {
    setLoading(true);
    api
      .get("/cart")
      .then((res) => setCart(res.data))
      .catch(() => setError("Failed to load cart"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/${productId}`, { quantity });
      fetchCart();
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to update quantity";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      toast.success("Item removed from cart");
      fetchCart();
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to remove item";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      toast.success("Cart cleared");
      fetchCart();
    } catch (err) {
      setError("Failed to clear cart");
      toast.error("Failed to clear cart");
    }
  };

  const handleCheckout = async () => {
    setPlacingOrder(true);
    setError("");
    try {
      const res = await api.post("/orders");
      toast.success("Order placed successfully!");
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to place order";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading && !cart) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-sm text-gray-600">Loading cart...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Your Cart</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {items.length} {items.length === 1 ? "item" : "items"} in cart
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <h2 className="text-base font-bold text-gray-800 mb-1">Your cart is empty</h2>
          <p className="text-xs text-gray-500 mb-4">Add some products to get started.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
          >
            <span>Browse Products</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Items List */}
          <div className="md:col-span-2 space-y-3">
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
              {items.map((item) => {
                const p = item.productId;
                if (!p) return null;

                return (
                  <div
                    key={p._id}
                    className="p-4 flex items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 p-1">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400 stroke-1" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${p._id}`}
                        className="font-semibold text-gray-800 hover:text-blue-600 text-sm line-clamp-1"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-blue-600 font-bold mt-0.5">
                        ${Number(p.price).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          type="button"
                          onClick={() => updateQuantity(p._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(p._id, item.quantity + 1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-gray-900 min-w-[50px] text-right">
                        ${(p.price * item.quantity).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeItem(p._id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center px-1">
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-red-600 hover:underline"
              >
                Clear Cart
              </button>
              <Link to="/products" className="text-xs text-blue-600 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-bold text-gray-900">
                <span>Total</span>
                <span className="text-base text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={placingOrder}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-xs font-semibold disabled:opacity-50"
            >
              {placingOrder ? "Placing Order..." : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
