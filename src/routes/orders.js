const express = require("express");
const ordersController = require("../controllers/orders-controller");
const userMiddleware = require("../services/user-jwt");
const router = express.Router();

// Create a new order
router.post("/create", userMiddleware, ordersController.createOrder);

// Get all orders for a specific user
router.get("/all/:user_id", userMiddleware, (req, res, next) => {
  // Validate user_id to ensure it's a valid user ID before proceeding
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ success: false, msg: "Invalid user ID" });
  }

  // If user ID is valid, proceed to get orders
  next();
}, ordersController.getOrders);

// Get order by ID
router.get("/:order_id", userMiddleware, (req, res, next) => {
  // Validate order_id to ensure it's a valid order ID before proceeding
  const { order_id } = req.params;
  if (!order_id) {
    return res.status(400).json({ success: false, msg: "Invalid order ID" });
  }

  // If order ID is valid, proceed to get the order by ID
  next();
}, ordersController.getOrderById);

// Delete order by ID
router.delete("/:order_id", userMiddleware, (req, res, next) => {
  // Validate order_id to ensure it's a valid order ID before proceeding
  const { order_id } = req.params;
  if (!order_id) {
    return res.status(400).json({ success: false, msg: "Invalid order ID" });
  }

  // If order ID is valid, proceed to delete the order by ID
  next();
}, ordersController.deleteOrderById);

module.exports = router;
