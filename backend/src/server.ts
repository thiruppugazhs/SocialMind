import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import instagramRoutes from './routes/instagram.js';
import contentRoutes from './routes/content.js';
import trendsRoutes from './routes/trends.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/instagram', instagramRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/analytics', (req, res) => res.json({ message: 'Analytics endpoints' }));
app.use('/api/ai', (req, res) => res.json({ message: 'AI endpoints' }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    success: false, 
    error: err.message || 'Internal server error' 
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 SocialMind Backend running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
});
