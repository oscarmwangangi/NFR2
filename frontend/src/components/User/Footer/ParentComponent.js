// import React, { useEffect, useState } from "react";
// import Chat from "./Chat";

// const ParentComponent = () => {
//   const [user, setUser] = useState(null);

//   // Check session on component mount
//   useEffect(() => {
//     checkSession();
//   }, []);

//   const checkSession = async () => {
//     try {
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/check-session`, {
//         method: "GET",
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//       const data = await res.json();
//       console.log("Session check response:", data); // Debugging
//       if (data.user) {
//         setUser(data.user);
//         console.log("User data set:", data.user); // Debugging
//       }
//     } catch (error) {
//       console.error("Session check failed:", error);
//     }
//   };

//   if (!user) {
//     return <div>Loading...</div>; // Show loading state while checking session
//   }

//   return (
//     <div>
//       <Chat userId={user.id} /> {/* Pass userId to Chat component */}
//     </div>
//   );
// };

// export default ParentComponent;