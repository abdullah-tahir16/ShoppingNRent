const express = require("express");
const dashboardController = require("../controllers/dashboard-controller");
const adminMiddleware = require("../services/admin-jwt");
const router = express.Router();


router.post("/create", adminMiddleware, dashboardController.createAdminstrator);
router.post("/login", dashboardController.loginAdmin);

router.get(
    "/buyers/all",
    adminMiddleware,
    dashboardController.getAllBuyers
  );

  router.get(
    "/sellers/all",
    adminMiddleware,
    dashboardController.getAllSellers
  );

  router.get(
    "/both/all",
    adminMiddleware,
    dashboardController.getAllBoth
  );

module.exports = router;
