import React from 'react';

const ProductTable = ({ products, setEditingProduct, setDeletingProduct }) => {
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th>Image</th>
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id}>
            <td>{product.image_path ? <img src={product.image_path} alt={product.name} className="w-24 h-24 object-cover rounded-lg" /> : 'No Image'}</td>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td>{product.in_stock ? 'Yes' : 'No'}</td>
            <td>{product.category}</td>
            <td>
              <button className="bg-blue-500 text-white p-2 rounded" onClick={() => setEditingProduct(product)}>Edit</button>
              <button className="bg-red-500 text-white p-2 rounded" onClick={() => setDeletingProduct(product)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
