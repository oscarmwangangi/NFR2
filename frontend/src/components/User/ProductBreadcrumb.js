// ProductBreadcrumb.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProductBreadcrumb = ({ productName, productId, linkLast = false }) => {
    
  return (
    <nav className="p-4 text-sm text-gray-700">
      <ol className="list-reset flex">
        {/* Home link */}
        <li>
          <Link to="/">Home</Link>
        </li>

        {/* Product link */}
        <li className="flex items-center">
          <span className="mx-2"> &gt; </span>
          <Link to="/product">Product</Link>
        </li>

        {/* Final crumb: product name */}
        <li className="flex items-center">
          <span className="mx-2"> &gt; </span>
          {linkLast ? (
            <Link to={`/product/${productId}`}>{productName}</Link>
          ) : (
            <span>{productName}</span>
          )}
        </li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumb;
