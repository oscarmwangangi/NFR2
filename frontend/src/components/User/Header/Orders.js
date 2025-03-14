import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaBox, FaMoneyBill, FaCalendarCheck, FaSpinner, FaSmile,
  FaTruck, FaCheckCircle, FaClock, FaTimesCircle,
  FaFilter, FaArrowUp, FaArrowDown, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import { GiShoppingBag } from "react-icons/gi";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting logic
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  const checkSession = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/check-session", {
        withCredentials: true,
      });
      return response.data.user;
    } catch (error) {
      setError("You are not authenticated. Please log in.");
      return null;
    }
  };

  const fetchOrders = async () => {
    try {
      const user = await checkSession();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/orders", {
        withCredentials: true,
      });
      setOrders(response.data.orders);
      setCurrentPage(1);
    } catch (error) {
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
        <GiShoppingBag className="text-purple-600 text-4xl" />
        Your Orders
      </h1>

      {/* Sorting Controls */}
      <div className="flex gap-4 mb-6 items-center">
        <span className="text-gray-600 flex items-center gap-2">
          <FaFilter /> Filter by:
        </span>
        <button 
          onClick={() => setSortBy('newest')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            sortBy === 'newest' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <FaArrowUp /> Newest
        </button>
        <button 
          onClick={() => setSortBy('oldest')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            sortBy === 'oldest' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <FaArrowDown /> Oldest
        </button>
      </div>

      {/* Order List */}
      {error ? (
        <div className="max-w-2xl mx-auto bg-red-50 p-4 rounded-xl flex items-center gap-3 text-red-700">
          <FaTimesCircle className="text-xl" />
          <p className="font-medium">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="text-center text-gray-600 flex flex-col items-center gap-3 mt-8">
          <FaSpinner className="text-4xl text-purple-600 animate-spin" />
          <p className="text-lg font-medium">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-600 flex flex-col items-center gap-4 mt-8">
          <FaSmile className="text-6xl text-purple-500" />
          <p className="text-xl font-medium">No orders found! Let's go shopping!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentOrders.map((order) => {
              let cartItems = [];
              try {
                cartItems = order.cart_items ? JSON.parse(order.cart_items) : [];
              } catch (error) {
                console.error("Error parsing cart items:", error);
              }

              return (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FaBox className="text-purple-600" />
                      Order ID: 
                      <span className="text-gray-600 font-mono">{order.order_id}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaMoneyBill className="text-green-500" />
                        <span className="font-medium">Total:</span>
                        <span className="text-green-600">KSh {order.total}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <FaCalendarCheck className="text-blue-500" />
                        <span className="font-medium">Delivery:</span>
                        <span>{order.delivery_date}</span>
                      </div>
                    </div>
                  </div>
  
                  <div className="mb-4">
                    <p className="text-gray-700 flex items-center gap-2 mb-3">
                      <FaTruck className="text-xl text-purple-500" />
                      <strong>Status:</strong>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status === "Delivered" ? (
                          <FaCheckCircle />
                        ) : order.status === "Pending" ? (
                          <FaClock />
                        ) : (
                          <FaTimesCircle />
                        )}
                        {order.status}
                      </span>
                    </p>
                  </div>
  
                  <div>
                    <strong className="text-gray-800 flex items-center gap-2 mb-3">
                      <GiShoppingBag className="text-purple-600" />
                      Cart Items:
                    </strong>
                    {cartItems.length > 0 ? (
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        {cartItems.map((item, index) => (
                          <div 
                            key={index} 
                            className="flex bg-gray-50 rounded-lg p-3 border border-gray-100"
                          >
                            <img
                              src={`${process.env.REACT_APP_BACKEND_URL}/${item.image_path}`}
                              alt={item.name}
                              className="w-20 h-20 object-contain bg-white rounded-lg border p-1"
                            />
                            <div className="ml-3 flex flex-col justify-center">
                              <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                KSh {item.price} × {item.quantity}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Subtotal: KSh {item.price * item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 mt-2">No items found</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        {/* )}
      </div> */}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 flex items-center gap-1"
              >
                <FaChevronLeft /> Previous
              </button>

              {Array.from({ length: Math.min(2, totalPages) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {totalPages > 2 && (
                <>
                  <span className="px-2 text-gray-600">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 flex items-center gap-1"
              >
                Next <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Orders;