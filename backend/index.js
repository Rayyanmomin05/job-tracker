const express = require('express');
const cors = require('cors');
const https = require('https');
require('dotenv').config();

const sequelize = require('./config/db');
require('./models/User');
require('./models/Application');
require('./models/Note');

const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const aiRoutes = require('./routes/ai');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: false
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/applications', authMiddleware, applicationRoutes);
app.use('/ai', authMiddleware, aiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Job Tracker API is running' });
});

// Connect to MySQL and start server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('MySQL connected and tables synced');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);

      // Keep Render alive — self ping every 14 minutes
      setInterval(() => {
        https.get('https://job-tracker-backend-fgo9.onrender.com', (res) => {
          console.log(`Self ping status: ${res.statusCode}`);
        }).on('error', (err) => {
          console.log(`Self ping error: ${err.message}`);
        });
      }, 14 * 60 * 1000);

    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });