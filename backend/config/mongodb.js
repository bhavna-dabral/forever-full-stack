// connectDB.js
import mongoose from 'mongoose';

const connectDB = async () => {
  mongoose.connection.on('connected', () => {
    console.log('DB connected:', mongoose.connection.name);
  });

  await mongoose.connect(process.env.MONGODB_URI); // <-- DO NOT append /forever
};

export default connectDB;
