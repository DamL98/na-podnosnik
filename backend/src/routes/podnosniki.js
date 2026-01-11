const express = require("express");
const prisma = require("../../shared/db/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  const podnosniki = await prisma.podnosnik.findMany({
    where: { aktywny: true },
    orderBy: { id: "asc" }
  });

  res.json(podnosniki);
});

module.exports = router;
