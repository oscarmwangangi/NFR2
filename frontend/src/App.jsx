import logo from './logo.svg';
import './App.css';
import React, { useEffect } from "react";
import useApiData from './components/Api.js';  // Custom hook
import AdminPage from './components/Admin/Admin.jsx';  
import AdminChat from './components/Admin/AdminChat.jsx';  
import AdminLoginPage from './components/Admin/AdminLogins/AdminLoginPage.jsx';  
import ForgotPassword from './components/Login/ForgotPassword.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Login/Register.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import Nfr from "./components/User/Nfr.jsx";
import ProductDetail from "./components/User/ProductDetail.jsx";
import AllProductsPage from "./components/User/AllProductsPage.jsx"
import CategoryPage from "./components/User/CategoryPage.jsx"
import CategoryDetailPage from "./components/User/CategoryDetailPage.jsx"
import Header from "./components/User/Header/Header.jsx";
import SearchResults from "./components/User/Header/SearchResults.jsx";
import Orders from "./components/User/Header/Orders.jsx";
import Footer from "./components/User/Footer/Footer.jsx";
import Term from "./components/User/Footer/Term.jsx";
import AboutUs from "./components/User/Footer/AboutUs.jsx";
import Chat from "./components/User/Footer/Chat.jsx";
import ReportAbuse from "./components/User/Footer/ReportAbuse.jsx";
import Help from "./components/User/Footer/Help.jsx";
import FAQs from "./components/User/Header/FAQS.jsx";
import CategoryDetail from "./components/User/CategoryDetail.jsx";
import { AuthProvider } from './components/User/AuthContext.jsx';
import Cart from './components/User/Cart/Cart.jsx';
import { CartProvider } from './components/User/Cart/CartContext.jsx'; // Adjust the path as needed
import Checkout from './components/User/Cart/Checkout.jsx';
import { BreadcrumbProvider } from './components/User/BreadcrumbContext.jsx'; // Import the BreadcrumbProvider
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
              path="/report"
              element={
                <>
                 <Header />
                    <ReportAbuse />
                 
                 
                  <Footer />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                 <Header />
                    <AboutUs />
                 
                 
                  <Footer />
                </>
              }
            />
            <Route
              path="/term"
              element={
                <>
                 <Header />
                    <Term />
                 
                 
                  <Footer />
                </>
              }
            />
            <Route
              path="/faqs"
              element={
                <>
                 <Header />
                    <FAQs />
                 
                 
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
            <Route
              path="admin/login"
              element={
                <>
                  {/* <Header /> */}
                  <AdminLoginPage />
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