import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import newsImageRouter from './routes/newsImage.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use('/generated', express.static(path.join(__dirname, '../public/generated')));

// Routes
app.use('/news-image', newsImageRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 DailyFeed Images Service running on port ${PORT}`);
  console.log(`📸 Access endpoint: http://localhost:${PORT}/news-image?id=ARTICLE_ID`);
});

