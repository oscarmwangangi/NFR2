import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function CategoryDetailPage() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [subSearch, setSubSearch] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  
  // Applied price filters (used in the product query)
  const [minPrice, setMinPrice] = useState(2500);
  const [maxPrice, setMaxPrice] = useState(8500);
  
  // Temporary price values (for inputs/slider)
  const [tempMinPrice, setTempMinPrice] = useState(2500);
  const [tempMaxPrice, setTempMaxPrice] = useState(8500);
  
  // Maximum available price among products (for slider max and display)
  const [maxAvailablePrice, setMaxAvailablePrice] = useState(10000);
    useEffect(()=>{
      window.scrollTo(0,0)
    },[])
  // Fetch category details (with its subcategories)
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/categories/${categoryId}`)
      .then((res) => setCategory(res.data))
      .catch((err) => console.error("Error fetching category:", err));
  }, [categoryId]);

  // Fetch all brands from backend
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/brands`)
      .then((res) => setBrands(res.data))
      .catch((err) => console.error("Error fetching brands:", err));
  }, []);

  // Fetch products using the applied filters (including price filters)
  useEffect(() => {
    let url = `${process.env.REACT_APP_BACKEND_URL}/api/user/products?category=${categoryId}`;
    if (selectedSubcategory) {
      url += `&subcategory=${selectedSubcategory}`;
    }
    if (selectedBrands.length > 0) {
      url += `&brand=${selectedBrands.join(",")}`;
    }
    url += `&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    console.log("Fetching products with URL:", url);
    axios
      .get(url)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, [categoryId, selectedSubcategory, selectedBrands, minPrice, maxPrice]);

  // Fetch all products for current category/subcategory/brand filters (ignoring price) to determine max available price
  useEffect(() => {
    let url = `${process.env.REACT_APP_BACKEND_URL}/api/user/products?category=${categoryId}`;
    if (selectedSubcategory) {
      url += `&subcategory=${selectedSubcategory}`;
    }
    if (selectedBrands.length > 0) {
      url += `&brand=${selectedBrands.join(",")}`;
    }
    axios
      .get(url)
      .then((res) => {
        const allProducts = res.data;
        if (allProducts.length > 0) {
          const prices = allProducts.map((prod) => prod.price);
          const maxPriceFound = Math.max(...prices);
          setMaxAvailablePrice(maxPriceFound);
          // If the new max is lower than our temporary max, adjust it.
          if (tempMaxPrice > maxPriceFound) {
            setTempMaxPrice(maxPriceFound);
            setMaxPrice(maxPriceFound);
          }
        } else {
          setMaxAvailablePrice(10000);
        }
      })
      .catch((err) => console.error("Error fetching max available price:", err));
  }, [categoryId, selectedSubcategory, selectedBrands, tempMaxPrice]);

  if (!category) {
    return <p>Loading...</p>;
  }

  // Filter subcategories using the search input
  const filteredSubcategories =
    category.subcategories?.filter((sub) =>
      sub.name.toLowerCase().includes(subSearch.toLowerCase())
    ) || [];

  // Determine available brands:
  // If a subcategory is selected, show only brands associated with that subcategory (using brand.category_id).
  // Otherwise, show the union of brands across all subcategories of this category.
  const availableBrands = brands.filter((brand) =>
    selectedSubcategory
      ? String(brand.category_id) === String(selectedSubcategory)
      : category.subcategories.some(
          (sub) => String(sub.id) === String(brand.category_id)
        )
  );

  // Toggle a brand checkbox
  const handleBrandToggle = (brandId) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brandId)
        ? prevSelected.filter((id) => id !== brandId)
        : [...prevSelected, brandId]
    );
  };

  // Slider interaction (updates temporary price values)
  const handleSliderInteraction = (e, type) => {
    e.preventDefault();
    const slider = e.currentTarget.parentElement;
    const rect = slider.getBoundingClientRect();
    const minVal = 0;
    const maxVal = maxAvailablePrice; // use dynamic maximum
    
    const handleMove = (moveEvent) => {
      const x = moveEvent.clientX - rect.left;
      let percentage = Math.min(Math.max(x / rect.width, 0), 1);
      let newValue = Math.round(percentage * maxVal);
  
      if (type === "min") {
        setTempMinPrice(Math.min(newValue, tempMaxPrice));
      } else if (type === "max") {
        setTempMaxPrice(Math.max(newValue, tempMinPrice));
      } else {
        const currentMin = (tempMinPrice / maxVal) * rect.width;
        const currentMax = (tempMaxPrice / maxVal) * rect.width;
        const isCloserToMin = Math.abs(x - currentMin) < Math.abs(x - currentMax);
  
        if (isCloserToMin) {
          setTempMinPrice(Math.min(newValue, tempMaxPrice));
        } else {
          setTempMaxPrice(Math.max(newValue, tempMinPrice));
        }
      }
    };
  
    const stopDragging = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopDragging);
    };
  
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDragging);
  };

  // Apply button action: update the applied filters to trigger a new product fetch
  const applyPriceFilter = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
  };

  return (
    <div className="bg-[#f5f5f5]">
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4 b">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 space-y-6 bg-white">
        {/* Price Range Filter */}
        <div className="bg-white p-4 rounded ">
          <h3 className="text-xl font-bold mb-2">Price Range</h3>
          <div className="flex justify-between items-center mb-4">
            <div className="w-1/2 mr-2">
              <label className="block text-sm font-medium text-gray-700">
                Min Price
              </label>
              <input
                type="number"
                value={tempMinPrice}
                min={0}
                max={tempMaxPrice}
                onChange={(e) =>
                  setTempMinPrice(Math.min(Number(e.target.value), tempMaxPrice))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="w-1/2 ml-2">
              <label className="block text-sm font-medium text-gray-700">
                Max Price{maxAvailablePrice}
              </label>
              <input
                type="number"
                value={tempMaxPrice}
                min={tempMinPrice}
                max={maxAvailablePrice}
                onChange={(e) =>
                  setTempMaxPrice(Math.max(Number(e.target.value), tempMinPrice))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Custom range slider container */}
          <div className="relative h-8 mb-4">
            <div
              className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2"
              onMouseDown={(e) => handleSliderInteraction(e, "container")}
            >
              {/* Selected range highlight */}
              <div
                className="absolute h-full bg-green-500 rounded-full"
                style={{
                  left: `${(tempMinPrice / maxAvailablePrice) * 100}%`,
                  right: `${100 - (tempMaxPrice / maxAvailablePrice) * 100}%`,
                }}
              ></div>
              {/* Min price thumb */}
              <div
                className="absolute top-1/2 w-4 h-4 bg-white border-2 border-green-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
                style={{
                  left: `${(tempMinPrice / maxAvailablePrice) * 100}%`,
                }}
                onMouseDown={(e) => handleSliderInteraction(e, "min")}
              ></div>
              {/* Max price thumb */}
              <div
                className="absolute top-1/2 w-4 h-4 bg-white border-2 border-green-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
                style={{
                  left: `${(tempMaxPrice / maxAvailablePrice) * 100}%`,
                }}
                onMouseDown={(e) => handleSliderInteraction(e, "max")}
              ></div>
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={applyPriceFilter}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Apply
          </button>
        </div>

        <div className="bg-white p-4 rounded  space-y-6">
          {/* Subcategories Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search subcategories..."
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                className="w-full px-2 py-1 border focus:outline-none focus:border-green-500 placeholder:text-xs"
              />
            </div>
            {category.subcategories && category.subcategories.length > 0 ? (
              <ul>
                <li>
                  <button
                    onClick={() => {
                      setSelectedSubcategory(null);
                      setSelectedBrands([]); // clear brand filter when changing subcategory
                    }}
                    className={`block w-full text-left text-sm text-gray-600 px-2 py-1 mb-1 rounded-sm ${
                      !selectedSubcategory
                        ? "bg-green-500 text-white"
                        : "bg-slate-100"
                    }`}
                  >
                    All Subcategories
                  </button>
                </li>
                {filteredSubcategories.map((sub) => (
                  <li key={sub.id}>
                    <button
                      onClick={() => {
                        setSelectedSubcategory(sub.id);
                        setSelectedBrands([]); // clear brand filter on subcategory change
                      }}
                      className={`block w-full text-left px-2 py-1 mb-1 text-sm text-gray-600 rounded ${
                        selectedSubcategory === sub.id
                          ? "bg-green-500 text-white"
                          : "bg-slate-50"
                      }`}
                    >
                      {sub.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No subcategories available.</p>
            )}
          </div>
          {/* Brands Section */}
          <div>
            <h3 className="text-xl font-bold mb-2">Brands</h3>
            {availableBrands.length > 0 ? (
              <ul className="space-y-1">
                {availableBrands.map((brand) => (
                  <li key={brand.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`brand-${brand.id}`}
                      value={brand.id}
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => handleBrandToggle(brand.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">
                {selectedSubcategory
                  ? "No brands available for this subcategory."
                  : "Select a subcategory to view brands."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full md:w-3/4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products && products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="product-item group cursor-pointer p-4 rounded-lg hover:shadow-lg transition-all relative"
              >
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
            ))
          ) : (
            <p>No products found for this category.</p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default CategoryDetailPage;
