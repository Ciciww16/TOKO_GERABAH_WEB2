// backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import categoriesRoutes from './routes/categories.js';
import productsRoutes from './routes/products.js';
import transactionRoutes from './routes/transaction.js';
import usersRoutes from './routes/users.js';
import profileRoutes from './routes/profile.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// API ROUTES
// ============================================

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        msg: 'Welcome to SC Pottery Store API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/categories', categoriesRoutes);
app.use('/products', productsRoutes);
app.use('/transactions', transactionRoutes);
app.use('/users', usersRoutes);
app.use('/profile', profileRoutes);
app.use('/dashboard', dashboardRoutes);

// ============================================
// 404 HANDLER
// ============================================
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        msg: 'Route not found'
    });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        msg: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log('\n=================================');
    console.log(`🚀 SERVER RUNNING`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌍 URL: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('=================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, closing server...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received, closing server...');
    process.exit(0);
});

export default app;