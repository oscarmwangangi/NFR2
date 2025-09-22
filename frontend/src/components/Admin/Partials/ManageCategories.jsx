import React, { useState, useEffect } from "react";
import { PlusIcon, ChevronRightIcon, PencilIcon, TrashIcon, ChevronDownIcon } from './Icons';
import ManageBrands from './BrandManagement';

export const flattenCategories = (categories) => {
  return categories.reduce((acc, category) => {
    if (!category.parent_id) {
      acc.push({ id: category.id, name: category.name });
    }
    return acc;
  }, []);
};

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [parentCategoryId, setParentCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return setError("Category name cannot be empty");

    try {
      const url = editingCategory
        ? `${process.env.REACT_APP_BACKEND_URL}/api/categories/${editingCategory.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/categories`;

      const response = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategory,
          parent_id: parentCategoryId,
        }),
      });

      if (response.ok) {
        setNewCategory("");
        setParentCategoryId(null);
        setShowCategoryForm(false);
        setEditingCategory(null);
        fetchCategories();
      }
    } catch (err) {
      setError("Category operation failed");
    }
  };

  const handleEditCategory = (category) => {
    setNewCategory(category.name);
    setParentCategoryId(category.parent_id);
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    console.log('Deleting category with ID:', categoryId);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/categories/${categoryId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log("Category deleted successfully");
        fetchCategories(); // Refresh the category list
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  
    setCategoryToDelete(null);
  };
  

  const resetCategoryForm = () => {
    setNewCategory("");
    setParentCategoryId(null);
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const filteredCategories = categories
    .filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-black">
        <h2 className="text-2xl font-semibold mb-6">Category Management</h2>
        <div className="flex float-right items-center space-x-4">
          <input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md w-48 focus:outline-blue-500"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded-md focus:outline-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>
  {/* Header Section */}
  <div className="flex justify-between items-center mb-6">
    <button
      onClick={() => {
        resetCategoryForm();
        setShowCategoryForm(!showCategoryForm);
      }}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all flex items-center"
    >
      <PlusIcon className="w-5 h-5 mr-2" />
      {showCategoryForm ? "Cancel" : "Add Category"}
    </button>
    {/* {showCategoryForm && (
      <div className="flex items-center space-x-4">
        <input
          placeholder="Search categories..."
          className="p-2 border rounded-md w-48 focus:outline-blue-500"
        />
        <select className="p-2 border rounded-md focus:outline-blue-500">
          <option>Sort by Name</option>
          <option>Sort by Date</option>
        </select>
      </div>
    )} */}
  </div>
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h3>
              <form onSubmit={handleCategorySubmit}>
                {editingCategory || !parentCategoryId ? (
                  <select
                    value={parentCategoryId || ""}
                    onChange={(e) => setParentCategoryId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Top Level Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="mb-4 text-gray-600">
                    Subcategory of: {categories.find((c) => c.id === parentCategoryId)?.name || "Unknown"}
                  </p>
                )}
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category name"
                  className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    className="px-4 py-2 border rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    {editingCategory ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Parent Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <>
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center">
                        {category.subcategories?.length > 0 && (
                          <button onClick={() => toggleCategory(category.id)}>
                            {expandedCategories[category.id] ? (
                              <ChevronDownIcon className="w-4 h-4 mr-2 text-gray-600" />
                            ) : (
                              <ChevronRightIcon className="w-4 h-4 mr-2 text-gray-400" />
                            )}
                          </button>
                        )}
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {category.parentId ? 
                        categories.find(c => c.id === category.parentId)?.name : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setCategoryToDelete(category.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedCategories[category.id] && category.subcategories?.map((sub) => (
                    <tr key={sub.id} className="bg-gray-50 hover:bg-gray-100">
                      <td className="px-6 py-4 pl-12">{sub.name}</td>
                      <td className="px-6 py-4">{category.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCategory(sub)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setCategoryToDelete(sub.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {categoryToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <p className="mb-4">Are you sure you want to delete this category?</p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setCategoryToDelete(null)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDeleteCategory(categoryToDelete)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ManageBrands categories={categories} />
    </div>
  );
}

export default ManageCategories;