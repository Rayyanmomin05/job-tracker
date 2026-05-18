const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
require('./models/Application');
require('./models/Note');

const applicationRoutes = require('./routes/applications');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/applications', applicationRoutes);
app.use('/ai', aiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Job Tracker API is running' });
});

// Connect to MySQL and start server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('MySQL connected and tables synced');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });