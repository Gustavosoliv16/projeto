import express from "express";
import {
  listarServicos,
  cadastrarServico,
  atualizarServico,
  deletarServico
} from "../controllers/tipoServicoController.js";
const router = express.Router();

router.get("/tipos-servico", listarServicos);
router.post("/tipos-servico", cadastrarServico);
router.put("/tipos-servico/:id", atualizarServico);
router.delete("/tipos-servico/:id", deletarServico);

export default router;