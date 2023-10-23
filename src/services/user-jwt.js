const jwt = require("jsonwebtoken");

// Middleware for route security
module.exports = function (req, res, next) {
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      message: "You are not authorized to perform this action.",
    });
  }

  const token = authorizationHeader.split("Bearer ")[1];

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_USER, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "You are not authorized to perform this action.",
      });
    }
    
    // Attach the decoded token to the request for later use
    req.decoded = decoded;
    next();
  });
};
