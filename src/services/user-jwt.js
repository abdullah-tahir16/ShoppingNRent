const jwt = require("jsonwebtoken");

// FOR ROUTE SECUIRTY
module.exports = function (req, res, next) {
  if (!req.headers["authorization"]) {
    return res.status(400).json({
      message: "You are not authorized to perform this action",
    });
  }
  let token = req.headers["authorization"].split("Bearer ")[1];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET_USER, function (err, decoded) {
      if (err) {
        return res.json({
          error: true,
          message: "You are not authorized to perform this action.",
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(400).json({
      message: "You are not authorized to perform this action.",
    });
  }
};
