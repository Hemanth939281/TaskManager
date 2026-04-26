import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("No token provided", 401);
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new AppError("Invalid token format", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError("Token is missing", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError("Invalid or expired token", 401),
    );
  }
};
