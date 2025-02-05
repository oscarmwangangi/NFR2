import React from 'react';

const DeleteProductModal = ({ product, onDelete, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Are you sure you want to delete {product.name}?</h2>
        <button onClick={() => onDelete(product.id)} className="bg-red-500">Yes</button>
        <button onClick={onClose} className="bg-gray-500">No</button>
      </div>
    </div>
  );
};

export default DeleteProductModal;
