import express from "express";
import {
    listarHistorico,
    buscarHistoricoPorId,
    deletarHistorico
} from "../controllers/historicoSolicitacaoController.js";
const router = express.Router();

router.get("/historico", listarHistorico);
router.get("/historico/:id", buscarHistoricoPorId);
router.delete("/historico/:id", deletarHistorico);

export default router;