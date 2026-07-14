const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`successful to connect to database ${conn.connection.host}`);
  } catch (error) {
    console.error(`fail to connect to database ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;