import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RecentViewed() {
  const [recentProducts, setRecentProducts] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch recent viewed products from the backend
  const fetchRecentViewed = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/recent-viewed", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.recentViewed) {
        setRecentProducts(data.recentViewed);
      }
    } catch (error) {
      console.error("Error fetching recent viewed:", error);
    }
  };

  // Sync localStorage recent viewed items to the backend
  const syncLocalRecentViewed = async (localData) => {
    try {
      const res = await fetch("http://localhost:5000/api/recent-viewed/sync", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recentViewed: localData }),
      });

      if (res.ok) {
        localStorage.removeItem("recentViewed");
        await fetchRecentViewed();
      } else {
        console.error("Error syncing recent viewed:", await res.json());
      }
    } catch (error) {
      console.error("Error syncing recent viewed:", error);
    }
  };

  // Check if a user is logged in (using similar logic as Header)
  const checkUserSession = async () => {
    // First, check sessionStorage
    const storedData = sessionStorage.getItem("user");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("Retrieved user data from sessionStorage:", parsedData);
      setUser(parsedData.user);
      return parsedData.user;
    }

    // Try manual login session endpoint
    try {
      const resManual = await fetch("http://localhost:5000/api/check-session-manual", {
        method: "GET",
        credentials: "include",
      });
      if (resManual.ok) {
        const dataManual = await resManual.json();
        if (dataManual.user) {
          setUser(dataManual.user);
          sessionStorage.setItem("user", JSON.stringify({ user: dataManual.user }));
          return dataManual.user;
        }
      }
    } catch (error) {
      console.error("Manual session error:", error);
    }

    // Fallback to Google Auth session endpoint
    try {
      const res = await fetch("http://localhost:5000/api/check-session", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          sessionStorage.setItem("user", JSON.stringify({ user: data.user }));
          return data.user;
        }
      }
    } catch (error) {
      console.error("Google Auth session error:", error);
    }
    return null;
  };

  useEffect(() => {
    const initialize = async () => {
      const loggedInUser = await checkUserSession();
      if (loggedInUser) {
        // If logged in, check for recent viewed items in localStorage to sync them to the DB
        const localData = localStorage.getItem("recentViewed");
        if (localData) {
          await syncLocalRecentViewed(JSON.parse(localData));
        } else {
          await fetchRecentViewed();
        }
      } else {
        // If no user session, fallback to localStorage
        const stored = localStorage.getItem("recentViewed");
        if (stored) {
          setRecentProducts(JSON.parse(stored));
        }
      }
    };

    initialize();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">Recently Viewed Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recentProducts.length > 0 ? (
          recentProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="recent-product-item group cursor-pointer p-4 rounded-lg hover:shadow-lg transition-all"
            >
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${product.image_path}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h3 className="text-sm font-semibold text-[#313133] truncate-text">
                {product.name}
              </h3>
              <div className="mt-2 flex flex-col">
                <span className="text-xl font-bold text-[#313133]">
                  Ksh {product.price}
                </span>
                {product.discount_price && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.discount_price}
                  </span>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p>No recently viewed products.</p>
        )}
      </div>
    </div>
  );
}

export default RecentViewed;
