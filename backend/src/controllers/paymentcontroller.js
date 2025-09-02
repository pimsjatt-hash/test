// // src/controllers/paymentController.js
// // ⚠️ All Razorpay integration code is commented until client provides details

// import Payment from "../models/payment.js";

// /*
// // Example Razorpay setup
// import Razorpay from "razorpay";
// import crypto from "crypto";
// import dotenv from "dotenv";

// dotenv.config();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });
// */

// // Create order (commented)
// export const createOrder = async (req, res) => {
//   try {
//     /*
//     const options = {
//       amount: req.body.amount * 100,
//       currency: "INR",
//       receipt: `order_${Date.now()}`,
//     };
//     const order = await razorpay.orders.create(options);
//     */
//     res.json({ message: "Order creation disabled until client confirms Razorpay" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Verify payment (commented)
// export const verifyPayment = async (req, res) => {
//   try {
//     /*
//     const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
//     const body = razorpayOrderId + "|" + razorpayPaymentId;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature !== razorpaySignature) {
//       return res.status(400).json({ message: "Invalid signature" });
//     }
//     */
//     res.json({ message: "Payment verification disabled until client confirms Razorpay" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
