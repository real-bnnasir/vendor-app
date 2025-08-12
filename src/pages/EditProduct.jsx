import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, DollarSign, Package, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { _get, _put, _putImage, server_url } from "../utils/Helper";

const EditProduct = () => {
  const navigate = useNavigate();
  const { product_id } = useParams();
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    product_category: "",
    product_subcategory: "",
    product_price: "",
    product_quantity: "",
    product_status: "Available",
    product_size: "",
    weight: "",
    dimensions: "",
  });
  const [prod_images, setProdImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSizeInput, setShowSizeInput] = useState(false);
  const [showSizeInputchange, setShowSizeInputchange] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("user"));

  // Fetch product data
  useEffect(() => {
    if (!product_id) return;

    setLoading(true);

    _get(
      `api/productsbyid/${product_id}`,
      (resp) => {
        if (resp.result && resp.result[0]) {
          const product = resp.result[0];
          setFormData({
            product_name: product.product_name,
            product_description: product.product_description,
            product_category: product.ctgry_id,
            product_subcategory: product.product_subcategory,
            product_price: product.product_price,
            product_quantity: product.product_quantity,
            product_status: product.product_status,
            product_size: product.product_size,
            weight: product.weight || "",
            dimensions: product.dimensions || "",
          });

          if (product.image_urls) {
            setProdImages(product.image_urls.split(","));
          }
        }
        setLoading(false);
      },
      (err) => {
        toast.error("Failed to load product");
        setLoading(false);
      }
    );

    _get(
      `api/categories`,
      (resp) => {
        setCategories(resp.results[0]);
      },
      (err) => {
        toast.error("Failed to load categories");
      }
    );
  }, [product_id]);

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
      [name]: value, // Keep as string to match DB varchar fields
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

    if (field === "product_size" && value === "Others") {
      setShowSizeInputchange(true);
    } else {
      setShowSizeInputchange(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newImages.length + prod_images.length > 20) {
      toast.error("You can only upload up to 20 images.");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeImage = (indexToRemove, isExisting) => {
    if (isExisting) {
      setProdImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    } else {
      setNewImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    }
  };

  // In the handleSubmit function:
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const formDataToSend = new FormData();

  //     if (!product_id) {
  //       alert("Product ID is missing");
  //       return;
  //     }

  //     setLoading(true);

  //     // Append all form data
  //     formDataToSend.append("product_id", product_id);
  //     formDataToSend.append("product_name", formData.product_name);
  //     formDataToSend.append(
  //       "product_description",
  //       formData.product_description
  //     );
  //     formDataToSend.append("product_category", formData.product_category);
  //     formDataToSend.append(
  //       "product_subcategory",
  //       formData.product_subcategory
  //     );
  //     formDataToSend.append("product_price", formData.product_price);
  //     formDataToSend.append("product_quantity", formData.product_quantity);
  //     formDataToSend.append("product_status", formData.product_status);
  //     formDataToSend.append("product_size", formData.product_size);
  //     formDataToSend.append("shop_id", userDetails.user_id);
  //     formDataToSend.append("existing_images", prod_images.join(","));

  //     // Append new images
  //     newImages.forEach((image) => {
  //       formDataToSend.append("images", image);
  //     });

  //     // Send the request
  //     _put(
  //       `api/updateproducts/${product_id}`,
  //       formDataToSend,
  //       (resp) => {
  //         toast.success("Product updated successfully");
  //         navigate("/products");
  //       },
  //       (err) => {
  //         toast.error(err.message || "Failed to update product");
  //         setLoading(false);
  //       }
  //     );
  //   } catch (error) {
  //     toast.error(error.message);
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      if (!product_id) {
        alert("Product ID is missing");
        return;
      }

      // Append all form data
      formDataToSend.append("product_id", product_id);
      formDataToSend.append("product_name", formData.product_name);
      formDataToSend.append(
        "product_description",
        formData.product_description
      );
      formDataToSend.append("product_category", formData.product_category);
      formDataToSend.append(
        "product_subcategory",
        formData.product_subcategory
      );
      formDataToSend.append("product_price", formData.product_price);
      formDataToSend.append("product_quantity", formData.product_quantity);
      formDataToSend.append("product_status", formData.product_status);
      formDataToSend.append("product_size", formData.product_size);
      formDataToSend.append("shop_id", userDetails.user_id);
      formDataToSend.append("existing_images", prod_images.join(","));

      // Append new images
      newImages.forEach((image) => {
        formDataToSend.append("images", image);
      });

      // Send the request - no need to JSON.stringify since we're using FormData
      _putImage(
        `api/updateproducts/${product_id}`,
        formDataToSend,
        (resp) => {
          toast.success("Product updated successfully");
          navigate("/products");
        },
        (err) => {
          toast.error(err.message || "Failed to update product");
          setLoading(false);
        }
      );
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product_id) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Product Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or you don't have
            permission to edit it.
          </p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">Update product details</p>
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
                      name="product_size"
                      value={formData.product_size}
                      onChange={(e) =>
                        handleSelectChange("product_size", e.target.value)
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
                      name="product_size"
                      value={formData.product_size}
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
                  type="text" // Changed to text to match DB varchar
                  name="product_price"
                  required
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
                type="text" // Changed to text to match DB varchar
                name="product_quantity"
                required
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
            Product Images
          </h2>

          {/* Upload Area */}
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
          {(prod_images.length > 0 || newImages.length > 0) && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Product Images ({prod_images.length + newImages.length}/20)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Existing images */}
                {prod_images.map((image, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={`${server_url}/uploads/${image}`}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, true)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {/* New images */}
                {newImages.map((image, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, false)}
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

        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Tag size={20} className="mr-2" />
            Shipping Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (lbs)
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions (L x W x H)
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 10 x 8 x 2 inches"
              />
            </div>
          </div>
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
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
