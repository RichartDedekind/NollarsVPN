require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { setupIPFS } = require('./services/ipfsService');
const ensRoutes = require('./routes/ensRoutes');
const vpnRoutes = require('./routes/vpnRoutes');
const ipfsRoutes = require('./routes/ipfsRoutes');
const logger = require('./utils/logger');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/ens', ensRoutes);
app.use('/api/vpn', vpnRoutes);
app.use('/api/ipfs', ipfsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize IPFS connection
async function initializeServices() {
  try {
    await setupIPFS();
    logger.info('IPFS service initialized successfully');
    
    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

initializeServices();
