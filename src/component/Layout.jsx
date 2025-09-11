import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contex/AuthContext";
import { useStore } from "../contex/StoreContext";
import logo from "../assets/images/KASUWAMALL_LOGO.png";
import {
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  Store,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/action/authAction";
import toast from "react-hot-toast";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const location = useLocation();
  // const { user, logout } = useAuth();
  const { stores, currentStore, setCurrentStore } = useStore();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Stores", href: "/stores", icon: Store },
    { name: "Products", href: "/products", icon: Package },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
  ];

  const isActive = (href) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
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
        className={`fixed inset-y-0 left-0 z-50 h-screen w-64 border-gray-200 border-r bg-red-950 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="px-10">
              <img src={logo} className="w-100 h-16" alt="" />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Store Selector */}
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="relative">
              <button
                onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                className="w-full flex items-center justify-between p-3 bg-red-800 rounded-lg hover:bg-red-900 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {currentStore?.logo ? (
                    <img
                      src={currentStore.logo}
                      alt={currentStore.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Store size={16} className="text-blue-600" />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-100">
                      {currentStore?.name || "Select Store"}
                    </p>
                    <p className="text-xs text-gray-400">Current store</p>
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${
                    storeDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Store Dropdown */}
              {storeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-red-800 border border-red-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <Link
                      to="/stores/add"
                      className="flex items-center w-full px-3 py-2 text-sm text-red-100 hover:bg-red-950 rounded-md"
                      onClick={() => {
                        setStoreDropdownOpen(false);
                        setSidebarOpen(false);
                      }}
                    >
                      <Store size={16} className="mr-2" />
                      Add New Store
                    </Link>
                  </div>
                  <div className="border-t border-gray-100">
                    {stores.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => {
                          setCurrentStore(store);
                          setStoreDropdownOpen(false);
                        }}
                        className={`flex items-center w-full px-4 py-3 text-sm hover:bg-red-900 ${
                          currentStore?.id === store.id
                            ? "bg-red-950 text-red-100"
                            : "text-red-200"
                        }`}
                      >
                        {store.logo ? (
                          <img
                            src={store.logo}
                            alt={store.name}
                            className="w-6 h-6 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <Store size={12} className="text-gray-500" />
                          </div>
                        )}
                        <div className="text-left">
                          <p className="font-medium">{store.name}</p>
                          <p className="text-xs text-gray-500">
                            {store.stats.totalProducts} products
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <button className="flex items-center w-full px-3 py-2 text-sm text-red-200 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Settings size={16} className="mr-3" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-red-200  hover:bg-red-800 rounded-lg"
              >
                <LogOut size={16} className="mr-3" />
                Sign out
              </button>
            </div>
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
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-900">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
