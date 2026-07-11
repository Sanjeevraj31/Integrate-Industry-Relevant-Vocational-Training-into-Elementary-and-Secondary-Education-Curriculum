const mongoose = require('mongoose');

let mongoConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillbridge';
  console.log('Attempting to connect to MongoDB...');
  
  try {
    // Set a low timeout so it fails quickly if MongoDB isn't running, switching to local DB fallback
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    mongoConnected = true;
    console.log('MongoDB Connected Successfully.');
  } catch (err) {
    mongoConnected = false;
    console.warn('WARNING: MongoDB connection failed. SkillBridge is operating in server-side Local JSON Fallback mode.');
  }
};

const isConnected = () => {
  return mongoConnected && mongoose.connection.readyState === 1;
};

module.exports = { connectDB, isConnected };
