
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const pedDetailsRoutes = require('./routes/pedDetailsRoutes');
const pedSearchSessionRoutes = require('./routes/pedSearchSessionRoutes');
const pedSourceUrlRoutes = require('./routes/pedSourceUrlRoutes');
const pedCollectorQueryRoutes = require('./routes/pedCollectorQueryRoutes');

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/ped-details', pedDetailsRoutes);
app.use('/api/search-sessions', pedSearchSessionRoutes);
app.use('/api/source-urls', pedSourceUrlRoutes);
app.use('/api/collector-queries', pedCollectorQueryRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'PED API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 middleware
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
