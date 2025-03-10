// import React, { useState, useEffect } from "react";
// import { PencilIcon, TrashIcon, ChevronRightIcon, ChevronDownIcon } from './Icons';

// const CategoryManagement = ({ categories, fetchCategories, handleEditCategory, handleDeleteCategory, expandedCategories, toggleCategory, searchQuery, setSearchQuery, sortBy, setSortBy }) => {
//   const filteredCategories = categories
//     .filter((category) =>
//       category.name.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     .sort((a, b) => {
//       if (sortBy === "name") {
//         return a.name.localeCompare(b.name);
//       } else if (sortBy === "date") {
//         return new Date(a.createdAt) - new Date(b.createdAt);
//       }
//       return 0;
//     });

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//       <h2 className="text-2xl font-semibold mb-6">Category Management</h2>

//       <div className="flex items-center space-x-4">
//         <input
//           placeholder="Search categories..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="p-2 border rounded-md w-48 focus:outline-blue-500"
//         />

//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//           className="p-2 border rounded-md focus:outline-blue-500"
//         >
//           <option value="name">Sort by Name</option>
//           <option value="date">Sort by Date</option>
//         </select>
//       </div>

//       <div className="overflow-x-auto rounded-lg border">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category Name</th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Parent Category</th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {filteredCategories.map((category) => (
//               <>
//                 <tr key={category.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 font-medium">
//                     <div className="flex items-center">
//                       {category.subcategories?.length > 0 && (
//                         <button onClick={() => toggleCategory(category.id)}>
//                           {expandedCategories[category.id] ? (
//                             <ChevronDownIcon className="w-4 h-4 mr-2 text-gray-600" />
//                           ) : (
//                             <ChevronRightIcon className="w-4 h-4 mr-2 text-gray-400" />
//                           )}
//                         </button>
//                       )}
//                       {category.name}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-gray-500">
//                     {category.parentId ? 
//                       categories.find(c => c.id === category.parentId)?.name : '—'}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleEditCategory(category)}
//                         className="text-blue-500 hover:text-blue-700"
//                       >
//                         <PencilIcon className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteCategory(category.id)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <TrashIcon className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//                 {expandedCategories[category.id] && category.subcategories?.map((sub) => (
//                   <tr key={sub.id} className="bg-gray-50 hover:bg-gray-100">
//                     <td className="px-6 py-4 pl-12">{sub.name}</td>
//                     <td className="px-6 py-4">{category.name}</td>
//                     <td className="px-6 py-4">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleEditCategory(sub)}
//                           className="text-blue-500 hover:text-blue-700"
//                         >
//                           <PencilIcon className="w-5 h-5" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteCategory(sub.id)}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           <TrashIcon className="w-5 h-5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CategoryManagement;