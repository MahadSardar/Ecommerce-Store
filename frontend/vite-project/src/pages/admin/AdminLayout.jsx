import { Outlet, Link, useLocation } from "react-router-dom";
import { Package, Tags, ShoppingBag } from "lucide-react";

function AdminLayout() {
  const location = useLocation();

  const tabs = [
    { path: "/admin/products", label: "Products", icon: Package },
    { path: "/admin/categories", label: "Categories", icon: Tags },
    { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage catalog products, categories, and customer orders
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = location.pathname.startsWith(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 border-b-2 text-sm font-medium whitespace-nowrap ${
                active
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-gray-400"}`} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Subpage Outlet */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;