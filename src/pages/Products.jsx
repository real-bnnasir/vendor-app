import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  MoreHorizontal,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import { _get, separator, server_url } from "../utils/Helper";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [available, setAvailable] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const userDetails = JSON.parse(localStorage.getItem("user"));

  // Fetch products from API
  // const getProducts = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(
  //       `${server_url}/api/get-products?shop_id=${userDetails.user_id}`
  //     );
  //     const data = await response.json();

  //     if (data.result && data.result[0]) {
  //       setProducts(data.result[0]);

  //       // Filter available and out of stock products
  //       const availableProducts = data.result[0].filter(
  //         (p) => p.product_status === "Available"
  //       );
  //       const outOfStockProducts = data.result[0].filter(
  //         (p) => p.product_status === "Out of Stock"
  //       );

  //       setAvailable(availableProducts);
  //       setOutOfStock(outOfStockProducts);
  //     }
  //   } catch (error) {
  //     toast.error("Failed to load products");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getProducts = () => {
    _get(
      `api/get-products?shop_id="${userDetails.user_id}"`,
      // setLoading(true),
      (resp) => {
        setProducts(resp.result[0]);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (userDetails?.user_id) {
      getProducts();
    }
  }, [userDetails?.user_id]);

  // Delete product function
  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        const response = await fetch(`${server_url}/api/products`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: productId,
            query_type: "delete_product",
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Product deleted successfully");
          getProducts(); // Refresh the product list
        } else {
          throw new Error(data.message || "Failed to delete product");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && product.product_status === "Available") ||
      (filterStatus === "out-of-stock" &&
        product.product_status === "Out of Stock");

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Out of Stock":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your products and view their sales performance.
          </p>
        </div>
        <Link
          to="/products/add"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </Link>
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Available</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          // Get the first image URL
          const firstImage =
            product.image_urls?.split(",")[0] ||
            "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2";

          return (
            <div
              key={product.product_id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={firstImage}
                  alt={product.product_name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <div className="relative">
                    <button className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                      <MoreHorizontal size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      product.product_status
                    )}`}
                  >
                    {product.product_status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {product.product_name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {product.product_category}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    &#8358;{separator(product.product_price)}
                    {/* {product.product_price} */}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Stock</p>
                    <p
                      className={`text-sm font-medium ${
                        product.product_quantity === 0
                          ? "text-red-600"
                          : product.product_quantity <= 10
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {product.product_quantity}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <Eye size={14} className="mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleEditProduct(product.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <Edit3 size={14} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first product."}
          </p>
          {!searchTerm && filterStatus === "all" && (
            <Link
              to="/products/add"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Add Your First Product
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
