require('dotenv').config();
const express = require('express');
const cors = require('cors')
const prisma = require('./db/prisma')

const app = express();
const PORT = 5000;

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('test endpoint');
});


// prisma querry
app.get('/health', async (req, res) => {
  await prisma.$queryRaw`SELECT 1`
  res.json({ status: 'ok' })
})


app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
});