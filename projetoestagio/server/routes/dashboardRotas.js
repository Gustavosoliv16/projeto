import express from "express";
import { listarSolicitacoes, responderSolicitacao } from "../controllers/dashboardController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", verifyToken, listarSolicitacoes);
router.get("/dashboard-update", verifyToken, responderSolicitacao);
export default router;