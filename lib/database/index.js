import mongoose from "mongoose";

const cached = global.mongoose || { conn: null, promise: null };

const MONGO_URI = process.env.MONGO_URI || null;

export const connectDB = async () => {
  try {
    if (cached.conn) return cached.conn;
    if (!MONGO_URI) throw new Error("Database uri is missing");
    cached.promise =
      cached.promise ||
      (await mongoose.connect(MONGO_URI, {
        dbName: "testMvp2",
        bufferCommands: false,
      }));

    cached.conn = cached.promise;
    console.log("connected");
    return cached.conn;
  } catch (error) {
    console.log(error);
  }
};
