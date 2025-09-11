import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";
import { logout } from "../redux/action/authAction";
import logo from "../assets/images/KASUWAMALL_LOGO.png";
import {
  Menu,
  X,
  Home,
  Users,
  UserCheck,
  Image,
  BarChart3,
  Settings,
  Bell,
  User,
  LogOut,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useDispatch } from "react-redux";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Vendors", href: "/admin/vendors", icon: UserCheck },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Delivery", href: "/admin/delivery", icon: Truck },
    { name: "Banners", href: "/admin/banners", icon: Image },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href) => {
    if (href === "/admin" && location.pathname === "/admin") return true;
    if (href !== "/admin" && location.pathname.startsWith(href)) return true;
    return false;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen  border-r-1 border-gray-200 bg-red-950 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0  ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center justify-center">
              {/* <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-200">Admin Panel</h1> */}
              <div className="px-10">
                <img src={logo} className="w-100 h-16" alt="" />
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-red-50 text-red-900 border-r-2 border-red-700"
                      : "text-red-50 hover:text-red-900 hover:bg-red-50"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4 flex-shrink-0">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={
                  user?.avatar || <User size={16} className="text-blue-600" />
                }
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-100 whitespace-nowrap overflow-hidden text-ellipsis[300px]">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-100 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-100 hover:text-gray-300 hover:bg-red-800 rounded-lg"
            >
              <LogOut size={16} className="mr-3" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top header */}
        <header className="bg-red-950 shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center space-x-4 ml-auto">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar}
                alt={user?.firstname}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-200">
                {user?.username}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
