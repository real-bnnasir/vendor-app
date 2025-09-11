import { CheckCircle, DollarSign, Mail, MapPin, Package, Truck, User, X } from 'lucide-react';
import React from 'react'

const Order_Detail = ({
  viewingOrder,
  getStatusColor,
  getStatusIcon,
  handleAssignDelivery,
  handleStatusUpdate,
  closeModal,
  setViewingOrder
}) => {
  return (
    <div>
      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Details - {viewingOrder.id}
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
                    {new Date(viewingOrder.date).toLocaleDateString()}
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
                    <img
                      src={viewingOrder?.image}
                      alt={viewingOrder?.first_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
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
                            {viewingOrder.shippingAddress}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Order Items
                </h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          image
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {viewingOrder.items?.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <img
                              src={product.image}
                              className="rounded w-15 h-15"
                              alt=""
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {product.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">
                            ${product.price}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            ${(product.quantity * product.price).toFixed(2)}
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
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                          ${viewingOrder.total}
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
                        Payment Method: {viewingOrder.paymentMethod}
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
                      handleStatusUpdate(viewingOrder.id, "delivered");
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
                      handleStatusUpdate(viewingOrder.id, "cancelled");
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
}

export default Order_Detail
