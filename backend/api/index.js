import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for all routes with Vercel-specific settings
app.use(cors({
  origin: "*", // Allow all origins for simplicity, but you can restrict this to your frontend domain
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('AI Backend Running');
});

export default app;