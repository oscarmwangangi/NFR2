import logo from './logo.svg';
import './App.css';
import React, { useEffect } from "react";
import useApiData from './components/Api';  // Custom hook
import AdminPage from './components/Admin/Admin.js';  
import AdminChat from './components/Admin/AdminChat.js';  
import ForgotPassword from './components/Login/ForgotPassword.js';
import Login from './components/Login/Login.js';
import Register from './components/Login/Register.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import Nfr from "./components/User/Nfr.js";
import ProductDetail from "./components/User/ProductDetail.js";
import AllProductsPage from "./components/User/AllProductsPage"
import CategoryPage from "./components/User/CategoryPage"
import CategoryDetailPage from "./components/User/CategoryDetailPage"
import Header from "./components/User/Header/Header";
import SearchResults from "./components/User/Header/SearchResults";
import Orders from "./components/User/Header/Orders";
import Footer from "./components/User/Footer/Footer";
import Chat from "./components/User/Footer/Chat";
import Help from "./components/User/Footer/Help";
import CategoryDetail from "./components/User/CategoryDetail.js";
import { AuthProvider } from './components/User/AuthContext.js';
import Cart from './components/User/Cart/Cart.js';
import { CartProvider } from './components/User/Cart/CartContext.js'; // Adjust the path as needed
import Checkout from './components/User/Cart/Checkout.js';
import { BreadcrumbProvider } from './components/User/BreadcrumbContext'; // Import the BreadcrumbProvider
import { ToastContainer } from "react-toastify";

function App() {
  // const data = useApiData();  // Using your custom hook (if needed)

  return (
    <CartProvider>
      <BreadcrumbProvider> {/* Wrap your application with BreadcrumbProvider */}
      {/* <ToastContainer></ToastContainer> */}
        <Router>
          <Routes>
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/chat" element={<Chat />} />
        
            {/* Product detail page with Header, ProductDetail, Cart, and Footer */}
            <Route
              path="/product/:id"
              element={
                <>
                  <AuthProvider>
                    <Header />
                  </AuthProvider>
                  <ProductDetail />
                  <Footer />
                </>
              }
            />
            
            {/* Category detail page */}
            <Route
              path="/category/:categoryId"
              element={
                <>
                  <AuthProvider>
                    <Header />
                  </AuthProvider>
                  <CategoryDetailPage />
                  <Footer />
                </>
              }
            />
             <Route
              path="/categories/:categoryId"
              element={
                <>
                  <AuthProvider>
                    <Header />
                  </AuthProvider>
                  <CategoryPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/help"
              element={
                <>
                 <Header />
                    <Help />
                 <Footer />
                </>
              }
            />
            <Route
              path="/search"
              element={
                <>
                 <Header />
                    <SearchResults />
                 
                 
                  <Footer />
                </>
              }
            />
            <Route
              path="/orders"
              element={
                <>
                 <Header />
                    <Orders />
                 
                 
                  <Footer />
                </>
              }
            />
            <Route
              path="/cart"
              element={
                <>
                  <AuthProvider>
                    <Header />
                  </AuthProvider>
                  <Cart />
                  <Footer />
                </>
              }
            />

            {/* Default route (/) with Header, Nfr, and Footer */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Nfr />
                  <Footer />
                </>
              }
            />
            <Route
              path="/products" 
              element={
                <>
                  <Header />
                  <AllProductsPage />
                  <Footer />
                </>
              }
            />
             <Route
              path="/products/:categoryName"
              element={
                <>
                  <Header />
                  <CategoryPage />
                  <Footer />
                </>
              }
            />
            <Route
             path="/category/:categoryId"
              element={
                <>
                  <Header />
                 <CategoryDetailPage />
                  <Footer />
                </>
              }
            />
            {/* Admin page with Header, AdminPage, and Footer */}
            <Route
              path="/admin"
              element={
                <>
                  {/* <Header /> */}
                  <AdminPage />
                  {/* <Footer /> */}
                </>
              }
            />
            <Route
              path="/adminchat"
              element={
                <>
                  {/* <Header /> */}
                  <AdminChat />
                  {/* <Footer /> */}
                </>
              }
            />
          </Routes>
        </Router>
       
      </BreadcrumbProvider>
    </CartProvider>
  );
}

export default App;