import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Package,
  DollarSign,
  Tag,
  Calendar,
  Eye,
  Star,
  Share2,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { _get, server_url } from "../utils/Helper";

const ViewProduct = () => {
  const navigate = useNavigate();
  const { product_id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("user"));

  // Fetch product data
  useEffect(() => {
    if (!product_id) {
      console.error("No product_id provided");
      setLoading(false);
      return;
    }

    console.log("Fetching product with ID:", product_id);
    setLoading(true);

    // Fetch product details
    _get(
      `api/productsbyid/${product_id}`,
      (resp) => {
        console.log("Product response:", resp);
        if (resp.result && resp.result[0]) {
          setProduct(resp.result[0]);
          toast.success("Product loaded successfully");
        } else {
          console.error("No product data found in response");
          toast.error("Product not found");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product");
        setLoading(false);
      }
    );

    // Fetch categories for category name display
    _get(
      `api/categories`,
      (resp) => {
        if (resp.results && resp.results[0]) {
          setCategories(resp.results[0]);
        }
      },
      (err) => {
        console.error("Error fetching categories:", err);
      }
    );
  }, [product_id]);

  const handleEditProduct = () => {
    navigate(`/products/edit/${product_id}`);
  };

  const handleDeleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        const response = await fetch(`${server_url}/api/products`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: product_id,
            query_type: "delete_product",
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Product deleted successfully");
          navigate("/products");
        } else {
          throw new Error(data.message || "Failed to delete product");
        }
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    }
  };

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

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.ctgry_id === categoryId);
    return category ? category.product_category : "Unknown Category";
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
          <p className="mt-2 text-sm text-gray-500">Product ID: {product_id}</p>
        </div>
      </div>
    );
  }

  if (!product_id) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Product ID Missing
          </h3>
          <p className="text-gray-600 mb-6">
            No product ID was provided in the URL. Please navigate to this page
            from the products list.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Product Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const productImages = product.image_urls
    ? product.image_urls.split(",").filter((img) => img.trim() !== "")
    : [];
  const fallbackImage =
    "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/products")}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Product Details
            </h1>
            <p className="text-gray-600">View and manage product information</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleEditProduct}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 size={16} className="mr-2" />
            Edit Product
          </button>
          <button
            onClick={handleDeleteProduct}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square">
              <img
                src={
                  productImages.length > 0
                    ? productImages[selectedImageIndex].startsWith("http")
                      ? productImages[selectedImageIndex]
                      : `${server_url}/uploads/${productImages[selectedImageIndex]}`
                    : fallbackImage
                }
                alt={product.product_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = fallbackImage;
                }}
              />
            </div>
          </div>

          {/* Image Thumbnails */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={
                      image.startsWith("http")
                        ? image
                        : `${server_url}/uploads/${image}`
                    }
                    alt={`${product.product_name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = fallbackImage;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.product_name}
                </h2>
                <div className="flex items-center space-x-3 mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      product.product_status
                    )}`}
                  >
                    {product.product_status}
                  </span>
                  <span className="text-sm text-gray-500">
                    ID: {product.product_id}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.product_description || "No description available"}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign size={20} className="mr-2" />
              Pricing & Inventory
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">
                    Price
                  </span>
                  <DollarSign size={16} className="text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  ₦{parseFloat(product.product_price || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">
                    Stock
                  </span>
                  <Package size={16} className="text-blue-600" />
                </div>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    product.product_quantity === 0
                      ? "text-red-600"
                      : product.product_quantity <= 10
                      ? "text-yellow-600"
                      : "text-blue-900"
                  }`}
                >
                  {product.product_quantity}
                </p>
              </div>
            </div>
          </div>

          {/* Category & Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Tag size={20} className="mr-2" />
              Product Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-gray-900">
                  {product.product_category}
                </span>
              </div>
              {product.product_subcategory && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Subcategory:</span>
                  <span className="font-medium text-gray-900">
                    {product.product_subcategory}
                  </span>
                </div>
              )}
              {product.product_size && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Size/Measurement:</span>
                  <span className="font-medium text-gray-900">
                    {product.product_size}
                  </span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium text-gray-900">
                    {product.weight} lbs
                  </span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="font-medium text-gray-900">
                    {product.dimensions}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900">
                  {product.created_at
                    ? new Date(product.created_at).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleEditProduct}
                className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit3 size={16} className="mr-2" />
                Edit Product
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Product link copied to clipboard!");
                }}
                className="flex items-center justify-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Share2 size={16} className="mr-2" />
                Share Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Info size={20} className="mr-2" />
          Additional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Eye size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Product Views</p>
            <p className="text-lg font-semibold text-gray-900">-</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <ShoppingCart size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="text-lg font-semibold text-gray-900">-</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Star size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-lg font-semibold text-gray-900">-</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
