import React, { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

// Mock data for admin dashboard
const mockVendors = [
  {
    id: "1",
    name: "John Vendor",
    email: "john@techstore.com",
    phone: "+1 (555) 123-4567",
    status: "approved",
    joinDate: "2024-01-15",
    storesCount: 2,
    totalRevenue: 25680,
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2",
    businessName: "Tech Paradise",
    documents: ["business_license.pdf", "tax_id.pdf"],
  },
  {
    id: "2",
    name: "Sarah Fashion",
    email: "sarah@fashionhub.com",
    phone: "+1 (555) 987-6543",
    status: "pending",
    joinDate: "2024-01-20",
    storesCount: 1,
    totalRevenue: 0,
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2",
    businessName: "Fashion Hub",
    documents: ["business_license.pdf"],
  },
];

const mockCustomers = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 (555) 111-2222",
    joinDate: "2024-01-10",
    totalOrders: 15,
    totalSpent: 1250.99,
    status: "active",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2",
    address: "123 Main St, New York, NY 10001",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1 (555) 333-4444",
    joinDate: "2024-01-12",
    totalOrders: 8,
    totalSpent: 890.5,
    status: "active",
    avatar:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2",
    address: "456 Oak Ave, Los Angeles, CA 90210",
  },
];

const mockBanners = [
  {
    id: "1",
    title: "Summer Sale 2024",
    description: "Up to 50% off on all electronics",
    image:
      "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2",
    status: "active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    position: "hero",
    clickCount: 1250,
    createdAt: "2024-05-15",
  },
  {
    id: "2",
    title: "New Vendor Spotlight",
    description: "Discover amazing products from our newest vendors",
    image:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=2",
    status: "draft",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    position: "sidebar",
    clickCount: 0,
    createdAt: "2024-01-20",
  },
];

export const AdminProvider = ({ children }) => {
  const [vendors, setVendors] = useState(mockVendors);
  const [customers, setCustomers] = useState(mockCustomers);
  const [banners, setBanners] = useState(mockBanners);

  // Vendor Management
  const approveVendor = (vendorId) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === vendorId ? { ...vendor, status: "approved" } : vendor
      )
    );
  };

  const rejectVendor = (vendorId) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === vendorId ? { ...vendor, status: "rejected" } : vendor
      )
    );
  };

  const suspendVendor = (vendorId) => {
    setVendors((prev) =>
      prev.map((vendor) =>
        vendor.id === vendorId ? { ...vendor, status: "suspended" } : vendor
      )
    );
  };

  const deleteVendor = (vendorId) => {
    setVendors((prev) => prev.filter((vendor) => vendor.id !== vendorId));
  };

  // Customer Management
  const suspendCustomer = (customerId) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === customerId
          ? { ...customer, status: "suspended" }
          : customer
      )
    );
  };

  const activateCustomer = (customerId) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === customerId
          ? { ...customer, status: "active" }
          : customer
      )
    );
  };

  const deleteCustomer = (customerId) => {
    setCustomers((prev) =>
      prev.filter((customer) => customer.id !== customerId)
    );
  };

  // Banner Management
  const addBanner = (bannerData) => {
    const newBanner = {
      ...bannerData,
      id: Date.now().toString(),
      clickCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBanners((prev) => [...prev, newBanner]);
  };

  const updateBanner = (bannerId, updates) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === bannerId ? { ...banner, ...updates } : banner
      )
    );
  };

  const deleteBanner = (bannerId) => {
    setBanners((prev) => prev.filter((banner) => banner.id !== bannerId));
  };

  const activateBanner = (bannerId) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === bannerId ? { ...banner, status: "active" } : banner
      )
    );
  };

  const deactivateBanner = (bannerId) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === bannerId ? { ...banner, status: "inactive" } : banner
      )
    );
  };

  // Analytics
  const getAnalytics = () => {
    const totalVendors = vendors.length;
    const approvedVendors = vendors.filter(
      (v) => v.status === "approved"
    ).length;
    const pendingVendors = vendors.filter((v) => v.status === "pending").length;
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(
      (c) => c.status === "active"
    ).length;
    const totalRevenue = vendors.reduce(
      (sum, vendor) => sum + vendor.totalRevenue,
      0
    );
    const activeBanners = banners.filter((b) => b.status === "active").length;

    return {
      totalVendors,
      approvedVendors,
      pendingVendors,
      totalCustomers,
      activeCustomers,
      totalRevenue,
      activeBanners,
    };
  };

  return (
    <AdminContext.Provider
      value={{
        vendors,
        customers,
        banners,
        approveVendor,
        rejectVendor,
        suspendVendor,
        deleteVendor,
        suspendCustomer,
        activateCustomer,
        deleteCustomer,
        addBanner,
        updateBanner,
        deleteBanner,
        activateBanner,
        deactivateBanner,
        getAnalytics,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
