import express from "express";
import {
  listarSetor,
  cadastrarSetor,
  buscarSetorPorId,
  atualizarSetor,
  deletarSetor
} from "../controllers/setoresController.js";
const router = express.Router();

router.get("/setores", listarSetor);
router.post("/setores", cadastrarSetor);
router.get("/setores/:id", buscarSetorPorId);
router.put("/setores/:id", atualizarSetor);
router.delete("/setores/:id", deletarSetor);

export default router;