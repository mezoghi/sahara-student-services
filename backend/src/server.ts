import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import prisma from './lib/prisma';

// Import routes
import authRoutes from './routes/auth';
// import userRoutes from './routes/user.routes';
// import schoolRoutes from './routes/school.routes';
// import courseRoutes from './routes/course.routes';
import applicationRoutes from './routes/applications';
import studentRoutes from './routes/student';
// import adminRoutes from './routes/admin.routes';
// import messageRoutes from './routes/message.routes';
// import formRoutes from './routes/form.routes';

// Import middleware
// import { errorHandler } from './middleware/error.middleware';

dotenv.config();

// Fail fast in production if critical secrets are missing
if (process.env.NODE_ENV === 'production') {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and 127.0.0.1 with any port in development
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/
    ];
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      return allowed.test(origin);
    });
    
    if (isAllowed || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sahara Student Services API',
      version: '1.0.0',
      description: 'API documentation for Sahara Student Services education consultancy platform',
      contact: {
        name: 'API Support',
        email: 'support@saharastudentservices.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', async (_req, res) => {
  try {
    // DB connectivity check
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', db: 'OK', timestamp: new Date().toISOString() });
  } catch (e) {
    res.status(503).json({ status: 'DEGRADED', db: 'DOWN', timestamp: new Date().toISOString() });
  }
});

// API Routes - Enable only working routes for testing
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/schools', schoolRoutes);
// app.use('/api/courses', courseRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/student', studentRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/forms', formRoutes);

// Error handling - disabled for testing
// app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received: shutting down...`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('✅ Prisma disconnected');
    } catch (e) {
      console.error('❌ Error during Prisma disconnect', e);
    } finally {
      process.exit(0);
    }
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    console.error('⏱️ Forced shutdown');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

export default app;
