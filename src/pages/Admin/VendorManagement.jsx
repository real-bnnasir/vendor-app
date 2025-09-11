import React, { useEffect, useState } from "react";
import { useAdmin } from "../../contex/AdminContext";
import {
  Search,
  Filter,
  Check,
  X,
  Pause,
  Trash2,
  Eye,
  MoreHorizontal,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Store,
  User,
  Banknote,
  Play,
} from "lucide-react";
import { _get, _post, _put } from "../../utils/Helper";
import toast from "react-hot-toast";

const VendorManagement = () => {
  const { deleteVendor } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [viewingVendor, setViewingVendor] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  const get_customers = () => {
    setLoading(true);
    _get(
      "api/get_all_vendors",
      (response) => {
        if (response.success) {
          setVendors(response.results);
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

  const approveVendor = (id) => {
    updatevendorstatus(id, "approved");
  };

  const rejectVendor = (id) => {
    updatevendorstatus(id, "rejected");
  };

  const suspendVendor = (id) => {
    updatevendorstatus(id, "suspended");
  };

  const reapproveVendor = (id) => {
    updatevendorstatus(id, "approved");
  };

  const updatevendorstatus = (id, status, email) => {
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
          toast.success("vendor status updated");
          get_customers();
        } else {
          toast.error("Error updating vendor status");
        }
      },
      (err) => {
        setLoading(false);
        toast.error("An error occurred while updating status");
        console.error(err);
      }
    );
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.type_of_bussiness
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || vendor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      case "suspended":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "rejected":
      case "suspended":
        return <AlertCircle size={14} />;
      default:
        return null;
    }
  };

  const handleSelectVendor = (vendorId) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSelectAll = () => {
    setSelectedVendors((prev) =>
      prev.length === filteredVendors.length
        ? []
        : filteredVendors.map((vendor) => vendor.id)
    );
  };

  const handleBulkAction = (action) => {
    selectedVendors.forEach((vendorId) => {
      switch (action) {
        case "approve":
          approveVendor(vendorId);
          break;
        case "reject":
          rejectVendor(vendorId);
          break;
        case "suspend":
          suspendVendor(vendorId);
          break;
        case "reapprove":
          reapprove(vendorId);
          break;
        default:
          break;
      }
    });
    setSelectedVendors([]);
  };

  const handleDeleteVendor = (vendorId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this vendor? This action cannot be undone."
      )
    ) {
      deleteVendor(vendorId);
    }
  };

  const handleViewVendor = (vendor) => {
    setViewingVendor(vendor);
  };

  const closeModal = () => {
    setViewingVendor(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Vendor Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and approve vendor applications.
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
              placeholder="Search vendors..."
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedVendors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-800">
              {selectedVendors.length} vendor
              {selectedVendors.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleBulkAction("approve")}
                className="text-sm text-green-700 hover:text-green-800 font-medium"
              >
                Approve All
              </button>
              <button
                onClick={() => handleBulkAction("reject")}
                className="text-sm text-red-700 hover:text-red-800 font-medium"
              >
                Reject All
              </button>
              <button
                onClick={() => handleBulkAction("suspend")}
                className="text-sm text-gray-700 hover:text-gray-800 font-medium"
              >
                Suspend All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vendors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto min-w-full">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedVendors.length === filteredVendors.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
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
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor.id)}
                      onChange={() => handleSelectVendor(vendor.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={vendor.avatar || "/avatar.png"}
                        alt={vendor.firstname}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vendor.firstname} {vendor.lastname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vendor.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {vendor.type_of_bussiness}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {vendor.shopcontact}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {vendor.storesCount || 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      &#8358;{vendor.totalRevenue?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        vendor.status
                      )}`}
                    >
                      {getStatusIcon(vendor.status) && (
                        <span className="mr-1">
                          {getStatusIcon(vendor.status)}
                        </span>
                      )}
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(vendor.createdAt)?.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {vendor.status === "pending" && (
                        <>
                          <button
                            onClick={() => approveVendor(vendor.id)}
                            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                          >
                            <Check size={12} className="mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => rejectVendor(vendor.id)}
                            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                          >
                            <X size={12} className="mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                      {vendor.status === "approved" && (
                        <button
                          onClick={() => suspendVendor(vendor.id)}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <Pause size={12} className="mr-1" />
                          Suspend
                        </button>
                      )}

                      {vendor.status === "suspended" && (
                        <button
                          onClick={() => reapproveVendor(vendor.id)}
                          className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <Play size={12} className="mr-1" />
                          Re-Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleViewVendor(vendor)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteVendor(vendor.id)}
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

      {/* Vendor Details Modal */}
      {viewingVendor && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Vendor Details
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
                  src={viewingVendor.avatar}
                  alt={viewingVendor.firstname}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {viewingVendor.firstname + " " + viewingVendor.lastname}
                  </h3>
                  <p className="text-gray-600">
                    {viewingVendor.type_of_bussiness}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-2 ${getStatusColor(
                      viewingVendor.status
                    )}`}
                  >
                    {getStatusIcon(viewingVendor.status) && (
                      <span className="mr-1">
                        {getStatusIcon(viewingVendor.status)}
                      </span>
                    )}
                    {viewingVendor.status}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {viewingVendor.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {viewingVendor.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Business Stats */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Business Statistics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Store size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {viewingVendor.storesCount || 1}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Stores</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Banknote size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-900">
                        &#8358;{viewingVendor.totalRevenue?.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(viewingVendor.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Join Date</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Submitted Documents
                </h4>
                <div className="space-y-2">
                  {viewingVendor.documents?.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{doc}</span>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {viewingVendor.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        approveVendor(viewingVendor.id);
                        closeModal();
                      }}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check size={16} className="mr-2" />
                      Approve Vendor
                    </button>
                    <button
                      onClick={() => {
                        rejectVendor(viewingVendor.id);
                        closeModal();
                      }}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X size={16} className="mr-2" />
                      Reject Vendor
                    </button>
                  </>
                )}
                {viewingVendor.status === "approved" && (
                  <button
                    onClick={() => {
                      suspendVendor(viewingVendor.id);
                      closeModal();
                    }}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Pause size={16} className="mr-2" />
                    Suspend Vendor
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredVendors.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <UserCheck size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No vendors found
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Vendor applications will appear here when submitted."}
          </p>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;
