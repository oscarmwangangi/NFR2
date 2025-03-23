import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { calculateDiscountPercentage } from "./utils/DiscountUtlils.js";

function CategoryPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { categoryName } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 50, max: 190000 });
  const [sortBy, setSortBy] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(()=>{
      window.scrollTo(0,0)
    },[])
  // Fetch products and hierarchical categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/products`);
        setAllProducts(productsResponse.data);

        const categoriesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categories`);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters(categoryName);
  }, [categoryName, allProducts, searchTerm, priceRange, sortBy]);

  const applyFilters = (categoryFilter) => {
    let filtered = [...allProducts];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchLower));
    }

    // Price filter
    filtered = filtered.filter(p => 
      p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Sorting
    switch (sortBy) {
      case "cheapest":
        filtered.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price));
        break;
      case "expensive":
        filtered.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price));
        break;
      case "a-z":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-a":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Recursive function to render categories with subcategories
  const renderCategories = (categories, level = 0) => {
    return categories.map((category) => {
      const isTopLevel = level === 0;
      return (
        <li key={category.id} className="mb-1">
          <div className="flex items-center justify-between hover:bg-gray-50 rounded">
            {category.subcategories?.length > 0 ? (
              <>
                {isTopLevel ? (
                  // Top-level category with subcategories: render as a clickable link
                  <Link
                    to={`/category/${category.id}`}
                    className={`flex-1 text-left px-3 py-2 rounded ${
                      categoryName === category.name ? "bg-blue-100" : ""
                    }`}
                    style={{ paddingLeft: `${level * 20}px` }}
                  >
                    <span className="text-sm">{category.name}</span>
                  </Link>
                ) : (
                  // Subcategory with children: render as plain text (or button without navigation)
                  <button
                    className={`flex-1 text-left px-3 py-2 rounded ${
                      categoryName === category.name ? "bg-blue-100" : ""
                    }`}
                    style={{ paddingLeft: `${level * 20}px` }}
                  >
                    <span className="text-sm">{category.name}</span>
                  </button>
                )}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="px-2 hover:bg-gray-200 rounded"
                >
                  {expandedCategories[category.id] ? "−" : "+"}
                </button>
              </>
            ) : (
              isTopLevel ? (
                // Top-level leaf category: render as a clickable link
                <Link
                  to={`/category/${category.id}`}
                  className={`flex-1 text-left px-3 py-2 rounded ${
                    categoryName === category.name ? "bg-blue-100 text-blue-700" : ""
                  }`}
                  style={{ paddingLeft: `${level * 20}px` }}
                >
                  <span className="text-sm">{category.name}</span>
                </Link>
              ) : (
                // Subcategory that is a leaf: render as plain text
                <span
                  className="flex-1 text-left px-3 py-2"
                  style={{ paddingLeft: `${level * 20}px` }}
                >
                  {category.name}
                </span>
              )
            )}
          </div>
          {expandedCategories[category.id] && category.subcategories && (
            <ul className="ml-4">
              {renderCategories(category.subcategories, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  };
  

  // Price range handlers
  const handlePriceChange = (type, value) => {
    const numValue = Math.max(50, Math.min(190000, Number(value)));
    setPriceRange(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const handleSliderInteraction = (e) => {
    const { name, value } = e.target;
    handlePriceChange(name, value);
  };

  return (
    <div className="bg-[#f5f5f5]">
      <div className="container mx-auto p-4 flex gap-8">
        {/* Sidebar */}
        <div className="w-1/4 h-fit bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-3">Categories</h3>
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold mb-3">Search</h3>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-3 py-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-bold mb-3">Price Range</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="50"
                  max="190000"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-1/2 px-2 py-1 border rounded"
                />
                <input
                  type="number"
                  min="50"
                  max="190000"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-1/2 px-2 py-1 border rounded"
                />
              </div>
              <div className="relative pt-4">
                <div className="relative h-8">
                  <input
                    type="range"
                    min="50"
                    max="190000"
                    name="min"
                    value={priceRange.min}
                    onChange={handleSliderInteraction}
                    className="absolute w-full z-20 appearance-none"
                  />
                  <input
                    type="range"
                    min="50"
                    max="190000"
                    name="max"
                    value={priceRange.max}
                    onChange={handleSliderInteraction}
                    className="absolute w-full z-10 appearance-none"
                  />
                  <div className="absolute w-full top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded">
                    <div
                      className="absolute h-1 bg-blue-500 rounded"
                      style={{
                        left: `${((priceRange.min - 50) / 189950) * 100}%`,
                        right: `${100 - ((priceRange.max - 50) / 189950) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 my-2 border-b pb-2">
                  <span>Ksh {priceRange.min.toLocaleString()}</span>
                  <span>Ksh {priceRange.max.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          <ul>
            {renderCategories(categories)}
          </ul>


        </div>

        {/* Products Grid */}
        <div className="w-3/4 bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-[#313133]">
            {categoryName || "All Products"}
          </h2>

          <div className="flex justify-end mb-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-md bg-white text-sm"
            >
              <option value="">Sort by</option>
              <option value="cheapest">Cheapest first</option>
              <option value="expensive">Expensive first</option>
              <option value="a-z">From A-Z</option>
              <option value="z-a">From Z-A</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              No products found matching your criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Extracted product card component
const ProductCard = ({ product }) => (
  <Link
    to={`/product/${product.id}`}
    className="group cursor-pointer p-4 rounded-lg hover:shadow-lg transition-all relative"
  >
    {product.discount_price && (
      <div className="absolute top-2 right-2 bg-red-500 bg-opacity-10 text-[#f5594b] text-sm font-semibold px-2 py-1 rounded">
        -{calculateDiscountPercentage(product.price, product.discount_price)}%
      </div>
    )}
    <img
      src={`${process.env.REACT_APP_BACKEND_URL}/${product.image_path}`}
      alt={product.name}
      className="w-full h-48 object-cover rounded-t-lg"
    />
    <h3 className="text-sm font-semibold text-[#313133] truncate-text">
      {product.name}
    </h3>
    <div className="mt-2 flex flex-col">
      {product.discount_price ? (
        <>
          <span className="text-xl font-bold text-[#313133]">
            Ksh {product.discount_price}
          </span>
          <span className="text-sm text-gray-500 line-through">
            Ksh {product.price}
          </span>
        </>
      ) : (
        <span className="text-xl font-bold text-[#313133]">
          Ksh {product.price}
        </span>
      )}
    </div>
  </Link>
);

export default CategoryPage;