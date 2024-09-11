const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = "bff01826f614cc3eb42faf5e1812a984d2eabe53d3b60f007dd743a2bb478e6c264ac28859f4b0b8a9527363826f2e35e0db8e6292e76b9c960aa8135f957ca9";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("Token not found"); // Debugging line
    return res.status(401).json({ error: true, message: "Token missing" });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification error:", err.message); // Debugging line
      return res.status(401).json({ error: true, message: "Token invalid" });
    }
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken,
};
