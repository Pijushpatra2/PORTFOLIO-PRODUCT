import express from "express";
import {
  forgotPassword,
  getUser,
  getUserForPortfolio,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
  updateProfile, 
} from "../controller/userController.js";
import { isAuthentication } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthentication, logout);
router.get("/me", isAuthentication, getUser);
router.put("/update/me", isAuthentication, updateProfile);
router.put("/update/password", isAuthentication, updatePassword);
router.get("/me/portfolio", getUserForPortfolio);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
