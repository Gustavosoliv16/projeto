import express from "express";
import { listarSolicitacoes } from "../controllers/solicitacoesController.js"; 
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", verifyToken, listarSolicitacoes);

export default router;