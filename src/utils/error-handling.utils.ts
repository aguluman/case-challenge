import { Response } from 'express';
import { HttpException } from './exception/http.exception';
import { logger } from './logger.utils';

export const errorHandling = (error: HttpException, res: Response) => {
  logger(error.message);
  res.status(error.status).send(error.message);
};

