import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import connectDB from './db/connect.js';

import { authRouter, userRouter } from './routes/index.js';

import errorHandlerMiddleware from './middleware/error-handler-middleware.js';

const app = express();

//미들웨어
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('DB 연결됨');
    app.listen(PORT, () => {
      console.log(`현재 앱이 http://localhost:${PORT}  에서 구동중입니다...`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
