const express = require("express");
const cors = require("cors");

const reservationsRouter = require("./routes/reservations");
const availabilityRouter = require("./routes/availability");

// APP BUILD
const app = express();
app.use(cors());
app.use(express.json());


// ENDPOINTY
app.use("/api/rezerwacje", reservationsRouter);
app.use("/api/availability", availabilityRouter);


app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// APP INFO / START
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 API działa na http://localhost:${PORT}`);
});
