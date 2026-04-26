import AppError from "../../utils/AppError.js";
import { generateToken } from "../../utils/generateToken.js";
import User from "../user/user.model.js";
import bcrypt from "bcryptjs";

const regex = /^\S+@\S+\.\S+$/;

export const signup = async (data) => {
  const { name, email, password } = data;
  if (!name || !email || !password) {
    throw new AppError("All fields are required", 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  if (!regex.test(normalizedEmail)) {
    throw new AppError("Please provide valid email address", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try{
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: "user",
  });

  const token = generateToken(user);
  const { password: _, ...safeUser } = user.toObject();
  return {
    token,
    user: safeUser,
  };
}catch(error){
    if (error.code === 11000) {
      throw new AppError("User already exists", 400);
    }

    throw error
}
};

export const login = async (data) => {
  const { email, password } = data;
  if (!email || !password) {
    throw new AppError("All fields are required", 400);
  }
  const normalizedEmail = email.toLowerCase().trim();
  if (!regex.test(normalizedEmail)) {
    throw new AppError("Please provide valid email address", 400);
  }

  const user = await User.findOne({ email: normalizedEmail });
  if(!user){
    throw new AppError("Invalid credentials", 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if(!isValidPassword){
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken(user);
  const { password: _, ...safeUser } = user.toObject();
  return {
    token,
    user: safeUser,
  };
};
