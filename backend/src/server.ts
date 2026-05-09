import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './config/database';

const startServer = async () => {
  try {
    // Check DB connection
    await prisma.$connect();
    logger.info('📦 Connected to Database');

    app.listen(env.PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
