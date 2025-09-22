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
} from "lucide-react";
import { _get } from "../utils/Helper";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalOrders: 0,
  });
  const { currentStore, products, orders } = useStore();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const fetchDashboardData = async () => {
    const vendorId = user?.user_id || userDetails?.user_id;
    if (!vendorId) {
      console.warn("⚠️ No vendor ID found");
      return;
    }

    setLoading(true);
    try {
      // Fetch products
      const productResponse = await new Promise((resolve, reject) => {
        _get(
          `api/get-products?shop_id="${vendorId}"`,
          (response) => resolve(response),
          (error) => reject(error)
        );
      });

      // Fetch orders
      const ordersResponse = await new Promise((resolve, reject) => {
        _get(
          `api/get_vendor_orders/${vendorId}`,
          (response) => resolve(response),
          (error) => reject(error)
        );
      });

      console.log("📦 Product response:", productResponse);
      console.log("📦 Orders response:", ordersResponse);

      // ✅ Flatten products (because it's an array of arrays)
      const products = productResponse?.result
        ? productResponse.result.flat()
        : [];
      // ✅ Orders are inside "orders"
      const orders = ordersResponse?.orders || [];

      // ✅ Only count "pending" orders
      const pendingOrdersCount = orders.filter(
        (o) => o.status === "processing"
      ).length;

      setAnalytics({
        totalProducts: products.length,
        totalOrders: pendingOrdersCount,
      });
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userDetails.user_id]);

  if (!currentStore) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Store Selected
          </h3>
          <p className="text-gray-600 mb-6">
            Please select a store from the sidebar or create a new one to get
            started.
          </p>
          <Link
            to="/stores/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Create Your First Store
          </Link>
        </div>
      </div>
    );
  }

  const storeProducts = products.filter(
    (product) => product.storeId === currentStore.id
  );
  const storeOrders = orders.filter(
    (order) => order.storeId === currentStore.id
  );
  const pendingOrders = storeOrders.filter(
    (order) => order.status === "pending"
  );

  const stats = [
    {
      name: "Total Products",
      value: analytics.totalProducts,
      change: "+12%",
      changeType: "positive",
      icon: Package,
    },
    {
      name: "Pending Orders",
      value: analytics.totalOrders,
      change: `+${analytics.totalOrders}`,
      changeType: "neutral",
      icon: ShoppingCart,
    },
    {
      name: "Monthly Revenue",
      value: `$${currentStore.stats.monthlyRevenue.toLocaleString()}`,
      change: "+18%",
      changeType: "positive",
      icon: DollarSign,
    },
    {
      name: "Conversion Rate",
      value: `${currentStore.stats.conversionRate}%`,
      change: "+0.5%",
      changeType: "positive",
      icon: TrendingUp,
    },
  ];

  const recentOrders = storeOrders.slice(0, 4).map((order) => ({
    id: order.id,
    customer: order.customer.name,
    product: order.products[0]?.name || "Multiple items",
    amount: `$${order.total}`,
    status: order.status,
    date: new Date(order.date).toLocaleDateString(),
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertCircle size={14} />;
      case "delivered":
        return <CheckCircle size={14} />;
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
            Welcome back! Here's what's happening with {currentStore.name}.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
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
      {JSON.stringify(analytics)}

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
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
