import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import sequelize, { connectDB } from './config/db.js';
import apiRoutes from './routes/apiRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './seed.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Granite & Tile Manufacturing Management System API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Serve Frontend Static Build if available
const distPath = path.join(__dirname, '..', 'granite-tile-mms', 'dist');

if (fs.existsSync(distPath)) {
  console.log(`[Static] Serving frontend static assets from: ${distPath}`);
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    if (req.accepts('html')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      res.status(404).json({
        success: false,
        message: `API Endpoint '${req.originalUrl}' not found.`
      });
    }
  });
} else {
  // Root REST API Endpoint fallback if static files are not built
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      system: 'Granite & Tile Manufacturing Management System REST API',
      endpoints: {
        health: '/api/health',
        api: '/api',
        products: '/api/products',
        users: '/api/users'
      },
      timestamp: new Date().toISOString()
    });
  });

  // Fallback for unknown API routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `API Endpoint '${req.originalUrl}' not found on this server.`
    });
  });
}

// Error Handler
app.use(errorHandler);

// Initialize DB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` Granite & Tile MMS Backend Server Running!`);
      console.log(` URL: http://localhost:${PORT}`);
      console.log(` API Endpoint: http://localhost:${PORT}/api`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start backend server:', error);
    process.exit(1);
  }
};

startServer();
