import { cooldown } from './cooldown';
import { logger } from './logger';
import { server } from './server';

async function main() {
  const { PORT = 3000 } = process.env;

  server.listen(PORT, () => logger.info(`Listening on ${PORT}`));

  process
    .on('SIGTERM', cooldown)
    .on('SIGHUP', cooldown)
    .on('SIGINT', cooldown);
}

main();
