require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const pathakRoutes = require('./routes/pathak.routes');
const adminRoutes = require('./routes/admin.routes');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

// Auto-update the admin referral code to ensure live DB is synced
prisma.admin.updateMany({
  where: { email: 'abhijeetambhore4@gmail.com' },
  data: { referralCode: 'worldrecord' }
}).then(() => console.log('Admin referral code verified.')).catch(console.error);

const PORT = process.env.PORT || 5000;

const path = require('path');

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pathak', pathakRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Guinness World Records API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});