import React, { createContext, useContext, useState } from 'react';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

const mockStores = [
  {
    id: '1',
    name: 'Tech Paradise',
    description: 'Premium electronics and gadgets',
    logo: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'active',
    createdAt: '2024-01-15',
    settings: {
      currency: 'USD',
      timezone: 'America/New_York',
      address: '123 Tech Street, Silicon Valley, CA 94000',
      phone: '+1 (555) 123-4567',
      email: 'contact@techparadise.com',
    },
    stats: {
      totalProducts: 24,
      totalOrders: 156,
      monthlyRevenue: 12847,
      conversionRate: 3.2,
    },
  },
  {
    id: '2',
    name: 'Fashion Hub',
    description: 'Trendy clothing and accessories',
    logo: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    status: 'active',
    createdAt: '2024-02-01',
    settings: {
      currency: 'USD',
      timezone: 'America/New_York',
      address: '456 Fashion Ave, New York, NY 10001',
      phone: '+1 (555) 987-6543',
      email: 'hello@fashionhub.com',
    },
    stats: {
      totalProducts: 18,
      totalOrders: 89,
      monthlyRevenue: 8432,
      conversionRate: 2.8,
    },
  },
];

const mockProducts = [
  {
    id: '1',
    storeId: '1',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299.99,
    stock: 25,
    sku: 'WBH-001',
    status: 'active',
    images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'],
    sales: 142,
    rating: 4.8,
    createdAt: '2024-01-20',
  },
  {
    id: '2',
    storeId: '1',
    name: 'Smart Fitness Watch',
    category: 'Wearables',
    description: 'Advanced fitness tracking with heart rate monitor',
    price: 449.99,
    stock: 15,
    sku: 'SFW-002',
    status: 'active',
    images: ['https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'],
    sales: 89,
    rating: 4.6,
    createdAt: '2024-01-22',
  },
  {
    id: '3',
    storeId: '2',
    name: 'Designer Handbag',
    category: 'Fashion',
    description: 'Luxury leather handbag with premium finish',
    price: 199.99,
    stock: 12,
    sku: 'DHB-001',
    status: 'active',
    images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2'],
    sales: 67,
    rating: 4.7,
    createdAt: '2024-02-05',
  },
];

const mockOrders = [
  {
    id: 'ORD-001',
    storeId: '1',
    customer: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2',
    },
    products: [
      { id: '1', name: 'Wireless Headphones', quantity: 1, price: 299.99 },
    ],
    total: 299.99,
    status: 'pending',
    date: '2025-01-20',
    shippingAddress: '123 Main St, New York, NY 10001',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-002',
    storeId: '1',
    customer: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2',
    },
    products: [
      { id: '2', name: 'Smart Watch', quantity: 1, price: 449.99 },
    ],
    total: 449.99,
    status: 'confirmed',
    date: '2025-01-19',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
    paymentMethod: 'PayPal',
  },
];

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState(mockStores);
  const [currentStore, setCurrentStore] = useState(mockStores[0]);
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);

  const addStore = (storeData) => {
    const newStore = {
      ...storeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStores(prev => [...prev, newStore]);
  };

  const updateStore = (id, updates) => {
    setStores(prev => prev.map(store => 
      store.id === id ? { ...store, ...updates } : store
    ));
    if (currentStore?.id === id) {
      setCurrentStore(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteStore = (id) => {
    setStores(prev => prev.filter(store => store.id !== id));
    setProducts(prev => prev.filter(product => product.storeId !== id));
    setOrders(prev => prev.filter(order => order.storeId !== id));
    if (currentStore?.id === id) {
      setCurrentStore(stores.find(store => store.id !== id) || null);
    }
  };

  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  return (
    <StoreContext.Provider value={{
      stores,
      currentStore,
      products,
      orders,
      setCurrentStore,
      addStore,
      updateStore,
      deleteStore,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
    }}>
      {children}
    </StoreContext.Provider>
  );
};