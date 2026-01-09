require('dotenv').config();
const express = require("express");
const cors = require("cors");
const prisma = require('./../shared/db/prisma');

// ROUTES
const reservationsRouter = require("./routes/reservation");
const availabilityRouter = require("./routes/availability");

// APP BUILD
const app = express();
app.use(cors());
app.use(express.json());


// ENDPOINTY
app.use("/api/rezerwacje", reservationsRouter);
app.use("/api/availability", availabilityRouter);


// Rejestracja i logowanie endpointy
app.post("/auth/register", async (req, res) => {
  const { email, password, username } = req.body;

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

  res.cookie("auth", token, { httpOnly: true });
  res.json({ user });
});


app.post("/auth/login", async (req, res) => {
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

  res.cookie("auth", token, { httpOnly: true });
  res.json({ user });
});


app.get("/auth/me", async (req, res) => {
  const token = req.cookies.auth;
  if (!token) return res.json(null);

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return res.json(null);
  }

  res.json(session.user);
});


app.get("/", (req, res) => {
  res.json({ status: "ok dziala" });
});

// APP INFO / START
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 API działa na http://localhost:${PORT}`);
});
