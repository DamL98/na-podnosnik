const prisma = require("../../shared/db/prisma");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      req.user = null;
    } else {
      req.user = session.user;
    }
  } catch {
    req.user = null;
  }

  next();
};
