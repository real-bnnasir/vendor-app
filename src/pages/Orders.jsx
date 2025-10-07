import React, { useEffect, useState } from "react";
import { useStore } from "../contex/StoreContext";
import {
  Search,
  Filter,
  Download,
  Eye,
  Check,
  X,
  Truck,
  Package,
  Clock,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  RefreshCw,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { _get, _put } from "../utils/Helper";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Orders = () => {
  const { currentStore, updateOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
  });

  const vendorId = user?.user_id;

  if (!currentStore) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Store Selected
          </h3>
          <p className="text-gray-600 mb-6">
            Please select a store from the sidebar to manage orders.
          </p>
        </div>
      </div>
    );
  }

  const storeOrders = orders.filter(
    (order) =>
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOrderStatus = (order) => {
    if (!order.items || order.items.length === 0) {
      return order.status || "pending";
    }

    // If all items have the same status, return that status
    const statuses = order.items.map((item) => item.status);
    const uniqueStatuses = [...new Set(statuses)];

    if (uniqueStatuses.length === 1) {
      return uniqueStatuses[0];
    }

    // If items have different statuses, determine the overall status
    if (statuses.includes("cancelled")) {
      return "partially_cancelled";
    }
    if (statuses.includes("delivered")) {
      return "partially_delivered";
    }
    if (statuses.includes("shipped")) {
      return "partially_shipped";
    }
    if (statuses.includes("confirmed")) {
      return "partially_confirmed";
    }

    // Default to processing if mixed pending/processing
    return "processing";
  };

  const filteredOrders = storeOrders.filter((order) => {
    const orderStatus = getOrderStatus(order);
    const matchesSearch =
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      orderStatus === filterStatus ||
      order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        _get(`api/get_vendor_orders/${vendorId}`, (resp) => {
          if (resp.success && resp.orders) {
            setOrders(resp.orders);

            // Calculate stats
            const totalOrders = resp.orders.length;
            const totalRevenue = resp.orders.reduce(
              (sum, order) => sum + (order.subtotal || 0),
              0
            );
            const pendingOrders = resp.orders.filter((order) => {
              const orderStatus = getOrderStatus(order);
              return (
                orderStatus === "processing" ||
                orderStatus === "pending" ||
                order.status === "processing"
              );
            }).length;
            const deliveredOrders = resp.orders.filter(
              (order) => order.status === "delivered"
            ).length;

            const averageOrderValue =
              totalOrders > 0 ? totalRevenue / totalOrders : 0;
            const revenueGrowth = 12.5; // This would come from comparing with previous period

            setStats({
              totalOrders,
              totalRevenue,
              pendingOrders,
              deliveredOrders,
              averageOrderValue,
              revenueGrowth,
            });
          }
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchOrders();
    }
  }, [vendorId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      case "verified":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
      case "partially_delivered":
        return "bg-green-50 text-green-700 border border-green-200";
      case "partially_cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      case "partially_shipped":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "partially_confirmed":
        return "bg-blue-50 text-blue-700 border border-blue-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
      case "pending":
        return <Clock size={14} />;
      case "confirmed":
        return <CheckCircle size={14} />;
      case "shipped":
        return <Truck size={14} />;
      case "delivered":
        return <Package size={14} />;
      case "cancelled":
        return <X size={14} />;
      case "verified":
        return <CheckCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  // Function to get the overall order status based on items

  // const handleStatusUpdate = (orderId, newStatus) => {
  //   updateOrderStatus(orderId, newStatus);
  //   // Update local state to reflect the change immediately
  //   setOrders(
  //     orders.map((order) =>
  //       order.id === orderId ? { ...order, status: newStatus } : order
  //     )
  //   );
  // };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    setSelectedOrders((prev) =>
      prev.length === filteredOrders.length
        ? []
        : filteredOrders.map((order) => order.id)
    );
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      setLoading(true);
      await Promise.all(
        selectedOrders.map((orderId) =>
          _put(
            `api/update_order_status/${vendorId}`,
            {
              order_id: orderId,
              vendor_id: vendorId,
              status,
            },
            (resp) => {
              if (!resp.success) throw new Error(resp.message);
            }
          )
        )
      );
      fetchOrders(true);
      toast.success(`Orders updated to ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("Bulk update failed");
    } finally {
      setSelectedOrders([]);
      setLoading(false);
    }
  };

  // const handleStatusUpdate = async (orderId, newStatus) => {
  //   try {
  //     setLoading(true);
  //     _put(
  //       `api/update_order_status`,
  //       { order_id: orderId, status: newStatus, vendor_id: vendorId },
  //       (resp) => {
  //         if (resp.success) {
  //           setOrders((prev) =>
  //             prev.map((order) =>
  //               order.id === orderId ? { ...order, status: newStatus } : order
  //             )
  //           );
  //         } else {
  //           console.error(resp.message);
  //         }
  //       }
  //     );
  //   } catch (err) {
  //     console.error("Failed to update order:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setLoading(true);
      _put(
        `api/update_order_status/${vendorId}`,
        {
          order_id: orderId,
          vendor_id: vendorId,
          status: newStatus,
        },
        (resp) => {
          if (resp.success) {
            setOrders((prev) =>
              prev.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
              )
            );
            toast.success(`Order ${newStatus} successfully`);
          } else {
            console.error(resp.message);
            toast.error(resp.message || "Failed to update order");
          }
        }
      );
    } catch (err) {
      console.error("Failed to update order:", err);
      toast.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const calculateStats = (orders) => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.subtotal || 0),
      0
    );
    const pendingOrders = orders.filter((o) =>
      ["processing", "pending"].includes(getOrderStatus(o))
    ).length;
    const deliveredOrders = orders.filter(
      (o) => getOrderStatus(o) === "delivered"
    ).length;

    setStats({
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
      revenueGrowth: 12.5, // TODO: replace with real data
    });
  };

  const fetchOrders = async (showToast = false) => {
    try {
      setLoading(true);
      _get(`api/get_vendor_orders/${vendorId}`, (resp) => {
        if (resp.success && resp.orders) {
          setOrders(resp.orders);
          calculateStats(resp.orders);
          if (showToast) toast.success("Orders refreshed successfully");
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) fetchOrders();
  }, [vendorId]);

  // Order Details Modal Component
  const OrderModal = ({ order, isOpen, onClose }) => {
    if (!isOpen || !order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Order Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{order.order_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(order.order_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium text-green-600">
                      ₦{order.subtotal?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-gray-400" />
                    <span>
                      {order.first_name} {order.last_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-400" />
                    <span>{order.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-400" />
                    <span>{order.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>
                      {order.city}, {order.state}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Order Items
              </h3>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.product_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: ₦{item.price?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusIcon(item.status)}
                        <span className="ml-1">{item.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track orders for {currentStore.name}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <ShoppingCart size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight size={16} className="text-green-500" />
            <span className="text-sm text-green-600 ml-1">
              +12% from last month
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₦{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight size={16} className="text-green-500" />
            <span className="text-sm text-green-600 ml-1">
              +{stats.revenueGrowth}% growth
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Orders
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.pendingOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">Requires attention</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avg Order Value
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₦{stats.averageOrderValue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ArrowUpRight size={16} className="text-green-500" />
            <span className="text-sm text-green-600 ml-1">+8% increase</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-colors"
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Check size={16} className="text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-800">
                {selectedOrders.length} order
                {selectedOrders.length !== 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleBulkStatusUpdate("confirmed")}
                className="px-3 py-1.5 text-sm text-blue-700 hover:text-blue-800 font-medium bg-white rounded-lg hover:bg-blue-50 transition-colors"
              >
                Mark as Confirmed
              </button>
              <button
                onClick={() => handleBulkStatusUpdate("shipped")}
                className="px-3 py-1.5 text-sm text-blue-700 hover:text-blue-800 font-medium bg-white rounded-lg hover:bg-blue-50 transition-colors"
              >
                Mark as Shipped
              </button>
              <button
                onClick={() => handleBulkStatusUpdate("cancelled")}
                className="px-3 py-1.5 text-sm text-red-700 hover:text-red-800 font-medium bg-white rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.order_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {order.first_name?.charAt(0)}
                        {order.last_name?.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {order.first_name} {order.last_name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin size={12} className="mr-1" />
                          {order.city}, {order.state}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items?.slice(0, 2).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 mb-1"
                        >
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-6 h-6 rounded object-cover"
                          />
                          <span className="truncate">
                            {item.product_name} (×{item.quantity})
                          </span>
                        </div>
                      ))}
                      {order.items?.length > 2 && (
                        <div className="text-xs text-gray-500 mt-1">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-600">
                      ₦{order.subtotal?.toLocaleString() || "0.00"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const orderStatus = getOrderStatus(order);
                      return (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            orderStatus
                          )}`}
                        >
                          <span className="mr-1">
                            {getStatusIcon(orderStatus)}
                          </span>
                          {orderStatus.replace("_", " ")}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>
                        {new Date(order.order_date).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  {/* {JSON.stringify(order)} */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {(() => {
                        const orderStatus = getOrderStatus(order);
                        const hasAllPending = order.items?.every(
                          (item) =>
                            item.status === "pending" ||
                            item.status === "processing"
                        );
                        const hasAllConfirmed = order.items?.every(
                          (item) => item.status === "confirmed"
                        );
                        const hasAllShipped = order.items?.every(
                          (item) => item.status === "shipped"
                        );

                        if (hasAllPending) {
                          return (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    order.order_id,
                                    "confirmed"
                                  )
                                }
                                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                              >
                                <Check size={12} className="mr-1" />
                                Confirm
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    order.order_id,
                                    "cancelled"
                                  )
                                }
                                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                              >
                                <X size={12} className="mr-1" />
                                Cancel
                              </button>
                            </>
                          );
                        }

                        if (hasAllConfirmed) {
                          return (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order.order_id, "shipped")
                              }
                              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              <Truck size={12} className="mr-1" />
                              Ship
                            </button>
                          );
                        }

                        if (hasAllShipped) {
                          return (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order.order_id, "delivered")
                              }
                              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
                            >
                              <Package size={12} className="mr-1" />
                              Deliver
                            </button>
                          );
                        }

                        return null;
                      })()}

                      <button
                        onClick={() => handleViewOrder(order)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="View Order Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Loading orders...
              </h3>
              <p className="text-gray-600">
                Please wait while we fetch your orders.
              </p>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== "all"
                  ? "No orders match your criteria"
                  : "No orders yet"}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search terms or filter settings to find what you're looking for."
                  : `Orders for ${currentStore.name} will appear here when customers make purchases. Start promoting your products to get your first orders!`}
              </p>
              {(searchTerm || filterStatus !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      <OrderModal
        order={selectedOrder}
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
      />
    </div>
  );
};

export default Orders;
