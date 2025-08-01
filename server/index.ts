import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { config } from 'dotenv';
import { bookingsRouter } from './routes/bookings';
import { bandsRouter } from './routes/bands';
import { venuesRouter } from './routes/venues';
// import { replitOIDC } from './auth/replitOIDC'; // Optional for Replit Auth if needed

// Load environment variables from .env
config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true if HTTPS
    httpOnly: true,
    sameSite: 'lax',
  }
}));

// Optional: Replit OIDC auth (uncomment if needed)
// app.use(replitOIDC);

// Routers
app.use('/api/bookings', bookingsRouter);
app.use('/api/bands', bandsRouter);
app.use('/api/venues', venuesRouter);

// Health check
app.get('/api/test', (_req, res) => {
  res.json({ message: 'Server is up and running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
