import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import { app } from './app.js';
import { container } from 'tsyringe';
import { WSTLogger } from '@wst/logger';

const port = process.env.PORT;
const logger = container.resolve<WSTLogger>('Logger');

app.listen(port, () => {
  logger.info(`Servidor rodando em http://localhost:${port}`);
});
