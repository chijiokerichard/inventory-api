const jwt = require("jsonwebtoken");
const Person = require("../models/models");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await Person.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware