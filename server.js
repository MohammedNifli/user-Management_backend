// server.js or app.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import adminRoute from './routes/adminRoute.js';

const port = process.env.PORT || 8000;

const app = express();
connectDB();

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your specific origin
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions))

app.use('/api/users', userRoutes);
app.use('/api/admin',adminRoute);

app.get('/', (req, res) => {
  res.send('Server is ready');
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
