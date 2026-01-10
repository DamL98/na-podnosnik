const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  const token = header.replace("Bearer ", "");

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // { id, email }
    next();
  } catch {
    res.sendStatus(401);
  }
};
