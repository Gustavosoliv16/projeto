import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", isAdmin, getDashboardStats);

export default router;