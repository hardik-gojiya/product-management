import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Uses connection string from environment variables
 */
const connectDB = async () => {
  try {
    // Accept either MONGODB_URI or MONGO_URI for flexibility
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI

    if (!mongoUri || typeof mongoUri !== 'string') {
      console.error('MongoDB connection string is missing. Set MONGODB_URI or MONGO_URI in your environment.')
      process.exit(1)
    }

    const conn = await mongoose.connect(mongoUri, {
      // These options are defaults in Mongoose 6+, kept here for clarity
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;