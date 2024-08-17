import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/error.middleware.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use(cookieParser());

// route imports
import userRouter from './routes/user.routes.js';

// route declarations
app.use('/api/v1/user', userRouter);

app.use(errorHandler);

export { app };
