import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { FaPaperPlane, FaUserCircle, FaRegSmile } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);

const Chat = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);

  // Default receiver ID for admin
  const adminId = 0;

  // Check if user is logged in
  const checkSession = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/check-session", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      if (data.user) {
        setUserInfo({
          id: data.user.id, // User ID from session
          first_name: data.user.first_name,
          second_name: data.user.second_name,
          email: data.user.email,
          role: data.user.role, // Add role to user info
        });

        // Fetch messages between the user and admin
        fetchMessages(data.user.id, adminId);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  };

  // Fetch messages between the user and admin
  const fetchMessages = async (senderId, receiverId) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/messages?sender_id=${senderId}&receiver_id=${receiverId}`
      );
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Run session check on page load
  useEffect(() => {
    checkSession();
  }, []);

  // Handle socket connection
  useEffect(() => {
    if (userInfo) {
      socket.emit("user_online", userInfo.id);

      // Listen for incoming messages from admin
      socket.on("receive_message", (data) => {
        if (data.sender_id === adminId) {
          setMessages((prev) => [...prev, data]);
        }
      });

      // Listen for typing notifications from admin
      socket.on("user_typing", (sender) => {
        if (sender === adminId) setTyping(true);
      });

      // Cleanup socket listeners
      return () => {
        socket.off("receive_message");
        socket.off("user_typing");
      };
    }
  }, [userInfo]);

  // Send message to admin
  const sendMessage = () => {
    if (!userInfo) {
      console.error("User not logged in.");
      return;
    }

    if (message.trim()) {
      const msgData = {
        sender_id: userInfo.id,
        receiver_id: adminId, // Always send to admin
        message,
      };

      console.log("Sending message:", msgData); // Log the payload
      socket.emit("send_message", msgData);

      // Add the message to the local state
      setMessages((prev) => [...prev, { sender_id: userInfo.id, message }]);
      setMessage("");
    }
  };

  // If user is not logged in, redirect to login
  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">You are not logged in. Redirecting...</p>
      </div>
    );
  }


    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-xl animate-float"></div>
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-blue-200 rounded-full opacity-15 blur-2xl animate-float-delayed"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 opacity-10 blur-lg rotate-45 animate-float"></div>
        <div className="absolute -bottom-32 right-20 w-72 h-72 bg-blue-100 rounded-3xl opacity-15 blur-xl rotate-12 animate-float-delayed"></div>
  
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex items-center relative z-10">
          <FaUserCircle className="text-3xl mr-3" />
          <div>
            <h2 className="text-xl font-bold">{userInfo?.first_name} {userInfo?.second_name}</h2>
            <p className="text-sm opacity-90">{userInfo?.role} account</p>
          </div>
        </div>
  
        {/* Chat Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-3 relative z-10">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender_id === userInfo.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md p-3 rounded-2xl flex items-start ${
                  msg.sender_id === userInfo.id 
                    ? "bg-blue-500 text-white" 
                    : "bg-white text-gray-800 shadow-md"
                }`}
              >
                {msg.sender_id === adminId && (
                  <MdAdminPanelSettings className="text-purple-500 text-xl mr-2 mt-1" />
                )}
                <p className="break-words">{msg.message}</p>
                {msg.sender_id === userInfo.id && (
                  <FaUserCircle className="text-blue-200 ml-2 mt-1" />
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-center text-gray-500 italic">
              <ImSpinner8 className="animate-spin mr-2" />
              Admin is typing...
            </div>
          )}
        </div>
  
        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-100 relative z-10">
          <div className="flex items-center space-x-2">
            <button className="text-blue-500 hover:text-blue-600">
              <FaRegSmile className="text-2xl" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={() =>
                socket.emit("typing", { sender_id: userInfo.id, receiver_id: adminId })
              }
              className="flex-1 border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-2xl transition-all duration-200 transform hover:scale-105"
            >
              <FaPaperPlane className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  


export default Chat;