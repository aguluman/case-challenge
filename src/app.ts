import 'reflect-metadata';
import { HabariDataSource } from './config/orm.config';
import express, { Request, Response, NextFunction } from 'express';
import { errorHandling } from './utils/error-handling.utils';
import { HttpException } from './utils/exception/http.exception';

const app = express();

// Initialize TypeORM Data Source
HabariDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => console.log(error));

app.use(express.json());

// Your other middleware and routes go here

// Global error handler middleware
app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
  errorHandling(err, res);
});

export default app;