// // CategoryDetail.js
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { calculateDiscountPercentage } from "./utils/DiscountUtlils.js"; // Import utility function

// function CategoryDetail() {
//   const { categoryName } = useParams();
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios
//       .get(
//         `${process.env.REACT_APP_BACKEND_URL}/api/user/products?category=${encodeURIComponent(categoryName)}`
//       )
//       .then((res) => {
//         setProducts(res.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching products for category:", err);
//       });
//   }, [categoryName]);

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-3xl font-bold mb-4">{categoryName}</h2>
//       <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//         {products.length > 0 ? (
//           products.map((product) => (
//             <Link
//             key={product.id}
//             to={`/product/${product.id}`}  // Navigate to product detail page
//            className="product-item group cursor-pointer p-4 rounded-lg hover:shadow-lg transition-all relative"
//           >
//                 {/* Discount Percentage Badge */}
//                 {product.discount_price && (
//                   <div className="absolute top-2 right-2 bg-red-500 bg-opacity-20 text-[#f5594b] text-sm font-semibold  px-2 py-1 rounded">
//                     -{calculateDiscountPercentage(product.price, product.discount_price)}%
//                   </div>
//                 )}
//             {/* <div key={product.id} className="border rounded-lg p-4 shadow-md"> */}
//               <img
//                 src={`${process.env.REACT_APP_BACKEND_URL}/${product.image_path}`}
//                 alt={product.name}
//                 className="w-full h-48 object-cover rounded-t-lg"
//               />
//               <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
//               <p className="text-sm text-gray-500">{product.description}</p>
//               <div className="mt-2">

//               {product.discount_price && (
//                   <span className="text-lg font-bold">
//                     {product.discount_price}
//                   </span>
//                 )}
//                 <span className="ml-2 text-sm text-red-500 line-through">Ksh {product.price}</span>
                
//               </div>
//             {/* </div> */}
//             </Link>
//           ))
//         ) : (
//           <p>No products found in this category.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CategoryDetail;
