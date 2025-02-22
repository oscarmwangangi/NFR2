import express from 'express';
import db from '../../config/db.js';

const router = express.Router();

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

    // Updated query with an additional `status` column
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
