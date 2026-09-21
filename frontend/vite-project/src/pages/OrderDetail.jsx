import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  Loader2,
} from "lucide-react";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError("Order not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
        <p className="text-sm">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-4">
        <p className="text-base font-semibold text-red-600 mb-2">{error}</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to orders</span>
        </Link>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      {/* Back button */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Orders</span>
      </Link>

      {/* Main Order Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Confirmed
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  ID: {order._id}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mt-1">
                <Calendar className="w-4 h-4" />
                <span>
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:self-center">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-gray-200 text-xs font-medium text-gray-700">
                <span className="text-gray-400 font-normal">Order:</span>
                <span className="capitalize">{order.orderStatus}</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-gray-200 text-xs font-medium text-gray-700">
                <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400 font-normal">Payment:</span>
                <span className="capitalize">{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized List */}
        <div className="p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <span>Items Ordered ({order.items?.length || 0})</span>
          </h2>

          <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden mb-6">
            {order.items.map((item, idx) => {
              const p = item.productId;
              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 p-1">
                      {p?.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-300 stroke-1" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {p?.name || "Product"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Quantity: <span className="font-medium text-gray-700">{item.quantity}</span> × ${Number(item.priceAtPurchase).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      ${(item.quantity * item.priceAtPurchase).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Summary */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 max-w-sm ml-auto space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">${Number(order.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-green-700">Free</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
              <span className="text-sm font-semibold text-gray-900">Total Paid</span>
              <span className="text-xl font-bold text-blue-600">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;