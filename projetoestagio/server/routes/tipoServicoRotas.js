import express from "express";
import {
  listarServicos,
  cadastrarServico,
  atualizarServico,
  deletarServico
} from "../controllers/tipoServicoController.js";
const router = express.Router();

router.get("/servicos", listarServicos);
router.post("/servicos", cadastrarServico);
router.put("/servicos/:id", atualizarServico);
router.delete("/servicos/:id", deletarServico);

export default router;