const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const userRoutes = require("./routes/user");
const dashboardRoutes = require("./routes/dashboard");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

const app = express();
const frontendDistPath = path.join(__dirname, "..", "frontend", "dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  if (fs.existsSync(frontendIndexPath)) {
    return res.sendFile(frontendIndexPath);
  }

  res.status(200).json({
    success: true,
    message: "Welcome to ShoppingNRent",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
  });
});

app.use("/api/v1/shoppingnrent/dashboard", dashboardRoutes);
app.use("/api/v1/shoppingnrent/user", userRoutes);
app.use("/api/v1/shoppingnrent/product", productRoutes);
app.use("/api/v1/shoppingnrent/order", orderRoutes);

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get(/^(?!\/api(?:\/|$)|\/health$).*/, (req, res) => {
    res.sendFile(frontendIndexPath);
  });
}

module.exports = app;
