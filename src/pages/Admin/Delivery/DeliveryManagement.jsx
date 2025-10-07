import React, { useState } from "react";
import { useAdmin } from "../../../contex/AdminContext";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Truck,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  Package,
  Clock,
  X,
  UserPlus,
  CheckCircle,
} from "lucide-react";

const DeliveryManagement = () => {
  const navigate = useNavigate();
  const {
    deliveryPersonnel,
    addDeliveryPerson,
    updateDeliveryPerson,
    deleteDeliveryPerson,
  } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [viewingPerson, setViewingPerson] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    zone: "",
    status: "available",
  });

  const filteredPersonnel = deliveryPersonnel?.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || person.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border border-green-200";
      case "busy":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "offline":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <User size={14} />;
      case "busy":
        return <Truck size={14} />;
      case "offline":
        return <Clock size={14} />;
      default:
        return <User size={14} />;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPerson) {
      updateDeliveryPerson(editingPerson.id, formData);
      setEditingPerson(null);
    } else {
      addDeliveryPerson(formData);
    }
    setFormData({
      name: "",
      email: "",
      phone: "",
      vehicle: "",
      zone: "",
      status: "available",
    });
    setShowAddForm(false);
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      email: person.email,
      phone: person.phone,
      vehicle: person.vehicle,
      zone: person.zone,
      status: person.status,
    });
    setShowAddForm(true);
  };

  const handleDelete = (personId) => {
    if (
      window.confirm("Are you sure you want to delete this delivery person?")
    ) {
      deleteDeliveryPerson(personId);
    }
  };

  const handleView = (person) => {
    setViewingPerson(person);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingPerson(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      vehicle: "",
      zone: "",
      status: "available",
    });
  };

  const closeModal = () => {
    setViewingPerson(null);
  };

  const vehicles = ["Motorcycle", "Car", "Van", "Truck", "Bicycle"];
  const zones = [
    "Downtown",
    "Uptown",
    "Suburbs",
    "East Side",
    "West Side",
    "North District",
    "South District",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Delivery Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage delivery personnel and assign orders.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => navigate("/admin/delivery/add")}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Add New Person
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={16} className="mr-2" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingPerson ? "Edit Delivery Person" : "Add New Delivery Person"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type *
                </label>
                <select
                  name="vehicle"
                  required
                  value={formData.vehicle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle} value={vehicle}>
                      {vehicle}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Zone *
                </label>
                <select
                  name="zone"
                  required
                  value={formData.zone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select zone</option>
                  {zones.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {editingPerson ? "Update Person" : "Add Person"}
              </button>
            </div>
          </form>
        </div>
      )}

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
              placeholder="Search delivery personnel..."
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
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Personnel Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPersonnel?.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={person.avatar}
                        alt={person.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {person.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {person.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{person.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {person.vehicle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{person.zone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {person.activeOrders}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {person.completedDeliveries}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {person.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        person.status
                      )}`}
                    >
                      <span className="mr-1">
                        {getStatusIcon(person.status)}
                      </span>
                      {person.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleView(person)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(person)}
                        className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
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

      {/* Delivery Person Details Modal */}
      {viewingPerson && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Delivery Person Details
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
                  src={viewingPerson.avatar}
                  alt={viewingPerson.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {viewingPerson.name}
                  </h3>
                  <p className="text-gray-600">
                    {viewingPerson.vehicle} Driver • {viewingPerson.zone}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-2 ${getStatusColor(
                      viewingPerson.status
                    )}`}
                  >
                    {getStatusIcon(viewingPerson.status) && (
                      <span className="mr-1">
                        {getStatusIcon(viewingPerson.status)}
                      </span>
                    )}
                    {viewingPerson.status}
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
                      {viewingPerson.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {viewingPerson.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Performance Statistics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Package size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {viewingPerson.activeOrders}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Active Orders</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {viewingPerson.completedDeliveries}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Completed</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Star size={16} className="text-yellow-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {viewingPerson.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Rating</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleEdit(viewingPerson);
                    closeModal();
                  }}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 size={16} className="mr-2" />
                  Edit Details
                </button>
                <button
                  onClick={() => {
                    updateDeliveryPerson(viewingPerson.id, {
                      status:
                        viewingPerson.status === "available"
                          ? "offline"
                          : "available",
                    });
                    closeModal();
                  }}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {viewingPerson.status === "available"
                    ? "Set Offline"
                    : "Set Available"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPersonnel?.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Truck size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No delivery personnel found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first delivery person."}
          </p>
          {!searchTerm && filterStatus === "all" && (
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => navigate("/admin/delivery/add")}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Add First Delivery Person
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus size={16} className="mr-2" />
                Quick Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement;
