import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';
    console.log('🔄 Connecting to MongoDB...');
    console.log('MongoDB URI:', mongoUri.replace(/:[^:@]+@/, ':****@')); // Hide password in logs
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('⚠️  Server will start without database connection');
    // Don't exit - allow server to start even if DB connection fails
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});
