import db from '../../config/db.js';  // Use ES6 import

let onlineUsers = {};
let io = null;
let ADMIN_ID = null;

// Fetch the admin ID dynamically from the users table
const fetchAdminId = async () => {
  try {
    // Check for either "admin" or "topadmin"
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

// Set the socket instance and initialize the admin ID

const setSocketIO = async (socketIO) => {
  io = socketIO;

  // Test database connection
  try {
    await db.query("SELECT 1 + 1 AS solution");
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection error:", err);
    return;
  }

  // Fetch ADMIN_ID before setting up socket listeners
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

  // Now setup socket listeners after ADMIN_ID is confirmed
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("user_online", (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit("update_online_users", Object.keys(onlineUsers));
    });

    socket.on("send_message", async ({ sender_id, message }) => {
      console.log("Received message from user:", sender_id, message);
    
      if (!ADMIN_ID) {
        console.error("Admin ID not set. Aborting message send.");
        return;
      }
    
      try {
        // Check for duplicates in the last 5 seconds
        const [existingMessages] = await db.execute(
          `SELECT id FROM messages 
           WHERE sender_id = ? 
           AND receiver_id = ? 
           AND message = ? 
           AND timestamp > NOW() - INTERVAL 5 SECOND`,
          [sender_id, ADMIN_ID, message]
        );
    
        if (existingMessages.length > 0) {
          console.log("Duplicate message detected. Skipping insertion.");
          return;
        }
    
        // Insert the message
        const [result] = await db.execute(
          "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
          [sender_id, ADMIN_ID, message]
        );
    
        console.log("Message saved with ID:", result.insertId);
    
        // Fetch and emit the new message
        const [newMessage] = await db.execute(
          "SELECT * FROM messages WHERE id = ?",
          [result.insertId]
        );
    
        io.emit("admin_receive_message", {
          ...newMessage[0],
          chatId: sender_id,
        });
    
      } catch (err) {
        console.error("Database error:", err);
      }
    });
    // Handle typing notifications
    socket.on("typing", ({ sender_id }) => {
      if (onlineUsers[ADMIN_ID]) {
        io.to(onlineUsers[ADMIN_ID]).emit("user_typing", sender_id);
      }
    });

    // Handle user disconnect
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

// Fetch messages between the user and admin
const getMessages = async (req, res) => {
  const { sender_id } = req.query;
  if (!ADMIN_ID) {
    console.error("Admin ID is not set. Cannot fetch messages.");
    return res.status(500).send("Admin ID is not set.");
  }
  try {
    const sql = `SELECT * FROM messages 
                 WHERE (sender_id = ? AND receiver_id = ?)
                 OR (sender_id = ? AND receiver_id = ?)`;
    const [results] = await db.execute(sql, [
      sender_id,
      ADMIN_ID,
      ADMIN_ID,
      sender_id,
    ]);
    res.json(results);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).send(err);
  }
};

export default { setSocketIO, getMessages };



