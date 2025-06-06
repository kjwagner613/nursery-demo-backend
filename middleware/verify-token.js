const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ err: "Token missing or malformed." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // ✅ Assign decoded payload correctly
    next();
  } catch (err) {
    res.status(401).json({ err: "Invalid or expired token." });
  }
}

module.exports = verifyToken;
