import 'reflect-metadata';
import './container'; // Import the container configuration
import express, { Request, Response, NextFunction } from 'express';
import { errorHandling } from './utils/error-handling.utils';
import { HttpException } from './utils/exception/http.exception';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger.config';


const app = express();

app.use(express.json());

// Integrate routes
app.use('/api', routes);

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Global error handler middleware
app.use(
    (err: HttpException, req: Request, res: Response, next: NextFunction) => {
        errorHandling(err, res);
    },
);

export default app;