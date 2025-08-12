// import React from "react";
// import Dashboard from "./pages/Dashboard";
// import Products from "./pages/Products";
// import Orders from "./pages/Orders";
// import AddProduct from "./pages/AddProduct";
// import Stores from "./pages/Stores";
// import AddStore from "./pages/AddStore";
// import EditProduct from "./pages/EditProduct";
// import Layout from "./component/Layout";
// import { StoreProvider } from "./contex/StoreContext";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginForm from "./component/LoginForm";
// import { AdminProvider } from "./contex/AdminContext";
// import AdminLayout from "./component/AdminLayout";
// import AdminDashboard from "./pages/Admin/AdminDashboard";
// import VendorManagement from "./pages/Admin/VendorManagement";
// import { AuthProvider, useAuth } from "./contex/AuthContext";

// const AppContent = () => {
//   const { isAuthenticated, isAdmin, isVendor } = useAuth();

//   if (!isAuthenticated) {
//     return <LoginForm />;
//   }

//   if (isAdmin()) {
//     return (
//       <AdminProvider>
//         <AdminLayout>
//           <Routes>
//             <Route path="/admin" element={<AdminDashboard />} />
//             <Route path="/admin/vendors" element={<VendorManagement />} />
//             <Route path="*" element={<AdminDashboard />} />
//           </Routes>
//         </AdminLayout>
//       </AdminProvider>
//     );
//   }

//   if (isVendor()) {
//     return (
//       <StoreProvider>
//         <Layout>
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/stores" element={<Stores />} />
//             <Route path="/stores/add" element={<AddStore />} />
//             <Route path="/products" element={<Products />} />
//             <Route path="/products/add" element={<AddProduct />} />
//             <Route path="/products/edit/:id" element={<EditProduct />} />
//             <Route path="/orders" element={<Orders />} />
//             <Route path="*" element={<Dashboard />} />
//           </Routes>
//         </Layout>
//       </StoreProvider>
//     );
//   }

//   return <LoginForm />;
// };
// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <AppContent />
//       </Router>
//     </AuthProvider>
//     // <StoreProvider>
//     //   <Router>
//     //     <Layout>
//     //       <Routes>
//     //         <Route path="/" element={<Dashboard />} />
//     //         <Route path="/stores" element={<Stores />} />
//     //         <Route path="/stores/add" element={<AddStore />} />
//     //         <Route path="/products" element={<Products />} />
//     //         <Route path="/products/add" element={<AddProduct />} />
//     //         <Route path="/products/edit/:id" element={<EditProduct />} />
//     //         <Route path="/orders" element={<Orders />} />
//     //       </Routes>
//     //     </Layout>
//     //   </Router>
//     // </StoreProvider>
//   );
// }

// export default App;
import React from "react";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import AddProduct from "./pages/AddProduct";
import Stores from "./pages/Stores";
import AddStore from "./pages/AddStore";
import EditProduct from "./pages/EditProduct";
import Layout from "./component/Layout";
import { StoreProvider } from "./contex/StoreContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./component/LoginForm";
import { AdminProvider } from "./contex/AdminContext";
import AdminLayout from "./component/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import VendorManagement from "./pages/Admin/VendorManagement";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import store from "./redux/store";

const AppContent = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (user?.role === "admin") {
    return (
      <AdminProvider>
        <AdminLayout>
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/vendors" element={<VendorManagement />} />
            <Route path="*" element={<AdminDashboard />} />
          </Routes>
        </AdminLayout>
      </AdminProvider>
    );
  }

  if (user?.role === "vendor") {
    return (
      <StoreProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/stores/add" element={<AddStore />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route
              path="/products/edit/:product_id"
              element={<EditProduct />}
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </StoreProvider>
    );
  }

  return <LoginForm />;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
