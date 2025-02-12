import logo from './logo.svg';
import './App.css';
import useApiData from './components/Api';  // Import the custom hook
import AdminPage from './components/Admin/Admin.js';  // Import the AdminPage component
import ForgotPassword from './components/Login/ForgotPassword.js'
import Login from './components/Login/Login.js'
import Register from './components/Login/Register.js'
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import necessary components
import Nfr from "./components/User/Nfr.js"
import ProductDetail from "./components/User/ProductDetail.js"
import Header from "./components/User/Header/Header"
import Footer from "./components/User/Footer"
import CategoryDetail from "./components/User/CategoryDetail.js"
import { AuthProvider } from './components/User/AuthContext.js';
function App() {
  const data = useApiData();  // Call the custom hook
  
  return (
    <Router>
      <Routes>
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Product detail page with Header and Footer */}
        <Route path="/product/:id" element={
          <>
           <AuthProvider>
            <Header />
          </AuthProvider>
            <ProductDetail />
            <Footer />
          </>
        } />
        
        <Route path="/category/:categoryName" element={
          <>
          <AuthProvider>
             <Header />
         </AuthProvider>
            <CategoryDetail />
            <Footer />
          </>
        } />

        {/* Default route (/) to render Nfr with Header and Footer */}
        <Route path="/" element={
          <>
            <Header />
            <Nfr />
            <Footer />
          </>
        } />
        
        {/* Admin page with Header and Footer */}
        <Route path="/admin" element={
          <>
            <Header />
            <AdminPage />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
