import react from "react";
// import Header from "./Header/Header"
import Carousel from "./Carousel"
import Products from "./Products"
import Category from "./Category"
import Top_Selling from "./Top_Selling"
import Black_Friday from "./Black_Friday"
import New_Arrival from "./New_Arrival"
import Footer from "./Footer/Footer"
import ProductBreadcrumb from "./ProductBreadcrumb"
import BreadcrumbTrail from './BreadcrumbTrail';
function Nfr(){
    return(
        <>
        {/* <h1>hi</h1> */}
        {/* <Header /> */}
      
        <Carousel />
        <Products />
        
        <Category />
        <Top_Selling />
        <Black_Friday />
        <New_Arrival />
        {/* <Footer /> */}
        </>
    )
}export default Nfr;