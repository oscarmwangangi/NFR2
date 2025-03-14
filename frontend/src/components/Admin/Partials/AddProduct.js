import React, { useState, useEffect } from "react";
import { flattenCategories } from "./ManageCategories"; // Adjust the path as needed
import { filterBrandsBySubcategory } from "./Brandutils"; // Import your helper

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    in_stock: "",
    image: null,
    category: "",
    brand: "",
    gender: "",
    subcategory: "",
  });
  const [sizes, setSizes] = useState([]); // Store multiple sizes
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [brands, setBrands] = useState([]); // State for brands
  const [isTopLevelCategory, setIsTopLevelCategory] = useState(false); // Toggle for top-level category

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setSelectedCategoryId(selectedId);

    // Find the selected category
    const selectedCategory = categories.find((cat) => cat.id === parseInt(selectedId));

    // Set subcategories if the selected category has any
    if (selectedCategory && selectedCategory.subcategories) {
      setSubcategories(selectedCategory.subcategories);
    } else {
      setSubcategories([]); // Reset subcategories if no subcategories exist
    }

    // Update the product category
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: selectedId,
      subcategory: "", // Reset subcategory when category changes
    }));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  // Fetch categories from the backend
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch brands from the backend
  const fetchBrands = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/brands`);
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      setError("Failed to fetch brands.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.category) {
      setError("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();

    // Append product data
    for (const [key, value] of Object.entries(product)) {
      if (key === "image" && value) {
        formData.append(key, value);
      } else if (key !== "size") {
        formData.append(key, value);
      }
    }

    // Append size separately as JSON string
    formData.append("size", JSON.stringify(sizes));

    // Append whether it's a top-level category
    formData.append("isTopLevelCategory", isTopLevelCategory);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Product added successfully!");
        setProduct({
          name: "",
          description: "",
          price: "",
          discount_price: "",
          in_stock: "",
          image: null,
          category: "",
          brand: "",
          gender: "",
          subcategory: "",
        });
        setSizes([]); // Reset sizes
        setIsTopLevelCategory(false); // Reset top-level category toggle
      }
    } catch (error) {
      setError("Failed to add product.");
      console.error(error);
    }
  };

  // Add a new size input
  const addSize = () => {
    setSizes([...sizes, ""]);
  };

  // Handle size input changes
  const handleSizeChange = (index, value) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
  };

  // Remove a size input
  const removeSize = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  return (
    <div className="flex flex-col lg:flex-row p-6 space-y-6 lg:space-y-0 lg:space-x-6">
      {/* Add Product Form */}
      <div className="w-full lg:w-2/3 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add Product</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 peer"
              required
            />
            <label
              className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 pointer-events-none bg-white px-1 ${
                product.name ? "text-sm -translate-y-4" : "peer-focus:text-sm peer-focus:-translate-y-4"
              }`}
            >
              Product Name
            </label>
          </div>

          {/* Product Description */}
          <div className="relative">
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 peer"
              required
            />
            <label
              className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 pointer-events-none bg-white px-1 ${
                product.description ? "text-sm -translate-y-4" : "peer-focus:text-sm peer-focus:-translate-y-4"
              }`}
            >
              Product Description
            </label>
          </div>

          {/* Price */}
          <div className="relative">
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 peer"
              required
            />
            <label
              className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 pointer-events-none bg-white px-1 ${
                product.price ? "text-sm -translate-y-4" : "peer-focus:text-sm peer-focus:-translate-y-4"
              }`}
            >
              Price
            </label>
          </div>

          {/* Discount Price */}
          <div className="relative">
            <input
              type="number"
              name="discount_price"
              value={product.discount_price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 peer"
            />
            <label
              className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 pointer-events-none bg-white px-1 ${
                product.discount_price ? "text-sm -translate-y-4" : "peer-focus:text-sm peer-focus:-translate-y-4"
              }`}
            >
              Discount Price
            </label>
          </div>

          {/* In Stock */}
          <div className="relative">
            <input
              type="number"
              name="in_stock"
              value={product.in_stock}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 peer"
              required
            />
            <label
              className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 pointer-events-none bg-white px-1 ${
                product.in_stock ? "text-sm -translate-y-4" : "peer-focus:text-sm peer-focus:-translate-y-4"
              }`}
            >
              In Stock
            </label>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              {isTopLevelCategory ? "Top-Level Category" : "Category"}
            </label>
            <select
              name="category"
              value={product.category}
              onChange={handleCategoryChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select {isTopLevelCategory ? "Top-Level Category" : "Category"}</option>
              {categories &&
                categories
                  .filter((cat) => (isTopLevelCategory ? !cat.parent_id : true)) // Filter top-level categories if needed
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
            </select>
          </div>

          {/* Subcategory Dropdown (only show if not a top-level category) */}
          {!isTopLevelCategory && selectedCategoryId && subcategories.length > 0 && (
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                Subcategory
              </label>
              <select
                name="subcategory"
                value={product.subcategory}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Brand Dropdown */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
              Brand
            </label>
            <select
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Brand</option>
              {product.subcategory &&
                filterBrandsBySubcategory(brands, product.subcategory).map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Gender */}
          <div className="relative">
            <input
              type="text"
              name="gender"
              value={product.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 peer"
              required
            />
            <label
              className={`absolute left-3 top-2 text-gray-500 transition-all duration-200 pointer-events-none bg-white px-1 ${
                product.gender ? "text-sm -translate-y-4" : "peer-focus:text-sm peer-focus:-translate-y-4"
              }`}
            >
              Gender
            </label>
          </div>

          {/* Sizes */}
          <div>
            <label className="font-semibold">Sizes:</label>
            {sizes.map((size, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  placeholder="Enter size (e.g., 40inch)"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSize}
              className="bg-blue-500 text-white px-3 py-2 rounded-md mt-2"
            >
              + Add Size
            </button>
          </div>

          {/* Toggle for Top-Level Category */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isTopLevelCategory"
              checked={isTopLevelCategory}
              onChange={(e) => setIsTopLevelCategory(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isTopLevelCategory" className="text-sm font-medium text-gray-700">
              Add to Top-Level Category
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;