import * as authService from "./auth.service.js";

// POST /api/signup
export const signup = async (req, res) => {
  try {
    const data = await authService.signup(req.body);
    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
     return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/login
export const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

