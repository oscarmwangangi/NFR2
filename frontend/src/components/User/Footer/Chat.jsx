import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { FaPaperPlane, FaUserCircle, FaRegSmile } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Initialize socket
  const socket = io(`${process.env.REACT_APP_BACKEND_URL}`, {
    withCredentials: true,
    autoConnect: true,
    transports: ['websocket', 'polling']
  });

  // Connection status state
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      console.log("Socket connected!");
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log("Socket disconnected!");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // Check if user is logged in
  const checkSession = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/check-session`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      if (data.user) {
        setUserInfo({
          id: data.user.id,
          first_name: data.user.first_name,
          second_name: data.user.second_name,
          email: data.user.email,
          role: data.user.role,
        });
        // Fetch messages for this user
        fetchMessages(data.user.id);
      } else {
        setTimeout(() => {
          window.location.reload();
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Error checking session:", error);
      setTimeout(() => {
        window.location.reload();
        navigate("/login");
      }, 3000);
    }
  };

  // Fetch messages and add a 'read' flag based on sender
  const fetchMessages = async (senderId) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/messages?sender_id=${senderId}`
      );
      // Assume messages from admin are unread (read: false)
      const updatedMessages = res.data.map((msg) => ({
        ...msg,
        // Mark your own messages as read, others as unread
        read: msg.sender_id === senderId ? true : false,
      }));
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Recalculate unread count when messages update
  useEffect(() => {
    if (userInfo) {
      const count = messages.filter(
        (msg) => !msg.read && msg.sender_id !== userInfo.id
      ).length;
      setUnreadCount(count);
    }
  }, [messages, userInfo]);

  // Mark messages as read when user scrolls to the bottom
  const markMessagesAsRead = () => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (!msg.read && msg.sender_id !== userInfo.id) {
          return { ...msg, read: true };
        }
        return msg;
      })
    );
  };

  // Scroll handler to check if at the bottom of the chat
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      // If scrolled close to bottom (10px tolerance)
      const isAtBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
      if (isAtBottom) {
        markMessagesAsRead();
      }
    }
  };

  // Scroll to bottom helper function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Run session check on page load
  useEffect(() => {
    checkSession();
  }, []);

  // Handle socket connection and events
  useEffect(() => {
    if (userInfo) {
      socket.emit("user_online", userInfo.id);

      // Listen for incoming messages from admin
      socket.on("admin_receive_message", (data) => {

        console.log("Received message from admin:", data);
        // Append new message with read flag set to false and include a timestamp (if not provided)
        setMessages((prev) => [
          ...prev,
          { ...data, read: false, timestamp: data.timestamp || new Date().toISOString() },
        ]);
      });

      // Listen for typing notifications from admin
      socket.on("user_typing", () => {
        setTyping(true);
        setTimeout(() => setTyping(false), 2000);
      });

      return () => {
        socket.off("admin_receive_message");
        socket.off("user_typing");
      };
    }
  }, [userInfo]);

  // Send message to admin with a timestamp
  const sendMessage = () => {
    if (!userInfo) {
      console.error("User not logged in.");
      return;
    }
    if (message.trim()) {
      const msgData = {
        sender_id: userInfo.id,
        message,
        timestamp: new Date().toISOString(),
      };

      console.log("Sending message:", msgData);
      socket.emit("send_message", msgData);
      socket.on("connect", () => {
        console.log("Connected to socket server with id:", socket.id);
      });

      // Add the message to the local state immediately and mark it as read
      setMessages((prev) => [...prev, { ...msgData, read: true }]);
      setMessage("");
      // Optionally, scroll to the bottom after sending
      scrollToBottom();
    }
  };

  // If user is not logged in, show loading screen
  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin mb-4">
          <svg
            className="w-12 h-12 text-[#8FBC8F]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
            />
          </svg>
        </div>
        <p className="text-gray-600 text-lg mb-4">
          You are not logged in. Redirecting...
        </p>
        <p className="text-gray-500 text-sm">
          If you are not redirected,{" "}
          <a href="/login" className="text-blue-500 hover:underline ml-1">
            click here
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex items-center relative z-10">
        <FaUserCircle className="text-3xl mr-3" />
        <div>
          <h2 className="text-xl font-bold">
            {userInfo?.first_name} {userInfo?.second_name}
          </h2>
          <p className="text-sm opacity-90">{userInfo?.role} account</p>
        </div>
        {/* Display unread messages counter in the header */}
        {unreadCount > 0 && (
          <div className="ml-auto bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 overflow-auto p-4 space-y-3 relative z-10"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender_id === userInfo.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md p-3 rounded-2xl flex flex-col ${
                msg.sender_id === userInfo.id
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 shadow-md"
              }`}
            >
              <div className="flex items-center">
                {msg.sender_id !== userInfo.id && (
                  <MdAdminPanelSettings className="text-purple-500 text-xl mr-2 mt-1" />
                )}
                <p className="break-words">{msg.message}</p>
                {msg.sender_id === userInfo.id && (
                  <FaUserCircle className="text-blue-200 ml-2 mt-1" />
                )}
              </div>
              {/* Display timestamp below the message */}
              {msg.timestamp && (
                <span className="text-xs  mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {typing && (
          <div className="flex items-center text-gray-500 italic">
            <ImSpinner8 className="animate-spin mr-2" />
            Admin is typing...
          </div>
        )}
      </div>

      {/* Optional: New Messages Button */}
      {unreadCount > 0 && (
        <button
          className="fixed bottom-20 right-10 bg-blue-500 text-white p-2 rounded-full shadow-lg"
          onClick={scrollToBottom}
        >
          {unreadCount} New Message{unreadCount > 1 ? "s" : ""}
        </button>
      )}

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
            onKeyPress={() => socket.emit("typing", { sender_id: userInfo.id })}
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
