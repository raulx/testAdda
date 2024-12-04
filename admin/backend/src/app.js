import express from 'express';

const app = express();

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Route imports
import questionRouter from './routes/question.routes.js';
import testsRouter from './routes/test.routes.js';
import errorHandler from './middlewares/error.middleware.js';

app.use('/api/v1/question', questionRouter);
app.use('/api/v1/tests', testsRouter);
app.use(errorHandler);

export { app };
