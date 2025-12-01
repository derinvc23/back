const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully!');
    console.log('📁 Database:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:');
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Verify your IP is whitelisted in MongoDB Atlas (Network Access)');
    console.log('2. Check username and password in Database Access');
    console.log('3. Ensure the database user has proper permissions');
    process.exit(1);
  }
};

module.exports = { connectDB, mongoose };