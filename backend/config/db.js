import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://sk1218180_db_user:Shivam123@cluster0.ul5gpqp.mongodb.net/Expense")
    .then(() => console.log("Connected to MongoDB"));
}