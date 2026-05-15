import serverlessExpress from '@vendia/serverless-express';
import { app } from './app';
import { container } from 'tsyringe';
import { WSTLogger } from '@wst/logger';

const logger = container.resolve<WSTLogger>('Logger');

app.use((req, res, next) => {
  const lambdaId = process.env.AWS_LAMBDA_LOG_STREAM_NAME;
  logger.info(`[Lambda] Nova invocação - Stream: ${lambdaId}`);
  res.on('finish', () => {
    logger.info(`[Lambda] Finalizada - Stream: ${lambdaId}`);
  });
  next();
});

export const handler = serverlessExpress({ app });
