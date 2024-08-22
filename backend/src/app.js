import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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

// middleware imports
import errorHandler from './middlewares/error.middleware.js';
import verifyJwt from './middlewares/auth.middleware.js';

// route imports
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';
import questionRouter from './routes/question.routes.js';
import quizRouter from './routes/quiz.routes.js';
import attemptRouter from './routes/attempt.routes.js';

// route declarations
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', verifyJwt, userRouter);
app.use('/api/v1/admin', adminRouter);

app.use('/api/v1/question', questionRouter);
app.use('/api/v1/quiz', quizRouter);

app.use('/api/v1/attempt', attemptRouter);
app.use(errorHandler);

export { app };
