import db from '../../config/db.js';

let onlineUsers = {};
let io = null;
let ADMIN_ID = null;

// Fetch the admin ID dynamically (supports both "admin" and "topadmin")
const fetchAdminId = async () => {
  try {
    const [results] = await db.execute(
      "SELECT id FROM users WHERE role IN (?, ?) LIMIT 1",
      ["admin", "topadmin"]
    );
    if (results.length > 0) {
      console.log("Admin ID found:", results[0].id);
      return results[0].id;
    } else {
      console.error("No admin user found with role 'admin' or 'topadmin'.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching admin ID:", error);
    return null;
  }
};

const setSocketIO = async (socketIO) => {
  io = socketIO;

  // Test database connection first
  try {
    await db.query("SELECT 1+1 AS solution");
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection error:", err);
    return;
  }

  // Fetch and store ADMIN_ID
  try {
    ADMIN_ID = await fetchAdminId();
    if (!ADMIN_ID) {
      console.error("Admin ID not found. Socket IO initialization aborted.");
      return;
    }
    console.log("Admin ID initialized:", ADMIN_ID);
  } catch (err) {
    console.error("Failed to fetch admin ID:", err);
    return;
  }

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Mark user as online
    socket.on("user_online", (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit("update_online_users", Object.keys(onlineUsers));
    });

    // Handle customer sending a message to admin
// Handle customer sending a message to admin
socket.on("send_message", async ({ sender_id, message }) => {
  if (!ADMIN_ID) {
    console.error("Admin ID not set. Aborting message send.");
    return;
  }
  try {
    const [result] = await db.execute(
      "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
      [sender_id, ADMIN_ID, message]
    );
    console.log("Message saved (from customer):", result.insertId);

    // Emit the message to the admin panel with a chatId property (set to the sender_id)
    if (onlineUsers[ADMIN_ID]) {
      io.to(onlineUsers[ADMIN_ID]).emit("admin_receive_message", { 
        sender: "user", 
        sender_id, 
        chatId: sender_id, // added for consistency
        message,
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error("Database INSERT error (customer send_message):", err);
  }
});


// Handle admin sending a message to a customer
socket.on("admin_send_message", async ({ chatId, message }) => {
  if (!ADMIN_ID) {
    console.error("Admin ID not set. Aborting admin message send.");
    return;
  }
  try {
    const [result] = await db.execute(
      "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
      [ADMIN_ID, chatId, message]
    );
    console.log("Admin message saved:", result.insertId);

    // Notify the customer if they are online
    if (onlineUsers[chatId]) {
      io.to(onlineUsers[chatId]).emit("admin_receive_message", { 
        sender: "admin", 
        chatId, 
        message,
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error("Database INSERT error (admin_send_message):", err);
  }
});

    // Handle typing notifications from customers
    socket.on("typing", ({ sender_id }) => {
      if (onlineUsers[ADMIN_ID]) {
        io.to(onlineUsers[ADMIN_ID]).emit("user_typing", sender_id);
      }
    });

    // Handle admin typing notifications
    socket.on("admin_typing", ({ chatId }) => {
      if (onlineUsers[chatId]) {
        io.to(onlineUsers[chatId]).emit("admin_typing", { chatId });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
        }
      }
      io.emit("update_online_users", Object.keys(onlineUsers));
    });
  });
};

// Fetch all distinct chats between admin and customers
const getAdminChats = async (req, res) => {
  if (!ADMIN_ID) {
    ADMIN_ID = await fetchAdminId();
    if (!ADMIN_ID) return res.status(500).json({ error: 'Admin ID not found' });
  }
  const sql = `
    SELECT u.id, 
           CONCAT(u.first_name, ' ', u.second_name) AS customerName,
           (
             SELECT m.message 
             FROM messages m 
             WHERE ((m.sender_id = u.id AND m.receiver_id = ?) 
             OR (m.sender_id = ? AND m.receiver_id = u.id))
             ORDER BY m.timestamp DESC 
             LIMIT 1
           ) AS lastMessage,
           (
             SELECT m.timestamp
             FROM messages m
             WHERE ((m.sender_id = u.id AND m.receiver_id = ?) 
             OR (m.sender_id = ? AND m.receiver_id = u.id))
             ORDER BY m.timestamp DESC 
             LIMIT 1
           ) AS lastMessageTime
    FROM (
      SELECT DISTINCT m.sender_id, m.receiver_id, m.message, m.timestamp
      FROM messages m
    ) m
    JOIN users u ON u.id = m.sender_id
    WHERE u.id != ?
    ORDER BY lastMessageTime DESC
  `;
  try {
    const [results] = await db.query(sql, [ADMIN_ID, ADMIN_ID, ADMIN_ID, ADMIN_ID, ADMIN_ID]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Fetch all messages for a conversation between admin and a customer
const getAdminMessages = async (req, res) => {
  const { chat_id } = req.query;
  if (!ADMIN_ID) {
    ADMIN_ID = await fetchAdminId();
    if (!ADMIN_ID) return res.status(500).json({ error: 'Admin ID not found' });
  }
  const sql = `
    SELECT * FROM messages 
    WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
    ORDER BY timestamp ASC
  `;
  try {
    const [results] = await db.query(sql, [chat_id, ADMIN_ID, ADMIN_ID, chat_id]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export default { getAdminChats, getAdminMessages, setSocketIO };
