const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  const token = req.headers["access-token"]
  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("invalid token");
  }

  next();
}
