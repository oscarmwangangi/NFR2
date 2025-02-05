import React, { useState } from 'react';

const EditProductModal = ({ product, setProducts, setEditingProduct }) => {
  const [formData, setFormData] = useState(product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setProducts(prev => prev.map(p => (p.id === formData.id ? formData : p)));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Product</h2>
        <form onSubmit={handleUpdate}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          <input type="text" name="price" value={formData.price} onChange={handleChange} />
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
