import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, DollarSign, Package, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { server_url } from "../utils/Helper";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    product_category: "",
    product_subcategory: "",
    product_price: 0,
    product_quantity: 0,
    product_status: "Available",
    prod_size: "",
  });
  const [prod_images, setProdImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSizeInput, setShowSizeInput] = useState(false);
  const [showSizeInputchange, setShowSizeInputchange] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("user"));

  // Fetch categories on component mount
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(`${server_url}/api/categories`);
        const data = await response.json();
        setCategories(data.results[0]);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    getCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.product_category) {
      const getSubCategories = async () => {
        try {
          const response = await fetch(
            `${server_url}/api/subcategories?category=${formData.product_category}`
          );
          const data = await response.json();
          setSubCategories(data.results[0]);
        } catch (err) {
          toast.error("Failed to load subcategories");
        }
      };
      getSubCategories();
    }
  }, [formData.product_category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "product_price" || name === "product_quantity"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Handle special cases for Fabric subcategories
    if (
      field === "product_subcategory" &&
      (value === "Yard" ||
        value === "Materials" ||
        value === "Shadda" ||
        value === "Men_Lace") &&
      categories.find((cat) => cat.ctgry_id === formData.product_category)
        ?.ctgry_name === "Fabric"
    ) {
      setShowSizeInput(true);
    } else if (
      field === "product_subcategory" &&
      value !== "Yard" &&
      value !== "Materials" &&
      value !== "Shadda" &&
      value !== "Men_Lace"
    ) {
      setShowSizeInput(false);
    }

    if (field === "prod_size" && value === "Others") {
      setShowSizeInputchange(true);
    } else {
      setShowSizeInputchange(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + prod_images.length > 20) {
      toast.error("You can only upload up to 20 images.");
      return;
    }
    setProdImages((prev) => [...prev, ...files]);
  };

  const removeImage = (indexToRemove) => {
    setProdImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Form validation
    if (!formData.product_name.trim()) {
      toast.error("Please enter product name");
      setLoading(false);
      return;
    }
    if (!formData.product_category) {
      toast.error("Please select product category");
      setLoading(false);
      return;
    }
    if (!formData.product_quantity) {
      toast.error("Please enter product quantity");
      setLoading(false);
      return;
    }
    if (!formData.product_price) {
      toast.error("Please enter product price");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append images
      prod_images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      // Append additional required fields
      formDataToSend.append("query_type", "insert_product");
      formDataToSend.append("shop_id", userDetails.user_id);

      const response = await fetch(`${server_url}/api/products`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Product added successfully");
        navigate("/products");
      } else {
        throw new Error(data.message || "Failed to add product");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/products")}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">
            Fill in the details for your new product
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package size={20} className="mr-2" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="product_name"
                required
                value={formData.product_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="product_description"
                rows={4}
                value={formData.product_description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your product"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="product_category"
                required
                value={formData.product_category}
                onChange={(e) =>
                  handleSelectChange("product_category", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.ctgry_id} value={category.ctgry_id}>
                    {category.ctgry_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                name="product_subcategory"
                value={formData.product_subcategory}
                onChange={(e) =>
                  handleSelectChange("product_subcategory", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!formData.product_category}
              >
                <option value="">Select a subcategory</option>
                {subCategories.map((subCategory) => (
                  <option
                    key={subCategory.sub_ctgry_id}
                    value={subCategory.sub_ctgry_name}
                  >
                    {subCategory.sub_ctgry_name}
                  </option>
                ))}
              </select>
            </div>

            {showSizeInput &&
              (formData.product_subcategory === "Yard" ||
                formData.product_subcategory === "Materials" ||
                formData.product_subcategory === "Shadda" ||
                formData.product_subcategory === "Men_Lace") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Measurement
                  </label>
                  {!showSizeInputchange ? (
                    <select
                      name="prod_size"
                      value={formData.prod_size}
                      onChange={(e) =>
                        handleSelectChange("prod_size", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select measurement</option>
                      <option value="Per 1 Yard">Per 1 Yard</option>
                      <option value="Per 5 Yard">Per 5 Yard</option>
                      <option value="Others">Others</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="prod_size"
                      value={formData.prod_size}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter custom measurement"
                    />
                  )}
                </div>
              )}
          </div>
        </div>

        {/* Pricing and Inventory */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign size={20} className="mr-2" />
            Pricing & Inventory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  name="product_price"
                  required
                  step="0.01"
                  min="0"
                  value={formData.product_price}
                  onChange={handleInputChange}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="product_quantity"
                required
                min="0"
                value={formData.product_quantity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="product_status"
                value={formData.product_status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Upload size={20} className="mr-2" />
            Product Images *
          </h2>
          <div className="border-2 border-dashed rounded-lg p-8 text-center transition-colors border-gray-300 hover:border-gray-400">
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Upload product images
            </p>
            <p className="text-gray-600 mb-4">
              Drag and drop your images here, or click to browse
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Choose Files
            </label>
          </div>

          {/* Image Preview */}
          {prod_images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Uploaded Images ({prod_images.length}/20)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {prod_images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
