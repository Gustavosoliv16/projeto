import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", verifyToken, getDashboardStats);

export default router;