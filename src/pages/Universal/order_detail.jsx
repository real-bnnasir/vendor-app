import {
  CheckCircle,
  DollarSign,
  Mail,
  MapPin,
  Package,
  Truck,
  User,
  X,
  Store,
  Clock,
  AlertCircle,
  Phone,
} from "lucide-react";
import React from "react";

const Order_Detail = ({
  viewingOrder,
  getStatusColor,
  getStatusIcon,
  handleAssignDelivery,
  handleStatusUpdate,
  closeModal,
  setViewingOrder,
}) => {
  // Group items by vendor to show vendor-specific status
  const itemsByVendor = {};
  viewingOrder?.items?.forEach((item) => {
    if (!itemsByVendor[item.vendor_id]) {
      itemsByVendor[item.vendor_id] = {
        vendor_id: item.vendor_id,
        vendor_name: item.vendor_name || `Vendor ${item.vendor_id}`,
        items: [],
        allConfirmed: true,
        anyRejected: false,
      };
    }

    itemsByVendor[item.vendor_id].items.push(item);

    // Check if all items from this vendor are confirmed
    if (item.status !== "confirmed") {
      itemsByVendor[item.vendor_id].allConfirmed = false;
    }

    // Check if any items from this vendor are rejected
    if (item.status === "rejected") {
      itemsByVendor[item.vendor_id].anyRejected = true;
    }
  });

  const vendorGroups = Object.values(itemsByVendor);

  return (
    <div>
      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Details - {viewingOrder.order_id}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    viewingOrder.status
                  )}`}
                >
                  {getStatusIcon(viewingOrder.status)}
                  <span className="ml-2 capitalize">{viewingOrder.status}</span>
                </span>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(viewingOrder.order_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Customer Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={24} className="text-blue-600" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <User size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {viewingOrder.first_name} {viewingOrder.last_name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {viewingOrder.email}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start space-x-2">
                          <MapPin size={16} className="text-gray-400 mt-0.5" />
                          <span className="text-sm text-gray-600">
                            {viewingOrder.address}, {viewingOrder.city},{" "}
                            {viewingOrder.state} {viewingOrder.zip_code}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Phone   size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {viewingOrder.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendor Confirmation Status */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Vendor Confirmation Status
                </h4>
                <div className="space-y-4">
                  {vendorGroups.map((vendor, vendorIndex) => (
                    <div
                      key={vendor.vendor_id}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Store size={16} className="text-gray-500 mr-2" />
                          <span className="font-medium">
                            {vendor.vendor_name}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            vendor.anyRejected
                              ? "bg-red-100 text-red-800"
                              : vendor.allConfirmed
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {vendor.anyRejected
                            ? "Rejected Items"
                            : vendor.allConfirmed
                            ? "All Confirmed"
                            : "Pending Confirmation"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {vendor.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center">
                              <img
                                src={item.product_image}
                                className="w-10 h-10 rounded object-cover mr-3"
                                alt={item.product_name}
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {item.product_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {item.status === "confirmed" ? (
                                <CheckCircle size={12} className="mr-1" />
                              ) : item.status === "rejected" ? (
                                <X size={12} className="mr-1" />
                              ) : (
                                <Clock size={12} className="mr-1" />
                              )}
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Order Summary
                </h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Vendor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {viewingOrder.items?.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <img
                                src={product.product_image}
                                className="w-10 h-10 rounded object-cover mr-3"
                                alt={product.product_name}
                              />
                              <span className="text-sm text-gray-900">
                                {product.product_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {product.vendor_name ||
                              `Vendor ${product.vendor_id}`}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {product.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">
                            ₦{parseFloat(product.unit_price).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : product.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {product.status === "confirmed" ? (
                                <CheckCircle size={12} className="mr-1" />
                              ) : product.status === "rejected" ? (
                                <X size={12} className="mr-1" />
                              ) : (
                                <Clock size={12} className="mr-1" />
                              )}
                              {product.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-3 text-sm font-medium text-gray-900 text-right"
                        >
                          Total:
                        </td>
                        <td
                          className="px-4 py-3 text-sm font-bold text-gray-900 text-right"
                          colSpan="2"
                        >
                          ₦
                          {parseFloat(
                            viewingOrder.total_amount || viewingOrder.subtotal
                          ).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Payment Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Payment Method: {viewingOrder.payment_method || "Card"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-sm text-gray-600">
                        Payment Status: Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {viewingOrder.status === "confirmed" && (
                  <button
                    onClick={() => {
                      setViewingOrder(null);
                      handleAssignDelivery(viewingOrder);
                    }}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Truck size={16} className="mr-2" />
                    Assign for Delivery
                  </button>
                )}
                {viewingOrder.status === "shipped" && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(viewingOrder.order_id, "delivered");
                      closeModal();
                    }}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Package size={16} className="mr-2" />
                    Mark as Delivered
                  </button>
                )}
                {viewingOrder.status === "pending" && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(viewingOrder.order_id, "cancelled");
                      closeModal();
                    }}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X size={16} className="mr-2" />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order_Detail;
