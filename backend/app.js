require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const personnelRoutes = require('./routes/personnel');
const departmentRoutes = require('./routes/departments'); // Güncellenmiş
const projectRoutes = require('./routes/projects'); // Güncellenmiş
const clientRoutes = require('./routes/clients'); // Güncellenmiş
const bookingRoutes = require('./routes/bookings'); // Güncellenmiş
const activityRoutes = require('./routes/activities'); // Güncellenmiş

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/personnel', personnelRoutes);
app.use('/departments', departmentRoutes);
app.use('/projects', projectRoutes);
app.use('/clients', clientRoutes);
app.use('/bookings', bookingRoutes);
app.use('/activities', activityRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
