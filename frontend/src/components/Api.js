// import { useState, useEffect } from 'react';

// function useApiData() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     // Fetch data from the backend (Express API)
//     fetch(`${process.env.REACT_APP_API_URL}/data`)
//       .then((response) => response.json())
//       .then((data) => setData(data.message))
//       .catch((error) => console.error('Error fetching data:', error));
//   }, []);

//   return data;
// }

// export default useApiData;
