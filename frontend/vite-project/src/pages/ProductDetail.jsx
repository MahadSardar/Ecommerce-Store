import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Loader2,
  Trash2,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [savingReview, setSavingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const fetchReviews = () => {
    api
      .get(`/reviews/product/${id}`)
      .then((res) => {
        setReviews(res.data.reviews || []);
        setAvgRating(res.data.averageRating || 0);
        setTotalReviews(res.data.totalReviews || 0);
      })
      .catch(() => setReviews([]));
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const myReview = user
    ? reviews.find((r) => r.userId?._id === user._id)
    : null;

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment);
    }
  }, [myReview]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setSavingReview(true);

    try {
      if (myReview) {
        await api.put(`/reviews/${myReview._id}`, { rating, comment });
        toast.success("Review updated successfully!");
      } else {
        await api.post("/reviews", { productId: id, rating, comment });
        toast.success("Review submitted successfully!");
      }
      fetchReviews();
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to submit review";
      setReviewError(errMsg);
      toast.error(errMsg);
    } finally {
      setSavingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!confirm("Delete your review?")) return;
    try {
      await api.delete(`/reviews/${myReview._id}`);
      setRating(5);
      setComment("");
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to delete review";
      toast.error(errMsg);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please sign in to add items to your cart");
      navigate("/login");
      return;
    }
    setAddingToCart(true);
    setCartMessage("");
    try {
      await api.post("/cart", { productId: id, quantity });
      setCartMessage("Added to cart");
      toast.success(`${quantity}x ${product.name} added to cart!`);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to add to cart";
      setCartMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-sm text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
        <p className="text-base font-bold text-red-600 mb-2">{error}</p>
        <Link to="/products" className="text-sm text-blue-600 hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const hasImage = product.images && product.images.length > 0;
  const isAvailable = product.stock > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
      {/* Back Link */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Product Image */}
        <div className="w-full aspect-square bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center overflow-hidden">
          {hasImage ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Package className="w-12 h-12 stroke-1" />
              <span className="text-xs">No Image Available</span>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

          {product.categoryId?.name && (
            <p className="text-xs text-gray-500 mb-3">
              Category: <span className="font-medium text-gray-700">{product.categoryId.name}</span>
            </p>
          )}

          {avgRating > 0 && (
            <div className="flex items-center gap-1 text-sm text-yellow-600 mb-3">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({totalReviews} review{totalReviews !== 1 ? "s" : ""})</span>
            </div>
          )}

          <p className="text-2xl font-bold text-blue-600 mb-3">
            ${Number(product.price).toFixed(2)}
          </p>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {product.description}
          </p>

          <p className="text-xs font-medium mb-5">
            Status:{" "}
            <span className={isAvailable ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
              {isAvailable ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </p>

          {isAvailable && (
            <div className="flex items-center gap-3 mb-6">
              <label className="text-xs font-semibold text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-gray-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || addingToCart}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded font-medium text-sm disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{addingToCart ? "Adding..." : isAvailable ? "Add to Cart" : "Out of Stock"}</span>
          </button>

          {cartMessage && (
            <p className="text-xs text-green-600 font-medium mt-2">{cartMessage}</p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>

        {user && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
            <h3 className="font-semibold text-sm text-gray-800 mb-3">
              {myReview ? "Edit Your Review" : "Write a Review"}
            </h3>

            {reviewError && (
              <p className="text-xs text-red-500 mb-3">{reviewError}</p>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} Star{n !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingReview}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-medium disabled:opacity-50"
                >
                  {savingReview ? "Saving..." : myReview ? "Update Review" : "Submit Review"}
                </button>

                {myReview && (
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    className="inline-flex items-center gap-1 px-3 py-2 border border-red-300 text-red-600 rounded text-xs font-medium hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-800">
                    {review.userId?.name || "Anonymous"}
                  </span>
                  <div className="flex items-center text-xs text-yellow-600">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{review.rating}/5</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;


