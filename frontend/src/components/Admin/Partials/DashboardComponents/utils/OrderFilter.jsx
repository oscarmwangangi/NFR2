// import { useMemo } from "react";

// export function useFilteredOrders(recentOrders, searchQuery, dateFilter) {
//   return useMemo(() => {
//     let filtered = [...recentOrders];

//     // Apply search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(order => 
//         order.order_id.toString().includes(query) ||
//         order.first_name.toLowerCase().includes(query) ||
//         order.second_name.toLowerCase().includes(query)
//       );
//     }

//     // Apply date filter
//     if (dateFilter !== 'all') {
//       const now = new Date();
//       filtered = filtered.filter(order => {
//         const orderDate = new Date(order.delivery_date);

//         switch(dateFilter) {
//           case 'day':
//             return orderDate.toDateString() === now.toDateString();
//           case 'week': {
//             const startOfWeek = new Date();
//             startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
//             return orderDate >= startOfWeek;
//           }
//           case 'month':
//             return orderDate.getMonth() === now.getMonth() &&
//                    orderDate.getFullYear() === now.getFullYear();
//           case 'year':
//             return orderDate.getFullYear() === now.getFullYear();
//           default:
//             return true;
//         }
//       });
//     }

//     return filtered;
//   }, [recentOrders, searchQuery, dateFilter]);
// }
