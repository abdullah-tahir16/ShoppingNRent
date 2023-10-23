const express = require("express");
const userController = require("../controllers/user-controller");
const adminMiddleware = require("../services/admin-jwt");
const userMiddleware = require("../services/user-jwt");
const router = express.Router();

// Create a new user
router.post("/create", (req, res, next) => {
  // Add validation and error handling for the request body
  const { name, cnic, city, email, username, password } = req.body;
  if (!name || !cnic || !city || !email || !username || !password) {
    return res.status(400).json({ success: false, msg: "Missing required fields" });
  }
  next();
}, userController.createUser);

// User login
router.post("/login", (req, res, next) => {
  // Add validation and error handling for the request body
  const { email, username, password } = req.body;
  if ((!email && !username) || !password) {
    return res.status(400).json({ success: false, msg: "Invalid credentials" });
  }
  next();
}, userController.loginUser);

// Approve or disapprove a user (requires admin privileges)
router.post("/approve", adminMiddleware, (req, res, next) => {
  // Add validation and error handling for the request body
  const { id, is_approved } = req.query;
  if (!id || is_approved === undefined) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  next();
}, userController.approveUser);

// Update user profile
router.post("/update", userMiddleware, (req, res, next) => {
  // Add validation and error handling for the request body
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, msg: "Invalid user ID" });
  }

  // Check if any valid update fields are provided
  const validUpdateFields = ["name", "cnic", "city", "contact_number1", "password", "contact_number2", "contact_address_comm", "contact_address_permanent", "email", "username", "promo_code", "role"];
  const isUpdateValid = validUpdateFields.some((field) => field in req.body);

  if (!isUpdateValid) {
    return res.status(400).json({ success: false, msg: "No valid fields to update" });
  }
  next();
}, userController.updateUser);

// Get user by ID (requires user and admin privileges)
router.get("/get", userMiddleware, adminMiddleware, (req, res, next) => {
  // Add validation and error handling for the request body
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, msg: "Invalid user ID" });
  }
  next();
}, userController.getUserById);

// Update user language preference
router.post("/language", userMiddleware, (req, res, next) => {
  // Add validation and error handling for the request body
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ success: false, msg: "Invalid user ID" });
  }
  if (!req.body.language || !["english", "urdu"].includes(req.body.language)) {
    return res.status(400).json({ success: false, msg: "Invalid language preference" });
  }
  next();
}, userController.updateLanguage);

module.exports = router;
