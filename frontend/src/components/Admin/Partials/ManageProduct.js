


import React, { useState, useEffect } from 'react';

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    discount_price: '',
    in_stock: true,
    image: null,
    category: '',
    brand: '',
    size: '',
    gender: '',
  });

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToUpdate, setProductToUpdate] = useState(null);

 

  
  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);
  
  const handleDelete = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/${id}`, {
        method: 'DELETE',
      });
      setProducts(products.filter(product => product.id !== id));
      setModalMessage('Product deleted successfully!');
    } catch (error) {
      setModalMessage('Error deleting product');
    }
    setShowDeleteModal(false); // Close the modal after action
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discount_price: product.discount_price,
      in_stock: product.in_stock,
      image: null,
      category: product.category,
      brand: product.brand,
      size: product.size,
      gender: product.gender,
    });
    setShowUpdateModal(true); // Open the update modal
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedFormData = new FormData();
    updatedFormData.append('id', formData.id);  // Ensure the ID is appended
    updatedFormData.append('name', formData.name);
    updatedFormData.append('description', formData.description);
    updatedFormData.append('price', formData.price);
    updatedFormData.append('discount_price', formData.discount_price);
    updatedFormData.append('in_stock', formData.in_stock ? 1 : 0);
    updatedFormData.append('category', formData.category);
    updatedFormData.append('brand', formData.brand);
    updatedFormData.append('size', formData.size);
    updatedFormData.append('gender', formData.gender);
    if (formData.image) {
        updatedFormData.append('image', formData.image);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/${formData.id}`, {
            method: 'PUT',
            body: updatedFormData,
        });
        if (response.ok) {
            setModalMessage('Product updated successfully!');
        } else {
            setModalMessage('Failed to update product');
        }
    } catch (error) {
        setModalMessage('Error updating product');
    }
    setShowUpdateModal(false);
};


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prevState => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <div>
      


      <h2>Manage Products</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th>Image</th>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Discount Price</th>
            <th>In Stock</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Size</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                {product.image_path ? (
                  <img
                    src={product.image_path}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.discount_price}</td>
              <td>{product.in_stock ? 'Yes' : 'No'}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>{product.size}</td>
              <td>{product.gender}</td>
              <td>
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={() => {
                    setProductToDelete(product);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2>Edit Product</h2>
            <form onSubmit={handleUpdate}>
              <label>ID:</label>
              <input type="text" name="id" value={formData.id} readOnly className="border p-2 w-full" />
              <label>Name:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 w-full" />
              <label>Description:</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="border p-2 w-full"></textarea>
              <label>Price:</label>
              <input type="text" name="price" value={formData.price} onChange={handleChange} className="border p-2 w-full" />
              <label>Discount Price:</label>
              <input type="text" name="discount_price" value={formData.discount_price} onChange={handleChange} className="border p-2 w-full" />
              <label>In Stock:</label>
              <input type="checkbox" name="in_stock" checked={formData.in_stock} onChange={handleChange} />
              <label>Image:</label>
              <input type="file" onChange={handleChange} name="image" accept="image/*" />
              <label>Category:</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} className="border p-2 w-full" />
              <label>Brand:</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="border p-2 w-full" />
              <label>Size:</label>
              <input type="text" name="size" value={formData.size} onChange={handleChange} className="border p-2 w-full" />
              <label>Gender:</label>
              <input type="text" name="gender" value={formData.gender} onChange={handleChange} className="border p-2 w-full" />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4 w-full">Update</button>
              <button type="button" onClick={() => setShowUpdateModal(false)} className="bg-gray-500 text-white p-2 rounded mt-2 w-full">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2>Are you sure you want to delete this product?</h2>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleDelete(productToDelete.id)}
                className="bg-red-500 text-white p-2 rounded w-24"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white p-2 rounded w-24"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {modalMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg">
          {modalMessage}
        </div>
      )}
    </div>
  );
}

export default ManageProduct;
