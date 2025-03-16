import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { FaPaperPlane, FaUser, FaRegSmile, FaCheckDouble } from "react-icons/fa";
import { MdAdminPanelSettings, MdOutlineMarkChatUnread } from "react-icons/md";
import { ImSpinner8 } from "react-icons/im";
import { useNavigate } from "react-router-dom";

const AdminChat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [typing, setTyping] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState("25%");
  // Track unread counts for each chat (per-chat unread badge)
  const [unreadCounts, setUnreadCounts] = useState({});
  const dividerRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();

  // Initialize socket
  const socket = io(`${process.env.REACT_APP_BACKEND_URL}`, {
    withCredentials: true,
    autoConnect: true,
    transports: ["websocket", "polling"],
  });

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

  // Fetch active customer chats
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/chats`)
      .then((res) => {
        const uniqueChats = res.data.filter(
          (chat, index, self) =>
            index === self.findIndex((c) => c.id === chat.id)
        );
        setChats(uniqueChats);
      })
      .catch((err) => console.error("Error fetching chats:", err));
  }, []);

  // Fetch messages for the active chat and clear previous messages
  useEffect(() => {
    if (activeChat) {
      // Clear previous messages when switching chats
      setMessages([]);
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/messages?chat_id=${activeChat.id}`
        )
        .then((res) => {
          const sortedMessages = res.data.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
          // Format messages and add a 'read' property (default to false for customer messages)
          const formattedMessages = sortedMessages.map((msg) => ({
            ...msg,
            sender:
              String(msg.sender_id) === String(activeChat.id) ? "user" : "admin",
            read: String(msg.sender_id) === String(activeChat.id) ? false : true,
          }));
          setMessages(formattedMessages);
          // Reset unread count for this chat since it’s now active
          setUnreadCounts((prev) => ({ ...prev, [activeChat.id]: 0 }));
        })
        .catch((err) => {
          console.error(
            "Error fetching messages:",
            err.response?.data || err.message
          );
        });
    }
  }, [activeChat]);

  // Utility: Check if the container is scrolled near the bottom
  const isScrolledToBottom = () => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, clientHeight, scrollHeight } = messagesContainerRef.current;
    return scrollHeight - scrollTop <= clientHeight + 50;
  };

  // Listen for scroll events to mark messages as read when scrolled to bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolledToBottom() && activeChat) {
        // Mark all messages in the active chat as read
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            !msg.read && msg.sender !== "admin" ? { ...msg, read: true } : msg
          )
        );
        // Reset unread count for this chat
        setUnreadCounts((prev) => ({ ...prev, [activeChat.id]: 0 }));
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeChat]);

  // Socket listeners
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("Received message via socket:", data);
      if (activeChat && String(data.chatId) === String(activeChat.id)) {
        const container = messagesContainerRef.current;
        const nearBottom = container ? isScrolledToBottom() : true;
        const formattedMessage = {
          ...data,
          sender:
            String(data.sender_id) === String(activeChat.id) ? "user" : "admin",
          read: nearBottom, // mark as read if near bottom, otherwise unread
        };

        setMessages((prev) => {
          if (prev.some((msg) => msg.timestamp === data.timestamp)) {
            return prev;
          }
          return [...prev, formattedMessage];
        });

        // Update unread count if not near bottom
        if (!nearBottom) {
          setUnreadCounts((prev) => ({
            ...prev,
            [activeChat.id]: (prev[activeChat.id] || 0) + 1,
          }));
        }
      } else {
        // Message for a chat that is not active; update its unread count.
        setUnreadCounts((prev) => ({
          ...prev,
          [data.chatId]: (prev[data.chatId] || 0) + 1,
        }));
      }
    };

    socket.on("admin_receive_message", handleReceiveMessage);

    socket.on("user_typing", (senderId) => {
      if (activeChat && String(senderId) === String(activeChat.id)) {
        setTyping(true);
        setTimeout(() => setTyping(false), 2000);
      }
    });

    return () => {
      socket.off("admin_receive_message", handleReceiveMessage);
      socket.off("user_typing");
    };
  }, [activeChat]);

  // Send reply
  const sendReply = () => {
    if (reply.trim()) {
      const payload = {
        chatId: activeChat.id,
        message: reply,
        sender: "admin",
        timestamp: new Date().toISOString(),
      };
      socket.emit("admin_send_message", payload);
      setMessages((prev) => [...prev, { ...payload, read: true }]);
      setReply("");
      messagesContainerRef.current?.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll to first unread message when a chat is activated or messages update.
  useEffect(() => {
    if (activeChat && messages.length > 0) {
      const firstUnreadIndex = messages.findIndex(
        (msg) => msg.read === false && msg.sender !== "admin"
      );
      setTimeout(() => {
        if (firstUnreadIndex !== -1) {
          const firstUnreadElem = document.getElementById("first-unread");
          if (firstUnreadElem) {
            firstUnreadElem.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [activeChat, messages]);

  // Calculate a global unread count across all chats (WhatsApp-like header count)
  const totalUnread = chats.reduce(
    (acc, chat) => acc + (unreadCounts[chat.id] || chat.unread || 0),
    0
  );

  // Resizable left panel logic
  useEffect(() => {
    const divider = dividerRef.current;

    const handleMouseDown = (e) => {
      e.preventDefault();
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 50) {
        setLeftPanelWidth(`${newWidth}%`);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    divider.addEventListener("mousedown", handleMouseDown);
    return () => {
      divider.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Left Panel: Active Chats */}
      <div
        className="relative"
        style={{ width: leftPanelWidth, minWidth: "200px" }}
      >
        <div className="h-full border-r border-gray-200 bg-white">
          {/* Header with global unread count */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <MdOutlineMarkChatUnread className="mr-2 text-blue-500" />
              Active Chats
            </h2>
            {totalUnread > 0 && (
              <div className="bg-red-500 text-white text-xs px-2 rounded-full">
                {totalUnread}
              </div>
            )}
          </div>
          <div className="overflow-y-auto h-[calc(100vh-4rem)]">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center p-4 cursor-pointer transition-all ${
                  activeChat?.id === chat.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setActiveChat(chat)}
              >
                <div className="relative">
                  <FaUser className="w-10 h-10 p-2 rounded-full bg-blue-100 text-blue-600" />
                  {(unreadCounts[chat.id] || chat.unread) > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 rounded-full">
                      {unreadCounts[chat.id] || chat.unread}
                    </span>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      {chat.customerName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {chat.lastActivity &&
                      !isNaN(new Date(chat.lastActivity))
                        ? new Date(chat.lastActivity).toLocaleTimeString()
                        : "No activity"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage || "No messages yet..."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Draggable Divider */}
        <div
          ref={dividerRef}
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize bg-gray-200 hover:bg-blue-500 transition-colors"
        />
      </div>

      {/* Right Panel: Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center">
                <FaUser className="w-8 h-8 p-2 rounded-full bg-blue-100 text-blue-600" />
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {activeChat.customerName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Customer ID: {activeChat.id}
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-blue-50 to-transparent"
            >
              {messages.map((msg, index) => {
                const firstUnread =
                  !msg.read &&
                  msg.sender !== "admin" &&
                  messages.findIndex((m) => !m.read && m.sender !== "admin") === index;
                return (
                  <div
                    key={`${msg.timestamp}-${msg.sender}-${index}`}
                    id={firstUnread ? "first-unread" : undefined}
                    className={`flex ${
                      msg.sender === "admin" ? "justify-end" : "justify-start"
                    } mb-4`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl p-3 relative ${
                        msg.sender === "admin"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800 shadow-md"
                      }`}
                    >
                      <div className="flex items-start">
                        {msg.sender !== "admin" && (
                          <MdAdminPanelSettings className="text-purple-500 text-xl mr-2 mt-1" />
                        )}
                        <p className="break-words">{msg.message}</p>
                        {msg.sender === "admin" && (
                          <FaCheckDouble className="ml-2 text-xs mt-1 text-blue-200" />
                        )}
                      </div>
                      <span className="bottom-2 right-2 text-xs opacity-70 mt-1">
                        {msg.timestamp && !isNaN(new Date(msg.timestamp))
                          ? new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Just now"}
                      </span>
                    </div>
                  </div>
                );
              })}
              {typing && (
                <div className="flex items-center text-gray-500 italic ml-4">
                  <ImSpinner8 className="animate-spin mr-2" />
                  Customer is typing...
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="text-blue-500 hover:text-blue-600">
                  <FaRegSmile className="text-2xl" />
                </button>
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyPress={() =>
                    socket.emit("admin_typing", { chatId: activeChat.id })
                  }
                  className="flex-1 border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Type your reply..."
                />
                <button
                  onClick={sendReply}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-2xl transition-all duration-200 transform hover:scale-105"
                >
                  <FaPaperPlane className="text-xl" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
            <MdOutlineMarkChatUnread className="text-6xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              Select a chat to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
