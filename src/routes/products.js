const express = require("express");
const productController = require("../controllers/product-controller");
const adminMiddleware = require("../services/admin-jwt");
const userMiddleware = require("../services/user-jwt");
const router = express.Router();

router.post(
  "/create",
  userMiddleware,
  adminMiddleware,
  productController.createProduct
);
router.post(
  "/update",
  userMiddleware,
  adminMiddleware,
  productController.updateProduct
);
router.get(
  "/getProductsByCity",
  userMiddleware,
  adminMiddleware,
  productController.getProductByCity
);
router.get(
  "/getProductsBySeller",
  userMiddleware,
  adminMiddleware,
  productController.getProductBySeller
);

router.post("/delete", userMiddleware, productController.deleteProduct);
module.exports = router;
