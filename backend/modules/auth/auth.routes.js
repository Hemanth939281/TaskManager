import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { login, signup } from "./auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;