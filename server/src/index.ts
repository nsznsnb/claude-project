import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase } from './config/database.js';
import todoRoutes from './routes/todos.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/todos', todoRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 静的ファイル配信（本番環境のみ）
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '..', 'public');
  app.use(express.static(publicPath));

  // SPAのルーティング対応（すべてのルートでindex.htmlを返す）
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Start server
const startServer = async () => {
  try {
    console.log(`🔧 Starting server on port ${PORT}...`);
    console.log(`📝 NODE_ENV: ${process.env.NODE_ENV}`);

    // Connect to database (non-blocking)
    await connectDatabase();

    // Start listening
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`✅ Server successfully started and listening`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

console.log('🎯 Initializing application...');
startServer();
