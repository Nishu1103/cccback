 
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token

  if (!token) {
    // console.log("No token provided");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    console.log("Token:", token); // Debugging token

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
    console.log("Decoded:", decoded); // Debug decoded data

    req.user = await User.findById(decoded.id); // Attach user object

    if (!req.user) {
      console.log("User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    next(); // Continue to next middleware
  } catch (error) {
    console.log("Token verification error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = authMiddleware;
