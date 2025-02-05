// src/pages/AddProduct.js
import React, { useState,useEffect } from 'react';

function AddProduct() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    in_stock: '',
    image: null,  // For storing the image file
    category: '',
    brand: '',
    size: '',
    gender: '',
    product_category_id: '',
    categories: ''
  });
  const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
  
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const url = editingCategory
        ? `${process.env.REACT_APP_BACKEND_URL}/api/categories/${editingCategory.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/categories`;

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (response.ok) {
        setNewCategory("");
        setShowCategoryForm(false);
        setEditingCategory(null);
        fetchCategories();
      }
    } catch (error) {
      console.error("Error adding/updating category:", error);
    }
  };

  const handleEditCategory = (category) => {
    setNewCategory(category.name);
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  const handleFileChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });  // Store the selected file
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    // Append the form fields to the formData
    for (const [key, value] of Object.entries(product)) {
      if (key === 'image' && value) {
        formData.append(key, value);  // Append the file
      } else {
        formData.append(key, value);  // Append other fields
      }
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products`, {
        method: 'POST',
        body: formData,  // Send the formData
      });
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };
  

  return (
    <div>
     <div className="p-6 max-w-lg  bg-white rounded-lg">
  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Categories</h2>

  <button
    onClick={() => {
      setShowCategoryForm(!showCategoryForm);
      setNewCategory("");
      setEditingCategory(null);
    }}
    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
  >
    {showCategoryForm ? "Cancel" : "Add Category"}
  </button>

  {showCategoryForm && (
    <form onSubmit={handleCategorySubmit} className="mt-4 flex gap-2">
      <input
        type="text"
        placeholder="Category Name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 w-full"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
      >
        {editingCategory ? "Update" : "Save"}
      </button>
    </form>
  )}

<ul className="mt-4">
  {categories.map((category) => (
    <li key={category.id} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg mb-2">
      <span className="text-gray-800">{category.name}</span>
      <div className="flex gap-2">
        <button
          onClick={() => handleEditCategory(category)}
          className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteCategory(category.id)}
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>
</div>

      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="discount_price"
          placeholder="Discount Price"
          value={product.discount_price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="in_stock"
          placeholder="In Stock"
          value={product.in_stock}
          onChange={handleChange}
        />
       <input
          type="file"
          name="image"  // This will handle the image upload
          onChange={handleFileChange}
        />
          {/* Category Selection */}
          <select name="category" value={product.category} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={product.brand}
          onChange={handleChange}
        />
        <input
          type="text"
          name="size"
          placeholder="Size"
          value={product.size}
          onChange={handleChange}
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={product.gender}
          onChange={handleChange}
        />
        <input
          type="number"
          name="product_category_id"
          placeholder="Product Category ID"
          value={product.product_category_id}
          onChange={handleChange}
        />
        <input
          type="text"
          name="categories"
          placeholder="Categories"
          value={product.categories}
          onChange={handleChange}
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
