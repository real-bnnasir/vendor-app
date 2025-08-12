import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../contex/StoreContext";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  MoreHorizontal,
  Store as StoreIcon,
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

const Stores = () => {
  const { stores, currentStore, setCurrentStore, deleteStore } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || store.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const handleDeleteStore = (storeId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this store? This action cannot be undone and will remove all associated products and orders."
      )
    ) {
      deleteStore(storeId);
    }
  };

  const handleSetCurrentStore = (store) => {
    setCurrentStore(store);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Stores</h1>
          <p className="text-gray-600 mt-1">
            Manage your stores and switch between them.
          </p>
        </div>
        <Link
          to="/stores/add"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Store
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden hover:shadow-md transition-all ${
              currentStore?.id === store.id
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200"
            }`}
          >
            <div className="relative">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <StoreIcon size={48} className="text-white" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <div className="relative">
                  <button className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                    <MoreHorizontal size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="absolute top-2 left-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    store.status
                  )}`}
                >
                  {store.status}
                </span>
              </div>
              {currentStore?.id === store.id && (
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
                    Current Store
                  </span>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {store.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {store.description}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Package size={14} className="text-blue-600 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {store.stats.totalProducts}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Products</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <ShoppingCart size={14} className="text-green-600 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {store.stats.totalOrders}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <DollarSign size={14} className="text-emerald-600 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      ${store.stats.monthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp size={14} className="text-orange-600 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {store.stats.conversionRate}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Conversion</p>
                </div>
              </div>

              <div className="flex space-x-2">
                {currentStore?.id !== store.id && (
                  <button
                    onClick={() => handleSetCurrentStore(store)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <Eye size={14} className="mr-1" />
                    Switch To
                  </button>
                )}
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                  <Edit3 size={14} className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteStore(store.id)}
                  className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStores.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <StoreIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No stores found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first store."}
          </p>
          {!searchTerm && filterStatus === "all" && (
            <Link
              to="/stores/add"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Create Your First Store
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Stores;
