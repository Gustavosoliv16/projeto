import express from "express";
import { registrarMovimentacao, listarMovimentacoes } from "../controllers/movimentacaoEstoque.js";

const router = express.Router();

router.post("/movimentacao", registrarMovimentacao);
router.get("/movimentacao", listarMovimentacoes);

export default router;