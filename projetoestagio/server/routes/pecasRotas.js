import express from "express";
import {
    cadastrarPeca,
    listarPecas,
    listarPecasPorId,
    atualizarPeca,
    deletarPeca
} from "../controllers/pecasController.js";
const router = express.Router();

router.post("/pecas", cadastrarPeca);
router.get("/pecas", listarPecas);
router.get("/pecas/:id", listarPecasPorId);
router.put("/pecas/:id", atualizarPeca);
router.delete("/pecas/:id", deletarPeca);

export default router;