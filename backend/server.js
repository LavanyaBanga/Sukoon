const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sukoon API is breathing peacefully.' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/moods', require('./routes/moodRoutes'));
app.use('/api/journals', require('./routes/journalRoutes'));
app.use('/api/gratitude', require('./routes/gratitudeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/mindfulness', require('./routes/mindfulnessRoutes'));
app.use('/api/selfcare', require('./routes/selfCareRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sukoon server running on port ${PORT}`));
