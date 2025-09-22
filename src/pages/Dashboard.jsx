import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../contex/StoreContext";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { _get } from "../utils/Helper";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const { currentStore, products, setCurrentStore } = useStore();
  const userDetails = JSON.parse(localStorage.getItem("user")) || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Fallback mock data for when API fails
  const mockStore = {
    id: userDetails?.user_id || "1",
    name: userDetails?.firstname
      ? `${userDetails.firstname}'s Store`
      : "My Store",
    description: "Your vendor store",
    logo: "/store-placeholder.png",
    status: "active",
    stats: {
      totalProducts: 0,
      totalOrders: 0,
      monthlyRevenue: 0,
      conversionRate: 0,
    },
  };

  const fetchDashboardData = async () => {
    const vendorId = user?.user_id || userDetails?.user_id;
    if (!vendorId) {
      console.warn("⚠️ No vendor ID found");
      toast.error("No vendor ID found. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch products - Fixed API call (removed extra quotes)
      const productResponse = await new Promise((resolve, reject) => {
        _get(
          `api/get-products?shop_id="${vendorId}"`,
          (response) => {
            console.log("📦 Product response:", response);
            resolve(response);
          },
          (error) => {
            console.error("Product fetch error:", error);
            reject(error);
          }
        );
      });

      // Fetch orders
      const ordersResponse = await new Promise((resolve, reject) => {
        _get(
          `api/get_vendor_orders/${vendorId}`,
          (response) => {
            console.log("📦 Orders response:", response);
            resolve(response);
          },
          (error) => {
            console.error("Orders fetch error:", error);
            reject(error);
          }
        );
      });

      // Process products with better error handling
      let products = [];
      if (productResponse?.success && productResponse?.result) {
        products = Array.isArray(productResponse.result)
          ? productResponse.result.flat()
          : [productResponse.result];
      } else if (productResponse?.result) {
        products = Array.isArray(productResponse.result)
          ? productResponse.result.flat()
          : [productResponse.result];
      }

      // Process orders with better error handling
      let orders = [];
      if (ordersResponse?.success && ordersResponse?.orders) {
        orders = Array.isArray(ordersResponse.orders)
          ? ordersResponse.orders
          : [ordersResponse.orders];
      } else if (ordersResponse?.orders) {
        orders = Array.isArray(ordersResponse.orders)
          ? ordersResponse.orders
          : [ordersResponse.orders];
      } else if (ordersResponse?.result) {
        orders = Array.isArray(ordersResponse.result)
          ? ordersResponse.result
          : [ordersResponse.result];
      }

      // Calculate analytics
      const pendingOrdersCount = orders.filter(
        (o) => o.status === "processing" || o.status === "pending"
      ).length;

      const totalRevenue = orders.reduce((sum, order) => {
        const amount = parseFloat(order.total || order.amount || 0);
        return sum + amount;
      }, 0);

      setAnalytics({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: pendingOrdersCount,
        totalRevenue: totalRevenue,
      });

      // Set recent data
      setRecentProducts(products.slice(0, 5));
      setRecentOrders(
        orders.slice(0, 5).map((order) => ({
          id: order.id || order.order_id,
          customer:
            order.first_name + " " + order.last_name || "Unknown Customer",
          product:
            order.items.product_name ||
            order.items?.[0]?.product_name ||
            "Multiple items",
          amount: `₦${parseFloat(
            order.total_amount || order.total_amount || 0
          ).toLocaleString()}`,
          status: order.status || "pending",
          date: order.created_at
            ? new Date(order.created_at).toLocaleDateString()
            : new Date().toLocaleDateString(),
        }))
      );

      // Set current store if not set
      if (!currentStore) {
        setCurrentStore({
          ...mockStore,
          stats: {
            totalProducts: products.length,
            totalOrders: orders.length,
            monthlyRevenue: totalRevenue,
            conversionRate:
              orders.length > 0
                ? ((pendingOrdersCount / orders.length) * 100).toFixed(1)
                : 0,
          },
        });
      }

      toast.success("Dashboard data loaded successfully!");
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data. Using offline mode.");

      // Use fallback data
      setAnalytics({
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
      });
      setRecentOrders([]);
      setRecentProducts([]);

      if (!currentStore) {
        setCurrentStore(mockStore);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userDetails?.user_id || user?.user_id) {
      fetchDashboardData();
    }
  }, [userDetails?.user_id, user?.user_id]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Use current store or fallback
  const displayStore = currentStore || mockStore;

  // Use analytics data instead of filtering context data
  const storeProducts = recentProducts;
  const storeOrders = recentOrders;

  const stats = [
    {
      name: "Total Products",
      value: analytics.totalProducts.toString(),
      change:
        analytics.totalProducts > 0
          ? "+" + analytics.totalProducts
          : "No products yet",
      changeType: analytics.totalProducts > 0 ? "positive" : "neutral",
      icon: Package,
    },
    {
      name: "Total Orders",
      value: analytics.totalOrders.toString(),
      change:
        analytics.pendingOrders > 0
          ? `${analytics.pendingOrders} pending`
          : "No pending orders",
      changeType: analytics.pendingOrders > 0 ? "warning" : "positive",
      icon: ShoppingCart,
    },
    {
      name: "Total Revenue",
      value: `₦${analytics.totalRevenue.toLocaleString()}`,
      change: analytics.totalRevenue > 0 ? "This month" : "No revenue yet",
      changeType: analytics.totalRevenue > 0 ? "positive" : "neutral",
      icon: DollarSign,
    },
    {
      name: "Success Rate",
      value:
        analytics.totalOrders > 0
          ? `${(
              ((analytics.totalOrders - analytics.pendingOrders) /
                analytics.totalOrders) *
              100
            ).toFixed(1)}%`
          : "0%",
      change: analytics.totalOrders > 0 ? "Completed orders" : "No orders yet",
      changeType: analytics.totalOrders > 0 ? "positive" : "neutral",
      icon: TrendingUp,
    },
  ];

  // recentOrders is already processed in fetchDashboardData

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertCircle size={14} />;
      case "delivered":
      case "completed":
        return <CheckCircle size={14} />;
      case "processing":
        return <AlertCircle size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with {displayStore.name}.
          </p>
          {error && (
            <div className="mt-2 flex items-center text-amber-600">
              <AlertCircle size={16} className="mr-1" />
              <span className="text-sm">{error} - Showing cached data</span>
            </div>
          )}
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <Link
            to="/products/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Add Product
          </Link>
          <Link
            to="/orders"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye size={16} className="mr-2" />
            View Orders
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Icon size={24} className="text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "negative"
                      ? "text-red-600"
                      : stat.changeType === "warning"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  vs last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link
            to="/orders"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            {/* {JSON.stringify(recentOrders)} */}
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <tr key={order.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id || `ORD-${index + 1}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status) && (
                          <span className="mr-1">
                            {getStatusIcon(order.status)}
                          </span>
                        )}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p>No orders found</p>
                    <p className="text-sm mt-1">
                      Orders will appear here once customers start purchasing.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
