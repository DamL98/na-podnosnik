require('dotenv').config();
const express = require("express");
const cors = require("cors");
const prisma = require('./../shared/db/prisma');
const bcrypt = require("bcrypt");
const { createToken } = require("../auth/authenticationService");

// const auth = require("./middlewares/auth");
// const cookieParser = require("cookie-parser");

// ROUTES
const reservationsRouter = require("./routes/reservation");
const availabilityRouter = require("./routes/availability");
const meRouter = require("./routes/me");
const podnosnikiRouter = require("./routes/podnosniki");

// APP BUILD
const app = express();
app.use(cors());
app.use(express.json());


// ENDPOINTY
app.use("/api/rezerwacje", reservationsRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/me", meRouter);
app.use("/api/podnosniki", podnosnikiRouter);



// Rejestracja i logowanie endpointy
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Brak danych" });
    }

    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(409).json({ error: "Email już istnieje" });
    }

    const hash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hash,
      },
    });

    const token = createToken(user);

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 864e5),
      },
    });

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});


app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return res.status(401).json({ error: "Błąd" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Błąd" });

  const token = createToken(user);

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 864e5),
    },
  });

  //res.cookie("auth", token, { httpOnly: true });
  res.json({ user, token });
});


app.get("/api/auth/me", async (req, res) => {
  try {
      const auth = req.headers.authorization;
      if (!auth) return res.status(401).json({ error: "Brak tokena" });

      const token = auth.replace("Bearer ", "");

      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({ error: "Sesja wygasła" });
      }

      res.json({ user: session.user });
    } catch (err) {
      res.status(500).json({ error: "Błąd serwera" });
    }



  //const token = req.cookies.auth;
  // if (!token) return res.json(null);

  // const session = await prisma.session.findUnique({
  //   where: { token },
  //   include: { user: true },
  // });

  // if (!session || session.expiresAt < new Date()) {
  //   return res.json(null);
  // }

  // res.json(session.user);
});



// app.get("/me/reservations", auth, async (req, res) => {
//   const reservations = await prisma.rezerwacja.findMany({
//     where: { userId: req.user.id },
//     orderBy: { od_ts: "desc" }
//   });

//   res.json(reservations);
// });


// app.get("/me/reservations/:id", auth, async (req, res) => {
//   const r = await prisma.rezerwacja.findFirst({
//     where: {
//       id: Number(req.params.id),
//       userId: req.user.id
//     }
//   });

//   if (!r) return res.sendStatus(404);
//   res.json(r);
// });



app.get("/", (req, res) => {
  res.json({ status: "ok dziala" });
});

// APP INFO / START
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 API działa na http://localhost:${PORT}`);
});
