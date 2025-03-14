import db from '../../config/db.js';

let onlineUsers = {};
let io = null;

// Set the socket instance
const setSocketIO = (socketIO) => {
  io = socketIO;

  // Test database connection
  db.query("SELECT 1 + 1 AS solution")
    .then(([results]) => {
      console.log("Database connection successful:", results);
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user online
    socket.on('user_online', (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit('update_online_users', Object.keys(onlineUsers));
    });

    // Handle sending message
    socket.on('send_message', async ({ sender_id, receiver_id, message }) => {
      console.log("Received send_message event:", { sender_id, receiver_id, message });

      try {
        const sql = 'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
        const [result] = await db.execute(sql, [sender_id, receiver_id, message]);
        console.log("Message saved to database:", result);

        // Send to the receiver (user)
        if (onlineUsers[receiver_id]) {
          io.to(onlineUsers[receiver_id]).emit('receive_message', { sender_id, message });
        }

        // Send to the admin panel
        io.emit('admin_receive_message', {
          chatId: sender_id,
          message,
          sender: 'user',
        });
      } catch (err) {
        console.error("Database error:", err.sqlMessage);

      }
    });

    // Handle typing
    socket.on('typing', ({ sender_id, receiver_id }) => {
      io.to(onlineUsers[receiver_id]).emit('user_typing', sender_id);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
        }
      }
      io.emit('update_online_users', Object.keys(onlineUsers));
    });
  });
};

// Fetch messages
const getMessages = async (req, res) => {
  const { sender_id, receiver_id } = req.query;
  const sql = `SELECT * FROM messages 
                WHERE (sender_id = ? AND receiver_id = ?) 
                OR (sender_id = ? AND receiver_id = ?) 
                ORDER BY timestamp ASC`;
  try {
    const [results] = await db.execute(sql, [sender_id, receiver_id, receiver_id, sender_id]);
    res.json(results);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Fetch contacts
const getContacts = async (req, res) => {
  const { user_id } = req.query;
  const sql = `SELECT DISTINCT users.id, CONCAT(users.first_name, ' ', users.second_name) AS name
               FROM users
               JOIN messages ON users.id = messages.sender_id OR users.id = messages.receiver_id
               WHERE users.id != ?`;
  try {
    const [results] = await db.execute(sql, [user_id]);
    res.json(results);
  } catch (err) {
    res.status(500).send(err);
  }
};

export default { setSocketIO, getMessages, getContacts };