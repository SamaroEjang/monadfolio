require('dotenv').config();
const express = require('express');
const cors = require('cors');
const portfolioRoutes = require('./routes/portfolio');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['https://monadfolio-mu.vercel.app', 'http://localhost:3000'],
  methods: ['GET'],
}));app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'MonadFolio' });
});

app.use('/api', portfolioRoutes);

app.listen(PORT, () => {
  console.log(`MonadFolio backend running on port ${PORT}`);
});
