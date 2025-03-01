import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Database Connected Successfully");
    })
    .catch((error) => {
      console.error("Database Connection Failed:", error);
    });
};

export default connectDB;
