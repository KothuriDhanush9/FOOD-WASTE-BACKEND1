const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const foodRoutes = require('./routes/food');
const requestRoutes = require('./routes/requests');
const analyticsRoutes = require('./routes/analytics');
const errorHandler = require('./middleware/errorHandler');
const { connectMySQL } = require('./config/mysql');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

app.get('/api/status', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'API endpoint not found. Check the route and HTTP method.' });
});

app.use(errorHandler);

const startServer = async () => {
  await connectMySQL();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Server startup error:', error.message);
  process.exit(1);
});
