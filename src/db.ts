import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL;

const connectDB = async (): Promise<Connection> => {
  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    } as any);

    console.log('Connected to MongoDB');
    return connection.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;
