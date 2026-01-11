const express = require("express");
const prisma = require("../../shared/db/prisma");
const auth = require("../middlewares/auth");

const router = express.Router();

/**
 * profil usera
 */
router.get("/", auth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      createdAt: true
    }
  });

  res.json(user);
});

/**
 * update profilu
 */
router.put("/", auth, async (req, res) => {
  const { firstName, lastName, phone } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { firstName, lastName, phone }
  });

  res.json(user);
});

/**
 * lista rezerwacji usera
 */
router.get("/rezerwacje", auth, async (req, res) => {
  try {
    const rezerwacje = await prisma.rezerwacje.findMany({
      where: { userId: req.user.id },
      orderBy: { od_ts: "desc" }
    });

    // 🔥 konwersja BigInt → string
    const safe = rezerwacje.map(r => ({
      ...r,
      id: r.id.toString()
    }));

    res.json(safe);
  } catch (err) {
    console.error("Błąd /me/rezerwacje:", err);
    res.status(500).json({ error: "Błąd pobierania rezerwacji" });
  }
});

module.exports = router;
