// CartContext.js
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  // --- Existing session-checking and cart-loading logic ---

  const checkSession = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/check-session", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      if (data.user) setUser(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem("user");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUser(parsedData.user ? parsedData.user : parsedData);
    } else {
      checkSession();
    }
  }, []);

  const loadLocalCart = () => {
    const localCart = localStorage.getItem("cart");
    if (localCart) {
      setCart(JSON.parse(localCart));
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.cart) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const syncLocalCart = async () => {
    const localCart = localStorage.getItem("cart");
    if (localCart) {
      const cartData = JSON.parse(localCart);
      try {
        const res = await fetch("http://localhost:5000/api/cart/sync", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: cartData }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.removeItem("cart");
          fetchCart();
        } else {
          console.error("Cart sync error:", data.message);
        }
      } catch (error) {
        console.error("Error syncing cart:", error);
      }
    } else {
      fetchCart();
    }
  };

  useEffect(() => {
    if (user) {
      syncLocalCart();
    } else {
      loadLocalCart();
    }
  }, [user]);

  // --- Update Quantity Function that also updates the DB ---

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    // Optimistically update local state
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      if (!user) {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }
      return updatedCart;
    });
  
    // If the user is logged in, update in the DB
    if (user) {
      try {
        const res = await fetch(`http://localhost:5000/api/cart/update`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_id: itemId, quantity: newQuantity }),
        });
  
        if (!res.ok) {
          console.error("Failed to update cart item quantity in the DB");
          // Optionally re-sync the cart from the backend:
          fetchCart();
        } else {
          // Optionally re-fetch the cart to confirm update
          fetchCart();
        }
      } catch (error) {
        console.error("Error updating cart item in DB:", error);
        // Optionally, revert the optimistic update or notify the user
      }
    }
  };
  
  // --- Function to add an item to the cart ---

  const addToCart = async (product, quantity) => {
    if (user) {
      try {
        const res = await fetch("http://localhost:5000/api/cart/sync", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: [{ id: product.id, quantity }] }),
        });
        const data = await res.json();
        if (res.ok) {
          fetchCart();
        } else {
          console.error("Error adding to cart:", data.message);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        let updatedCart;
        if (existingItem) {
          updatedCart = prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          updatedCart = [...prevCart, { ...product, quantity }];
        }
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateCartItemQuantity, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
