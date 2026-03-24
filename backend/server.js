import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import colors from 'colors';

// Import custom modules
import connectDB from './config/database.js';
import { globalErrorHandler, notFound } from './middleware/errorHandler.js';
import {
  generalLimiter,
  securityHeaders,
  sanitizeData,
  xssProtection,
  preventPollution,
  corsOptions,
  trackIP,
  requestSizeLimit
} from './middleware/security.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Load environment variables
dotenv.config();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...'.red.bold);
  console.log(err.name, err.message);
  process.exit(1);
});

// Connect to database
connectDB();

// Create Express app
const app = express();

// Trust proxy (for deployment behind reverse proxy)
app.set('trust proxy', 1);

// Body parser middleware
app.use(express.json({ limit: requestSizeLimit }));
app.use(express.urlencoded({ extended: true, limit: requestSizeLimit }));

// Cookie parser
app.use(cookieParser());

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors(corsOptions));

// Security middleware
app.use(securityHeaders);
app.use(sanitizeData);
app.use(xssProtection);
app.use(preventPollution);
app.use(trackIP);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(generalLimiter);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  });
});

// API status endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Shift Start API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      team: '/api/team',
      projects: '/api/projects',
      contact: '/api/contact'
    },
    documentation: 'https://api.shiftstart.sy/docs'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

// Handle undefined routes
app.all('*', notFound);

// Global error handling middleware
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold
  );
  console.log(`📍 API URL: http://localhost:${PORT}/api`.blue.underline);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`.cyan.underline);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...'.red.bold);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully'.yellow);
  server.close(() => {
    console.log('💥 Process terminated!'.red);
  });
});

export default app;
