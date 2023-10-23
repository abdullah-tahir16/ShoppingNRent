const express = require("express");
const productController = require("../controllers/product-controller");
const adminMiddleware = require("../services/admin-jwt");
const userMiddleware = require("../services/user-jwt");
const router = express.Router();

// Create a new product
router.post("/create", userMiddleware, adminMiddleware, (req, res, next) => {
  // Add validation and error handling for the request body
  const { name, price, city } = req.body;
  if (!name || !price || !city) {
    return res.status(400).json({ success: false, msg: "Missing required fields" });
  }
  next();
}, productController.createProduct);

// Update a product
router.post("/update", userMiddleware, adminMiddleware, (req, res, next) => {
  // Add validation and error handling for the request body
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, msg: "Invalid product ID" });
  }

  // Check if any valid update fields are provided
  const validUpdateFields = ["name", "price", "city", "description", "pictureLink", "otherInfo", "condition", "make", "active", "category", "discount"];
  const isUpdateValid = validUpdateFields.some((field) => field in req.body);

  if (!isUpdateValid) {
    return res.status(400).json({ success: false, msg: "No valid fields to update" });
  }
  next();
}, productController.updateProduct);

// Get products by city
router.get("/getProductsByCity", userMiddleware, adminMiddleware, (req, res, next) => {
  // Add validation and error handling for the request body
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ success: false, msg: "Invalid search query" });
  }
  next();
}, productController.getProductByCity);

// Get products by seller
router.get("/getProductsBySeller", userMiddleware, adminMiddleware, (req, res, next) => {
  // Add validation and error handling for the request body
  const { created_by } = req.body;
  if (!created_by) {
    return res.status(400).json({ success: false, msg: "Invalid search query" });
  }
  next();
}, productController.getProductBySeller);

// Delete a product
router.post("/delete", userMiddleware, (req, res, next) => {
  // Add validation and error handling for the request body
  const { product } = req.body;
  if (!Array.isArray(product) || product.length < 1) {
    return res.status(400).json({ success: false, msg: "Invalid request body" });
  }
  next();
}, productController.deleteProduct);

module.exports = router;
