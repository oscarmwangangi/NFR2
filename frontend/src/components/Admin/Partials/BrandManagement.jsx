import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from './Icons';

function ManageBrands({ categories }) {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState("");
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [error, setError] = useState("");

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/brands`);
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      setError("Failed to fetch brands.");
    }
  };

  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    if (!newBrand.trim()) return setError("Brand name cannot be empty");

    try {
      const url = editingBrand
        ? `${process.env.REACT_APP_BACKEND_URL}/api/brands/${editingBrand.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/brands`;

      const response = await fetch(url, {
        method: editingBrand ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBrand,
          category_id: selectedSubcategory?.id,
        }),
      });

      if (response.ok) {
        setNewBrand("");
        setShowBrandForm(false);
        setEditingBrand(null);
        fetchBrands();
      }
    } catch (err) {
      setError("Brand operation failed");
    }
  };

  const handleEditBrand = (brand) => {
    setNewBrand(brand.name);
    setEditingBrand(brand);
    setShowBrandForm(true);
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/brands/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBrands();
      }
    } catch (error) {
      setError("Failed to delete brand.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-black">
      <h2 className="text-2xl font-semibold mb-4">Brand Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) =>
              category.subcategories?.map((subcategory) => (
                <tr key={subcategory.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{subcategory.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {brands
                      .filter((brand) => brand.category_id === subcategory.id)
                      .map((brand) => (
                        <div key={brand.id} className="flex items-center space-x-2 mb-2">
                          <span>{brand.name}</span>
                          <button
                            onClick={() => handleEditBrand(brand)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBrand(brand.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedSubcategory(subcategory);
                        setShowBrandForm(true);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                      Add Brand
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showBrandForm && (
        <form onSubmit={handleBrandSubmit} className="mt-6 p-4 bg-gray-50 rounded-lg">
          {selectedSubcategory && (
            <p className="mb-2">Subcategory: {selectedSubcategory.name}</p>
          )}
          <input
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            placeholder="Brand name"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <div className="mt-4 space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              {editingBrand ? "Update Brand" : "Add Brand"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowBrandForm(false);
                setEditingBrand(null);
                setNewBrand("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ManageBrands;
