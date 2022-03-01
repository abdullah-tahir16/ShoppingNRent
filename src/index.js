require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
// const companyRoute = require("./routes/company");
// const serviceProviderRoute = require("./routes/service-provider");
// const spContactRoute = require("./routes/service-provider-contact");
const dashBoardRoutes = require("./routes/dashboard");
// const serviceSeekerRoute = require("./routes/service-seeker");
// const uniqueCheckRoutes = require("./routes/unique");
// const postRoutes = require("./routes/posts");
// const reviewRoutes = require("./routes/review");
// const resetRoutes = require("./routes/reset");
// if(process.env.ENVIRONMENT === 'development') {
//   process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
// }

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
app.use("/api/v1/shoppingnrent/user", userRoutes)


