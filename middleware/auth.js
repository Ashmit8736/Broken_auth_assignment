
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const secret = process.env.JWT_SECRET || "default-secret-key";
    const decoded = jwt.verify(token.replace("Bearer ", ""), secret);
    req.user = decoded;
    next(); // Missing this line was causing the request to hang without sending a response 
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
