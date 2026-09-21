import { useState, useEffect } from "react";
import api from "../../api/axios";
import ProductForm from "./ProductForm";
import { Plus, Pencil, Trash2, Package, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    api
      .get("/products", { params: { limit: 100 } })
      .then((res) => setProducts(res.data.products || res.data))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = (didSave) => {
    setShowForm(false);
    setEditingProduct(null);
    if (didSave) fetchProducts();
  };

  if (showForm) {
    return <ProductForm product={editingProduct} onClose={handleFormClose} />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">All Products</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Total {products.length} product{products.length !== 1 ? "s" : ""} registered in store
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 p-6 max-w-md mx-auto">
          <Package className="w-10 h-10 text-gray-400 mx-auto mb-2 stroke-1" />
          <h3 className="font-semibold text-gray-800 text-base mb-1">No products found</h3>
          <p className="text-sm text-gray-500 mb-4">Get started by adding your first product to the catalog.</p>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Product</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {products.map((p) => (
            <div
              key={p._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 p-1">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                  ) : (
                    <Package className="w-5 h-5 text-gray-300 stroke-1" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{p.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="font-bold text-blue-600 text-sm">${Number(p.price).toFixed(2)}</span>
                    <span>•</span>
                    <span className={`font-medium ${p.stock > 0 ? "text-gray-600" : "text-red-600"}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                <button
                  onClick={() => openEditForm(p)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Pencil className="w-3.5 h-3.5 text-gray-500" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;