import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Mock users for demonstration
const mockUsers = [
  {
    id: "1",
    email: "admin@vendorhub.com",
    password: "admin123",
    role: "admin",
    name: "System Administrator",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2",
    permissions: [
      "manage_vendors",
      "manage_customers",
      "manage_banners",
      "view_analytics",
      "system_settings",
    ],
  },
  {
    id: "2",
    email: "vendor@store.com",
    password: "vendor123",
    role: "vendor",
    name: "John Vendor",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2",
    storeIds: ["1", "2"],
    status: "approved",
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => {
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      return { success: true, user: foundUser };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === "admin") return user.permissions?.includes(permission);
    return false;
  };

  const isAdmin = () => user?.role === "admin";
  const isVendor = () => user?.role === "vendor";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        hasPermission,
        isAdmin,
        isVendor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
