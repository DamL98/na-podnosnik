const express = require("express");
const prisma = require("../../shared/db/prisma");

const router = express.Router();

/**
 * GET /api/availability
 * ?podnosnikId=1&od=2026-01-10T10:00&do=2026-01-10T12:00
 */
router.get("/", async (req, res) => {
  try {
    const { podnosnikId, od, do: doTs } = req.query;

    if (!podnosnikId || !od || !doTs) {
      return res.status(400).json({
        error: "Brak wymaganych parametrów",
      });
    }

    const start = new Date(od);
    const end = new Date(doTs);

    if (isNaN(start) || isNaN(end) || end <= start) {
      return res.status(400).json({
        error: "Nieprawidłowy zakres czasu",
      });
    }

    // 🔍 sprawdzenie kolizji
    const conflicts = await prisma.$queryRawUnsafe(
      `
      SELECT id FROM rezerwacje
      WHERE podnosnikid = $1
        AND tstzrange(od_ts, do_ts, '[)') &&
            tstzrange($2::timestamptz, $3::timestamptz, '[)')
      `,
      Number(podnosnikId),
      start.toISOString(),
      end.toISOString()
    );

    return res.json({
      available: conflicts.length === 0,
    });
  } catch (err) {
    console.error("Availability error:", err);
    return res.status(500).json({
      error: "Błąd serwera",
    });
  }
});

router.get("/podnosniki", async (req, res) => {
  try {
    const { od, do: doTs } = req.query;

    if (!od || !doTs) {
      return res.status(400).json({ error: "Brak zakresu czasu" });
    }

    const start = new Date(od);
    const end = new Date(doTs);

    // wszystkie aktywne podnośniki
    const podnosniki = await prisma.podnosnik.findMany({
      where: { aktywny: true }
    });

    // zajęte w tym czasie
    const zajete = await prisma.$queryRawUnsafe(
      `
      SELECT DISTINCT podnosnikid FROM rezerwacje
      WHERE tstzrange(od_ts, do_ts, '[)') &&
            tstzrange($1::timestamptz, $2::timestamptz, '[)')
      `,
      start.toISOString(),
      end.toISOString()
    );

    const zajeteIds = zajete.map(r => r.podnosnikid);

    const wolne = podnosniki.filter(p => !zajeteIds.includes(p.id));

    res.json(wolne);
  } catch (err) {
    console.error("availability/podnosniki:", err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});



module.exports = router;
