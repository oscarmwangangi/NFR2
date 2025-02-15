// Breadcrumb.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = ({ lastCrumb, linkLast = false }) => {
  const location = useLocation();
  // Split the pathname into segments (filtering out any empty strings)
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="p-4 text-sm text-gray-700">
      <ol className="list-reset flex">
        {/* Always show Home */}
        <li>
          <Link to="/">Home</Link>
        </li>
        {pathSegments.map((seg, index) => {
          // Build the URL for this breadcrumb link
          const routeTo = `/${pathSegments.slice(0, index + 1).join('/')}`;
          // Determine if this is the last segment
          const isLast = index === pathSegments.length - 1;
          // Use the lastCrumb prop for the last segment if provided
          let crumbText = seg.charAt(0).toUpperCase() + seg.slice(1);
          if (isLast && lastCrumb) {
            crumbText = lastCrumb;
          }
          return (
            <li key={index} className="flex items-center">
              <span className="mx-2">{'>'}</span>
              {/* If it is the last segment and linkLast is false, render as text */}
              {isLast && !linkLast ? (
                <span>{crumbText}</span>
              ) : (
                <Link to={routeTo}>{crumbText}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
