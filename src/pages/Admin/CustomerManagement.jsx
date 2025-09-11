import React, { useEffect, useState } from "react";
import { useAdmin } from "../../contex/AdminContext";
import {
  Search,
  Filter,
  Pause,
  Play,
  Trash2,
  Eye,
  MoreHorizontal,
  Users,
  AlertCircle,
  CheckCircle,
  Download,
  Mail,
  Phone,
  X,
  MapPin,
  ShoppingCart,
  DollarSign,
  Calendar,
  Banknote,
} from "lucide-react";
import { _get, _put } from "../../utils/Helper";

const CustomerManagement = () => {
  const { deleteCustomer } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const get_customers = () => {
    setLoading(true);
    _get(
      "api/get_all_cutomers",
      (response) => {
        if (response.success) {
          setCustomers(response.results);
          setLoading(false);
        } else {
          alert("Error on getting users");
          setLoading(false);
        }
      },
      (error) => {
        alert("Error on getting users");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    get_customers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border border-green-200";
      case "suspended":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle size={14} />;
      case "suspended":
        return <AlertCircle size={14} />;
      default:
        return null;
    }
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCustomers((prev) =>
      prev.length === filteredCustomers.length
        ? []
        : filteredCustomers.map((customer) => customer.id)
    );
  };

  const handleBulkAction = (action) => {
    selectedCustomers.forEach((customerId) => {
      switch (action) {
        case "suspend":
          suspendCustomer(customerId);
          break;
        case "activate":
          activateCustomer(customerId);
          break;
        default:
          break;
      }
    });
    setSelectedCustomers([]);
  };

  const handleDeleteCustomer = (customerId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this customer? This action cannot be undone."
      )
    ) {
      deleteCustomer(customerId);
    }
  };

  const suspendCustomer = (id) => {
    updatecustomerstatus(id, "suspended");
  };

  const activateCustomer = (id) => {
    updatecustomerstatus(id, "active");
  };

  const updatecustomerstatus = (id, status, email) => {
    const obj = {
      id,
      status,
      email,
    };

    setLoading(true);

    _put(
      "api/updateusersstatus",
      obj,
      (res) => {
        setLoading(false);
        if (res.success) {
          toast.success("Customer status updated");
          get_customers();
        } else {
          toast.error("Error updating Customer status");
        }
      },
      (err) => {
        setLoading(false);
        toast.error("An error occurred while updating status");
        console.error(err);
      }
    );
  };

  const handleViewCustomer = (customer) => {
    setViewingCustomer(customer);
  };

  const closeModal = () => {
    setViewingCustomer(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Customer Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor customer accounts.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} className="mr-2" />
            Export
          </button>
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
              placeholder="Search customers..."
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
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-800">
              {selectedCustomers.length} customer
              {selectedCustomers.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleBulkAction("activate")}
                className="text-sm text-green-700 hover:text-green-800 font-medium"
              >
                Activate All
              </button>
              <button
                onClick={() => handleBulkAction("suspend")}
                className="text-sm text-red-700 hover:text-red-800 font-medium"
              >
                Suspend All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto min-w-full">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedCustomers.length === filteredCustomers.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={customer.avatar}
                        alt={customer.firstname}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.firstname} {customer.lastname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Phone size={14} className="mr-2 text-gray-400" />
                      {customer.phone}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {customer.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {customer.totalOrders || 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      &#8358; {customer.totalSpent?.toLocaleString() || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        customer.status
                      )}`}
                    >
                      {getStatusIcon(customer.status) && (
                        <span className="mr-1">
                          {getStatusIcon(customer.status)}
                        </span>
                      )}
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.createdAt)?.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {customer.status === "active" ? (
                        <button
                          onClick={() => suspendCustomer(customer.id)}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                        >
                          <Pause size={12} className="mr-1" />
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => activateCustomer(customer.id)}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                        >
                          <Play size={12} className="mr-1" />
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleViewCustomer(customer)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {viewingCustomer && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Customer Details
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="flex items-start space-x-4">
                <img
                  src={viewingCustomer.avatar}
                  alt={viewingCustomer.firstname}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {viewingCustomer.firstname + " " + viewingCustomer.lastname}
                  </h3>
                  <p className="text-gray-600">{viewingCustomer.email}</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-2 ${getStatusColor(
                      viewingCustomer.status
                    )}`}
                  >
                    {getStatusIcon(viewingCustomer.status) && (
                      <span className="mr-1">
                        {getStatusIcon(viewingCustomer.status)}
                      </span>
                    )}
                    {viewingCustomer.status}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {viewingCustomer.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {viewingCustomer.phone}
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      {viewingCustomer.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Purchase Statistics */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Purchase Statistics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {viewingCustomer.totalOrders}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Total Orders</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Banknote size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-900">
                        &#8358; {viewingCustomer.totalSpent?.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Total Spent</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(
                          viewingCustomer.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Join Date</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {viewingCustomer.status === "active" ? (
                  <button
                    onClick={() => {
                      suspendCustomer(viewingCustomer.id);
                      closeModal();
                    }}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Pause size={16} className="mr-2" />
                    Suspend Customer
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      activateCustomer(viewingCustomer.id);
                      closeModal();
                    }}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Play size={16} className="mr-2" />
                    Activate Customer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No customers found
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Customer accounts will appear here when users register."}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
