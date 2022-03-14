require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const dashBoardRoutes = require("./routes/dashboard");
const productRoutes = require("./routes/products");


const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, async () => {
  try {
    console.log(
      
        ` Service started on port: ${process.env.PORT}`
      
    );

    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
      autoIndex: true,
      // useCreateIndex: true,
      // poolSize: 15,
      socketTimeoutMS: 45000,
    });
    console.log(` Database connected`);
  } catch (e) {
    console.log(` Database connection failed - ${e.message}`);
    
  }
});

app.get("/", function (req, res) {
  res.status(200).json({
    success: true,
    message: "Welcome to ShoppingNRent",
  });
});

app.use("/api/v1/shoppingnrent/dashboard", dashBoardRoutes);
app.use("/api/v1/shoppingnrent/user", userRoutes);
app.use("/api/v1/shoppingnrent/product", productRoutes);


