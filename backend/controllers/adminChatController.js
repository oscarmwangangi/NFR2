import db from '../../config/db.js';

const adminId = 0; // assuming admin is represented with id 0


let onlineUsers = {};
let io = null;


const setSocketIO = (socketIO) => {
  io = socketIO;

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle customer connection: mark user online
    socket.on('user_online', (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit('update_online_users', Object.keys(onlineUsers));
    });

    // Handle customer sending a message
    socket.on('send_message', ({ sender_id, receiver_id, message }) => {
      const sql = 'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
      db.query(sql, [sender_id, receiver_id, message], (err, result) => {
        if (err) throw err;
       // If the receiver is online, send to them
if (onlineUsers[receiver_id]) {
    io.to(onlineUsers[receiver_id]).emit('receive_message', { sender_id, message });
  }
  
  // Also, send to the admin panel (receiver_id is 0 for admin)
  if (onlineUsers[0]) {
    io.to(onlineUsers[0]).emit('receive_message', { sender_id, message });
  }
  
      });
    });

    // Handle customer typing notification
    socket.on('typing', ({ sender_id, receiver_id }) => {
      io.to(onlineUsers[receiver_id]).emit('user_typing', sender_id);
    });

    // ===== Admin Socket Events =====

    // Admin sends a message to a customer (chatId represents the customer's id)
    socket.on('admin_send_message', ({ chatId, message, sender }) => {
      const sql = 'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
      db.query(sql, [adminId, chatId, message], (err, result) => {
        if (err) throw err;
        // Notify the customer that an admin message was sent
        io.to(onlineUsers[chatId]).emit('admin_receive_message', { chatId, message, sender });
      });
    });

    // Admin typing event: notify the customer
    socket.on('admin_typing', ({ chatId }) => {
      io.to(onlineUsers[chatId]).emit('admin_typing', { chatId });
    });
    
    // Handle disconnection
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



// Fetch all distinct chats between admin and customers.
// This query retrieves customers who have chatted with admin
// along with the last message for display purposes.
const getAdminChats = async (req, res) => {
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
  
    const adminId = 0; // Admin ID is always 0
    const [results] = await db.query(sql, [adminId, adminId, adminId, adminId, adminId]);
    res.json(results);
  };
  

// Fetch all messages for a conversation between admin and a customer.
// Expecting query parameter "chat_id" (customer id).
// Fetch all messages for a conversation between admin and a customer.
// Expecting query parameter "chat_id" (customer id).
const getAdminMessages = (req, res) => {
    const { chat_id } = req.query;
    const sql = `
      SELECT * FROM messages 
      WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
      ORDER BY timestamp DESC
    `;
    db.query(sql, [chat_id, adminId, adminId, chat_id], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  };

export default { getAdminChats, getAdminMessages,setSocketIO };
