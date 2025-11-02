import dotenv from 'dotenv';
import { app } from './app.js';
import connectDB from './config/db.js';
import express from 'express';

dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
