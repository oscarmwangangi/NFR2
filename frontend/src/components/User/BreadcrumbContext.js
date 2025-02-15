// BreadcrumbContext.js
import React, { createContext, useState, useCallback, useContext } from 'react';

const BreadcrumbContext = createContext();

export const BreadcrumbProvider = ({ children }) => {
  const [trail, setTrail] = useState([]);

  // Memoize addToTrail so its reference is stable
  const addToTrail = useCallback((product) => {
    setTrail((prevTrail) => {
      // Optionally, only update if the product isn't already in the trail
      if (prevTrail.find(item => item.id === product.id)) {
        return prevTrail;
      }
      return [...prevTrail, product];
    });
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ trail, addToTrail }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => useContext(BreadcrumbContext);
