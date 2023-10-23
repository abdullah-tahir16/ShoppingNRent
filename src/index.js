require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const dashBoardRoutes = require("./routes/dashboard");
const productRoutes = require("./routes/products");

const app = express();

// Disable x-powered-by header
app.disable("x-powered-by");

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Connect to the database and start the server
app.listen(process.env.PORT, async () => {
  try {
    console.log(`Service started on port: ${process.env.PORT}`);

    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      socketTimeoutMS: 45000,
    });

    console.log(`Database connected`);
  } catch (e) {
    console.log(`Database connection failed - ${e.message}`);
  }
});

// Root route
app.get("/", function (req, res) {
  res.status(200).json({
    success: true,
    message: "Welcome to ShoppingNRent",
  });
});

// Define routes
app.use("/api/v1/shoppingnrent/dashboard", dashBoardRoutes);
app.use("/api/v1/shoppingnrent/user", userRoutes);
app.use("/api/v1/shoppingnrent/product", productRoutes);
