import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { mongoConnect } from './app/config/mongoConnect.js';
import  mainRoutes  from './app/routes/mainRoute.js';

dotenv.config();

await mongoConnect();

const PORT = process.env.PORT;

const app = express()

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, 
  }));
  
app.use("/", mainRoutes);

app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
})