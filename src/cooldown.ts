import { logger } from './logger';
import { server } from './server';

export async function cooldown() {
  logger.info('Shutting down Node Proxy');

  server.close(() => {
    process.exit(0);
  });
}
