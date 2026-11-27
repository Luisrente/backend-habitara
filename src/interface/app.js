const express = require('express');
const cors = require('cors');
const authRoutes = require('./http/routes/auth.routes');
const accommodationsRoutes = require('./http/routes/accommodations.routes');
const authMiddleware = require('./http/middlewares/authMiddleware');
const roleMiddleware = require('./http/middlewares/roleMiddleware');
const UserRole = require('../domain/user/enums/UserRole');
const syncDatabase = require('../infrastructure/db/sequelize/sync');
const favoritesRoutes = require('./http/routes/favorites.routes');
const reservationsRoutes = require('./http/routes/reservations.routes');
const landlordRequestsRoutes = require('./http/routes/landlord-requests.routes');
const messagesRoutes         = require('./http/routes/messages.routes');
const statsRoutes            = require('./http/routes/stats.routes');

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
      'http://ec2-3-144-161-93.us-east-2.compute.amazonaws.com'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '12mb' }));

syncDatabase();

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'HABITARA API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/accommodations', accommodationsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/landlord-requests', landlordRequestsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/admin/stats', statsRoutes);

app.get(
  '/api/admin/test',
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  (req, res) => {
    res.status(200).json({ success: true, message: 'Panel admin ok', user: req.user });
  }
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = app;
