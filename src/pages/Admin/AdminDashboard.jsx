import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../contex/AdminContext";
import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  Image,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import { _get } from "../../utils/Helper";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { banners } = useAdmin();
  const [analytics, setAnalytics] = useState({
    totalVendors: 0,
    approvedVendors: 0,
    pendingVendors: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    totalRevenue: 0,
  });
  const [recentVendors, setRecentVendors] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch vendors
      const vendorsResponse = await new Promise((resolve, reject) => {
        _get(
          "api/get_all_vendors",
          (response) => resolve(response),
          (error) => reject(error)
        );
      });

      // Fetch customers
      const customersResponse = await new Promise((resolve, reject) => {
        _get(
          "api/get_all_cutomers",
          (response) => resolve(response),
          (error) => reject(error)
        );
      });

      if (vendorsResponse.success && customersResponse.success) {
        const vendors = vendorsResponse.results || [];
        const customers = customersResponse.results || [];

        // Calculate analytics
        const totalVendors = vendors.length;
        const approvedVendors = vendors.filter(
          (v) => v.status === "approved"
        ).length;
        const pendingVendors = vendors.filter(
          (v) => v.status === "pending"
        ).length;

        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(
          (c) => c.status === "active"
        ).length;

        // For revenue, you might need a separate API call depending on your backend
        const totalRevenue = 0; // Placeholder - implement actual revenue calculation

        setAnalytics({
          totalVendors,
          approvedVendors,
          pendingVendors,
          totalCustomers,
          activeCustomers,
          totalRevenue,
        });

        // Get recent vendors and customers
        setRecentVendors(vendors.slice(0, 5));
        setRecentCustomers(customers.slice(0, 5));
      }
    } catch (error) {
      toast.error("Error fetching dashboard data");
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    {
      name: "Total Vendors",
      value: analytics.totalVendors.toString(),
      change: `${analytics.approvedVendors} approved`,
      changeType: "positive",
      icon: UserCheck,
      href: "/admin/vendors",
    },
    {
      name: "Pending Approvals",
      value: analytics.pendingVendors.toString(),
      change: "Needs review",
      changeType: analytics.pendingVendors > 0 ? "warning" : "neutral",
      icon: Clock,
      href: "/admin/vendors?filter=pending",
    },
    {
      name: "Total Customers",
      value: analytics.totalCustomers.toString(),
      change: `${analytics.activeCustomers} active`,
      changeType: "positive",
      icon: Users,
      href: "/admin/customers",
    },
    {
      name: "Platform Revenue",
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      change: "+12% this month",
      changeType: "positive",
      icon: DollarSign,
      href: "/admin/analytics",
    },
  ];

  const activeBanners = banners
    .filter((banner) => banner.status === "active")
    .slice(0, 3);

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
      case "active":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
      case "active":
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your platform and monitor key metrics.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            to="/admin/vendors?filter=pending"
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Clock size={16} className="mr-2" />
            Review Pending ({analytics.pendingVendors})
          </Link>
          <Link
            to="/admin/banners/add"
            className="inline-flex items-center px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition-colors"
          >
            <Image size={16} className="mr-2" />
            Add Banner
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
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
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <Icon size={24} className="text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "warning"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {stat.change}
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-gray-400 group-hover:text-gray-600"
                />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Vendors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Vendors
            </h2>
            <Link
              to="/admin/vendors"
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={vendor.avatar || "/avatar.png"}
                      alt={vendor.firstname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {vendor.firstname} {vendor.lastname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {vendor.type_of_bussiness}
                      </p>
                    </div>
                  </div>
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Customers
            </h2>
            <Link
              to="/admin/customers"
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={customer.avatar || "/avatar.png"}
                      alt={customer.firstname}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {customer.firstname} {customer.lastname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {customer.totalOrders || 0} orders • ₦
                        {customer.totalSpent || 0}
                      </p>
                    </div>
                  </div>
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Banners */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Active Banners
          </h2>
          <Link
            to="/admin/banners"
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Manage all
          </Link>
        </div>
        <div className="p-6">
          {activeBanners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeBanners.map((banner) => (
                <div key={banner.id} className="relative group">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link
                      to={`/admin/banners/edit/${banner.id}`}
                      className="bg-white text-gray-900 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100"
                    >
                      <Eye size={14} className="inline mr-1" />
                      Edit
                    </Link>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900">
                      {banner.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {banner.clickCount} clicks
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Image size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No active banners</p>
              <Link
                to="/admin/banners/add"
                className="inline-flex items-center mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Image size={16} className="mr-2" />
                Create First Banner
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
