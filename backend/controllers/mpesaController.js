import express from 'express';
import axios from 'axios';
const router = express.Router();

router.post("/initiate_payment", async (req, res) => {
    try {
      // Extract the amount and phone number from the incoming payload
      const { amount, phone } = req.body;
  
      console.log("Phone:", phone); // Debug log
      console.log("Amount:", amount); // Debug log
  
      // Validate the phone number in the Express backend (optional but recommended)
      const cleanedPhone = phone.replace(/[^0-9]/g, ''); // Clean the phone number
      if (!/^(?:254|0)?[7-9][0-9]{8}$/.test(cleanedPhone)) {
        return res.status(400).json({ success: false, message: "Invalid phone number format." });
      }
  
      // Forward the request to the PHP backend
      const phpResponse = await axios.post(
        "http://localhost/Mpesa%20Payment/initiate_payment.php", // URL to your PHP script
        { phone: cleanedPhone, amount }, // Ensure phone and amount are included
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      // Return the PHP response to the frontend
      return res.json(phpResponse.data);
    } catch (error) {
      console.error("Error forwarding payment initiation:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      res.status(500).json({ success: false, message: "Payment initiation failed" });
    }
  });
export default router;
