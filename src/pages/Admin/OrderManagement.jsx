import React, { useEffect, useState } from "react";
import { useAdmin } from "../../contex/AdminContext";
import { useStore } from "../../contex/StoreContext";
import {
  Search,
  Filter,
  Eye,
  Truck,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import { _get } from "../../utils/Helper";
import { useSelector } from "react-redux";
import Order_Detail from "../Universal/order_detail";

const OrderManagement = () => {
  const { deliveryPersonnel, assignDelivery } = useAdmin();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { updateOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewingOrder, setViewingOrder] = useState(null);
  const [assigningDelivery, setAssigningDelivery] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const vendorId = user?.user_id;
  const storeOrders = orders.filter(
    (order) =>
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = storeOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        _get(`api/get_all_orders`, (resp) => {
          if (resp.success && resp.orders) {
            setOrders(resp.orders);

            // Calculate stats
            const totalOrders = resp.orders.length;
            const totalRevenue = resp.orders.reduce(
              (sum, order) => sum + (order.subtotal || 0),
              0
            );
            const pendingOrders = resp.orders.filter(
              (order) => order.status === "processing"
            ).length;
            const deliveredOrders = resp.orders.filter(
              (order) => order.status === "delivered"
            ).length;

            setStats({
              totalOrders,
              totalRevenue,
              pendingOrders,
              deliveredOrders,
            });
          }
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
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
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
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
      default:
        return <AlertCircle size={14} />;
    }
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
  };

  const handleAssignDelivery = (order) => {
    setAssigningDelivery(order);
  };

  const handleConfirmAssignment = (deliveryPersonId) => {
    if (assigningDelivery) {
      assignDelivery(assigningDelivery.id, deliveryPersonId);
      updateOrderStatus(assigningDelivery.id, "shipped");
      setAssigningDelivery(null);
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const closeModal = () => {
    setViewingOrder(null);
    setAssigningDelivery(null);
  };

  const availableDeliveryPersonnel = deliveryPersonnel?.filter(
    (person) => person.status === "available"
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all orders across the platform and assign deliveries.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700">
              {availableDeliveryPersonnel?.length} drivers available
            </span>
          </div>
        </div>
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
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
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
              {filteredOrders.map((order) => {
                // Find store name from context
                const storeName =
                  order.storeId === "1" ? "Tech Paradise" : "Fashion Hub";

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {order.items?.[0]?.image && (
                          <img
                            className="h-8 w-8 rounded-full"
                            src={order.items[0].image}
                            alt={order.first_name}
                          />
                        )}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {order.first_name} {order.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{storeName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {/* {order.items?.map((item, index) => (
                          <div key={index}>
                            {item.name} (×{item.quantity})
                          </div>
                        ))} */}
                        {order.item_count} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₦{order.subtotal?.toLocaleString() || "0.00"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <span className="mr-1">
                          {getStatusIcon(order.status)}
                        </span>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {order.status === "confirmed" && (
                          <button
                            onClick={() => handleAssignDelivery(order)}
                            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            <Truck size={12} className="mr-1" />
                            Assign Delivery
                          </button>
                        )}
                        {order.status === "shipped" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "delivered")
                            }
                            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                          >
                            <Package size={12} className="mr-1" />
                            Mark Delivered
                          </button>
                        )}
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}

      <Order_Detail
        viewingOrder={viewingOrder}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
        handleAssignDelivery={handleAssignDelivery}
        handleStatusUpdate={handleStatusUpdate}
        closeModal={closeModal}
        setViewingOrder={setViewingOrder}
      />

      {/* Assign Delivery Modal */}
      {assigningDelivery && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Assign Delivery - {assigningDelivery.id}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Order Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Customer:</span>
                    <span className="ml-2 font-medium">
                      {assigningDelivery.customer.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <span className="ml-2 font-medium">
                      ${assigningDelivery.total}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Address:</span>
                    <span className="ml-2">
                      {assigningDelivery.shippingAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Available Delivery Personnel */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Available Delivery Personnel
                </h4>
                {availableDeliveryPersonnel.length > 0 ? (
                  <div className="space-y-3">
                    {availableDeliveryPersonnel.map((person) => (
                      <div
                        key={person.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={person.avatar}
                              alt={person.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {person.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {person.vehicle} • {person.zone}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Rating</p>
                              <p className="text-sm font-medium">
                                ★ {person.rating}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Completed</p>
                              <p className="text-sm font-medium">
                                {person.completedDeliveries}
                              </p>
                            </div>
                            <button
                              onClick={() => handleConfirmAssignment(person.id)}
                              className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <UserPlus size={14} className="mr-1" />
                              Assign
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Truck size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      No delivery personnel available
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      All drivers are currently busy with other deliveries
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Orders from vendors will appear here when customers make purchases."}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
