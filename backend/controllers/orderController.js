import express from 'express';
import db from '../../config/db.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateOrderConfirmationEmail } from '../../frontend/src/components/User/Cart/orderEmailTemplate.mjs'; // adjust the path as needed

dotenv.config(); // load environment variables from a .env file

const router = express.Router();

// Configure the email transporter (using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

router.post("/order", async (req, res) => {
  try {
    const orderData = req.body;
    const {
      user,
      cart,
      deliveryAddress,
      deliverySlot,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
    } = orderData;

    // Format the delivery date (YYYY-MM-DD)
    const formattedDeliveryDate = new Date(deliverySlot.date)
      .toISOString()
      .split("T")[0];

    // Insert order with an additional `status` column
    const orderInsertQuery = `
      INSERT INTO orders 
        (first_name, second_name, email, payment_method, subtotal, shipping_cost, total, 
         street, phone_number, city, state, postal_code, google_place_id, building_name, 
         apartment_number, address_label, delivery_date, delivery_slot, cart_items, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const orderValues = [
      user.first_name,
      user.second_name,
      user.email,
      paymentMethod,
      subtotal,
      shippingCost,
      total,
      deliveryAddress.street,
      deliveryAddress.phone_number,
      deliveryAddress.city,
      deliveryAddress.state,
      deliveryAddress.postal_code,
      deliveryAddress.google_place_id,
      deliveryAddress.building_name,
      deliveryAddress.apartment_number,
      deliveryAddress.address_label,
      formattedDeliveryDate,
      deliverySlot.slot,
      JSON.stringify(cart), // storing the cart as a JSON string
      "pending"           // initial status value
    ];

    // Insert order and get the new order ID
    const [orderResult] = await db.query(orderInsertQuery, orderValues);
    const orderId = orderResult.insertId;

    // Clear the user's cart (similar to your DELETE route)
    console.log("Deleting cart items for user:", user.id);
    const clearCartQuery = "DELETE FROM cart_items WHERE user_id = ?";
    const [deleteResult] = await db.query(clearCartQuery, [user.id]);
    console.log("Cleared cart items count:", deleteResult.affectedRows);

    // Build the email content using the MJML template
    const emailSubject = "Order Confirmation & Receipt";
    const emailText = `
Hello ${user.first_name},

Thank you for your order!

Order ID: ${orderId}
Total Amount: KSh ${total}

Your order details:
${cart.map(item => `${item.name} x ${item.quantity}`).join("\n")}

We appreciate your business!

Best regards,
NFR
    `;
    const emailHtml = generateOrderConfirmationEmail({ user, orderId, total, cart });

    // Setup email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // sender address
      to: user.email, // customer's email
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
      attachments: [
        {
          // filename: 'weblogo.png',
          path: 'http://localhost:3000/weblogo.png', // or a URL if supported
          cid: 'logo@NFR', // same as in the MJML template
        },
      ],
    };

    // Send the email (asynchronously, but we don't want to block the order response)
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // Respond with success so the client can trigger the toast
    return res.json({
      success: true,
      message: "Order placed successfully",
      orderId,
    });
  } catch (error) {
    console.error("Error processing order:", error);
    return res.status(500).json({
      success: false,
      message: "Error placing order",
    });
  }
});

export default router;
