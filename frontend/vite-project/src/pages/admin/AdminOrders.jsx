import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  ShoppingBag,
  Calendar,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const ORDER_STATUSES = ["processing", "shipped", "delivered", "cancelled"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to load customer orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);

    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order status updated to "${newStatus}"`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
        <p className="text-sm text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Customer Orders</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Review placed orders and update fulfillment lifecycle
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 p-6 max-w-md mx-auto">
          <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-2 stroke-1" />
          <h3 className="font-semibold text-gray-800 text-base mb-1">No orders yet</h3>
          <p className="text-sm text-gray-500">Customer orders will appear here once placed.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-gray-50"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1 font-medium text-gray-700">
                    <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                    {order.userId?.name || "Anonymous User"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-blue-600">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                <div className="relative">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updatingId === order._id}
                    className="px-3 py-1.5 rounded-md bg-white border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 capitalize focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 cursor-pointer"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option value={status} key={status} className="capitalize">
                        Status: {status}
                      </option>
                    ))}
                  </select>
                </div>
                {updatingId === order._id && (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;