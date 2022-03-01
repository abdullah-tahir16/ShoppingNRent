const express = require("express");
const userController = require("../controllers/user-controller");
const adminMiddleware = require("../services/admin-jwt");
const userMiddleware = require("../services/user-jwt");
const router = express.Router();

router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.post(
  "/approve",
  adminMiddleware,
  userController.approveUser
);
router.post("/update", userMiddleware, userController.updateUser);
router.get("/get", userMiddleware, adminMiddleware, userController.getUserById);
module.exports = router;
