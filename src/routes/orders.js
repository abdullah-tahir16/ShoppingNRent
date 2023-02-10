const express = require("express");
const ordersController = require("../controllers/orders-controller");
const userMiddleware = require("../services/user-jwt");
const router = express.Router();

router.post("/create", userMiddleware, ordersController.createOrder);
router.get("/all/:user_id", userMiddleware, ordersController.getOrders);
router.get("/:order_id", userMiddleware, ordersController.getOrderById);
router.delete("/:order_id", userMiddleware, ordersController.deleteOrderById);
