import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  Package,
  Calendar,
  ChevronRight,
  Loader2,
  ShoppingBag,
} from "lucide-react";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
        <p className="text-sm">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-4">
        <p className="text-base font-semibold text-red-600 mb-2">{error}</p>
        <Link
          to="/"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your past orders and status
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center max-w-md mx-auto">
          <ShoppingBag className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            No orders found
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700"
          >
            <span>Browse Products</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-bold text-gray-900 text-base">
                      ${Number(order.total).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex flex-col sm:flex-row gap-1.5 items-end sm:items-center">
                      <StatusBadge label={order.orderStatus} />
                      <StatusBadge label={order.paymentStatus} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 hidden sm:block" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ label }) {
  const getBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "paid":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${getBadgeStyle(label)}`}
    >
      {label}
    </span>
  );
}

export default Orders;