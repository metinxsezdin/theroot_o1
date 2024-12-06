require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

const app = express(); // Önce app nesnesini başlatıyoruz

const personnelRoutes = require('./routes/personnel');
const authRoutes = require('./routes/auth');
const departmentRoutes = require('./routes/department');
const projectRoutes = require('./routes/project');
const clientRoutes = require('./routes/client');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // CORS ayarları
app.use(bodyParser.json()); // JSON parse için

// Routes
app.use('/auth', authRoutes);
app.use('/personnel', personnelRoutes);
app.use('/departments', departmentRoutes);
app.use('/projects', projectRoutes);
app.use('/clients', clientRoutes);

// Sync database and start server
db.sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced with new columns');
});

db.sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Database sync error:', err);
});
