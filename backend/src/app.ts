import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Route imports
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import agentRoutes from './routes/agent.routes';
import purchaseRoutes from './routes/purchase.routes';
import accessRoutes from './routes/access.routes';
import developerRoutes from './routes/developer.routes';
import demoRoutes from './routes/demo.routes';
import adminRoutes from './routes/admin.routes';
import { globalLimiter, authLimiter, demoLimiter } from './middleware/rateLimit';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins for hackathon/testing purposes
    callback(null, true);
  },
  credentials: true
}));
app.use(globalLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/access', accessRoutes);
app.use('/api/developer', developerRoutes);
app.use('/api/demo', demoLimiter, demoRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
