import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('AI Backend Running');
});

// Import route handlers
import askRoute from './api/ask.js';
import summarizeRoute from './api/summarize.js';

// Register routes
app.use('/', askRoute);
app.use('/', summarizeRoute);

// Start server for local development
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;