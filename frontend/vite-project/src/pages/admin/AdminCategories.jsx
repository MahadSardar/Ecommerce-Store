import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Tags, Pencil, Trash2, Loader2, FolderTree } from "lucide-react";
import toast from "react-hot-toast";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setSlug("");
    setParentId("");
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = { name, slug, parentId: parentId || null };

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, payload);
        toast.success("Category updated successfully!");
      } else {
        await api.post("/categories", payload);
        toast.success("Category created successfully!");
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to save category";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name || cat._name || "");
    setSlug(cat.slug || "");
    setParentId(cat.parentId || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Category Form */}
      <div className="lg:col-span-5 bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gray-100 text-gray-700 flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-gray-900">
              {editingId ? "Edit Category" : "Add Category"}
            </h2>
          </div>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Reset
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingId) {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                }
              }}
              placeholder="e.g. Electronics"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              URL Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. electronics"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Parent Category (Optional)
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="">None (Top-Level Category)</option>
              {categories
                .filter((c) => c._id !== editingId)
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-1.5 flex-1 bg-blue-600 text-white py-2 rounded-md font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingId ? "Update Category" : "Add Category"}</span>
              )}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Category List */}
      <div className="lg:col-span-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">
            All Categories ({categories.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
            <p className="text-sm text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border border-gray-200 p-6">
            <Tags className="w-8 h-8 text-gray-400 mx-auto mb-2 stroke-1" />
            <p className="text-sm text-gray-500">No categories added yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex items-center justify-between p-3.5 hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    /{cat.slug}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil className="w-3.5 h-3.5 text-gray-500" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50"
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
    </div>
  );
}

export default AdminCategories;