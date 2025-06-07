// BreadcrumbTrail.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useBreadcrumb } from './BreadcrumbContext';

const BreadcrumbTrail = () => {
  const { trail } = useBreadcrumb();

  return (
    <nav className="p-4 text-sm font-sans  text-slate-500">
      <ol className="list-reset flex flex-wrap">
        {/* Static "Home" link */}
        <li>
          <Link to="/">Home</Link>
        </li>
 
        {/* Dynamic breadcrumb items from the trail */}
        {trail.map((item) => (
          <li key={item.id} className="flex items-center">
            <span className="mx-2">&gt;</span>
            <Link to={`/product/${item.id}`}>{item.name}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbTrail;
