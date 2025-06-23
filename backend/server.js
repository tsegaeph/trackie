const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', require('./routes/chat'));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const assignmentRoutes = require('./routes/assignmentRoutes');
app.use('/api/assignments', assignmentRoutes);

const classScheduleRoutes = require('./routes/classScheduleRoutes');
app.use('/api/classschedule', classScheduleRoutes);

const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);

const budgetGoalRoutes = require('./routes/budgetGoalRoutes');
app.use('/api/budgetgoals', budgetGoalRoutes);

const waterIntakeRoutes = require('./routes/waterIntakeRoutes');
app.use('/api/water', waterIntakeRoutes);

const mealTrackerRoutes = require('./routes/mealTrackerRoutes');
app.use('/api/meals', mealTrackerRoutes);

const quoteRoutes = require('./routes/quoteRoutes');
app.use('/api/quotes', quoteRoutes);

app.use('/api/chat', require('./routes/chat'));

// ---------- ADD THIS LINE BELOW for your AI upload endpoints ----------
app.use('/api', require('./routes/aiUploadRoutes'));
// ---------------------------------------------------------------------

// MongoDB connection (cleaned)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('🌐 Backend is running...');
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});