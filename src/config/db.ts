import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const DB_NAME = process.env.DB_NAME;

if (!CONNECTION_STRING || !DB_NAME) {
  throw new Error('Database configuration environment variables are missing');
}

const MONGODB_URI = `${CONNECTION_STRING}${DB_NAME}`;

export const connectDB = async () => {
  try {
    // Replace with your actual Atlas connection string
    const uri = MONGODB_URI || 'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/biblioteca';
    
    await mongoose.connect(uri, {
      // Atlas specific options
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('MongoDB Atlas Connected...');
  } catch (err) {
    console.error('MongoDB Atlas connection error:', err);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});