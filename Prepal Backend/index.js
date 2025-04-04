import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './db/connectDB.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Use ES6 import for cors

const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['https://preppalaibyvidit.vercel.app', 'https://preppalbyparthnvidit.vercel.app', 'http://localhost:5173'], // Allow only your React app to make requests
  credentials: true, // Allow cookies to be sent across origins if needed
  optionsSuccessStatus: 200 // Handle legacy browsers
};

// Apply CORS middleware before other routes and middleware
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Connect to Database and Start Server
connectDB()
  .then(() => {
    app.listen(5000, () => {
      console.log('Server started ⛭ on port 5000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database', error);
  });
