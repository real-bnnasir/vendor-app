import React, { useState } from "react";
import { useAdmin } from "../../contex/AdminContext";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  DollarSign,
  ShoppingCart,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

const Analytics = () => {
  const { getAnalytics, vendors, customers, banners } = useAdmin();
  const [timeRange, setTimeRange] = useState("30d");
  const analytics = getAnalytics();

  // Mock analytics data - in real app, this would come from API
  const chartData = {
    revenue: [
      { month: "Jan", amount: 45000 },
      { month: "Feb", amount: 52000 },
      { month: "Mar", amount: 48000 },
      { month: "Apr", amount: 61000 },
      { month: "May", amount: 55000 },
      { month: "Jun", amount: 67000 },
    ],
    users: [
      { month: "Jan", vendors: 12, customers: 450 },
      { month: "Feb", vendors: 15, customers: 520 },
      { month: "Mar", vendors: 18, customers: 580 },
      { month: "Apr", vendors: 22, customers: 650 },
      { month: "May", vendors: 25, customers: 720 },
      { month: "Jun", vendors: 28, customers: 800 },
    ],
  };

  const stats = [
    {
      name: "Total Revenue",
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      description: "vs last month",
    },
    {
      name: "Active Vendors",
      value: analytics.approvedVendors.toString(),
      change: "+8.2%",
      changeType: "positive",
      icon: UserCheck,
      description: "vs last month",
    },
    {
      name: "Total Customers",
      value: analytics.totalCustomers.toString(),
      change: "+15.3%",
      changeType: "positive",
      icon: Users,
      description: "vs last month",
    },
    {
      name: "Platform Growth",
      value: "94.2%",
      change: "+2.1%",
      changeType: "positive",
      icon: TrendingUp,
      description: "user retention",
    },
  ];

  const topVendors = vendors
    .filter((v) => v.status === "approved")
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  const recentActivity = [
    {
      type: "vendor_approved",
      message: 'New vendor "Tech Paradise" approved',
      time: "2 hours ago",
    },
    {
      type: "customer_registered",
      message: "15 new customers registered",
      time: "4 hours ago",
    },
    {
      type: "banner_activated",
      message: "Summer Sale banner activated",
      time: "6 hours ago",
    },
    {
      type: "vendor_pending",
      message: "3 vendors pending approval",
      time: "8 hours ago",
    },
    {
      type: "revenue_milestone",
      message: "Monthly revenue target reached",
      time: "1 day ago",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor platform performance and key metrics.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} className="mr-2" />
            Export Report
          </button>
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
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <Icon size={24} className="text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={`text-sm font-medium flex items-center ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.changeType === "positive" ? (
                    <TrendingUp size={16} className="mr-1" />
                  ) : (
                    <TrendingDown size={16} className="mr-1" />
                  )}
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  {stat.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Revenue Trend
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Monthly Revenue</span>
            </div>
          </div>
          <div className="space-y-4">
            {chartData.revenue.map((item, index) => (
              <div
                key={item.month}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-600 w-12">
                  {item.month}
                </span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(item.amount / 70000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                  ${(item.amount / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">User Growth</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Vendors</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Customers</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {chartData.users.map((item, index) => (
              <div key={item.month} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    {item.month}
                  </span>
                  <div className="flex space-x-4">
                    <span className="text-sm text-blue-600">
                      {item.vendors} vendors
                    </span>
                    <span className="text-sm text-green-600">
                      {item.customers} customers
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(item.vendors / 30) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(item.customers / 1000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Performing Vendors
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topVendors.map((vendor, index) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-red-600">
                        #{index + 1}
                      </span>
                    </div>
                    <img
                      src={vendor.avatar}
                      alt={vendor.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {vendor.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {vendor.businessName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${vendor.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {vendor.storesCount} stores
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
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

export default Analytics;
