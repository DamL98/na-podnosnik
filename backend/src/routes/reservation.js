const express = require("express");
const prisma = require("../../shared/db/prisma");

const router = express.Router();

/**
 * POST /api/rezerwacje
 */
router.post("/", async (req, res) => {
  try {
    const {
      podnosnikId,
      imie,
      nazwisko,
      email,
      sposob_platnosci,
      od_ts,
      do_ts,
      uslugi_json,
    } = req.body;

    /* ===== WALIDACJA ===== */
    if (
      !podnosnikId ||
      !imie ||
      !nazwisko ||
      !email ||
      !od_ts ||
      !do_ts ||
      !Array.isArray(uslugi_json)
    ) {
      return res.status(400).json({
        error: "Brak wymaganych danych",
      });
    }

    const start = new Date(od_ts);
    const end = new Date(do_ts);

    if (isNaN(start) || isNaN(end) || end <= start) {
      return res.status(400).json({
        error: "Nieprawidłowy zakres czasu",
      });
    }

    /* ===== KOLIZJE TERMINÓW (tstzrange) ===== */
    const conflicts = await prisma.$queryRawUnsafe(
      `
      SELECT id FROM rezerwacje
      WHERE podnosnikid = $1
        AND tstzrange(od_ts, do_ts, '[)') &&
            tstzrange($2::timestamptz, $3::timestamptz, '[)')
      `,
      podnosnikId,
      start.toISOString(),
      end.toISOString()
    );

    if (conflicts.length > 0) {
      return res.status(409).json({
        error: "Wybrany termin jest już zajęty",
      });
    }

    /* ===== ZAPIS ===== */
    const reservation = await prisma.rezerwacje.create({
      data: {
        podnosnikid: podnosnikId,
        imie,
        nazwisko,
        email,
        sposob_platnosci,
        od_ts: start,
        do_ts: end,
        uslugi_json,
      },
    });

    return res.status(201).json({
      success: true,
      reservationId: reservation.id.toString(),
    });
  } catch (err) {
    console.error("Błąd rezerwacji:", err);
    return res.status(500).json({
      error: "Błąd serwera",
    });
  }
});

module.exports = router;
