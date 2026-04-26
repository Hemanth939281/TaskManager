import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import { connectDb } from "./config/db.js"
import taskRoutes from "./modules/task/task.routes.js";
import authRoutes from "./modules/auth/auth.routes.js"
dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const startServer = async () => {
    try {
        await connectDb();

        app.listen(process.env.PORT, () => {
            console.log(`server is running on ${process.env.PORT}`);
        });

    } catch (error) {
        console.log("Failed to start server:", error.message);
    }
};

startServer();

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
  });
});