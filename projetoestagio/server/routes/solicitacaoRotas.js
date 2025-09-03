import express from "express";
import {
  cadastrarSolicitacao,
  listarSolicitacoes,
  atribuirResponsavel,
  alterarStatus,
  deletarSolicitacao
} from "../controllers/solicitacoesController.js";
const router = express.Router();

router.post("/solicitacoes", cadastrarSolicitacao);
router.get("/solicitacoes", listarSolicitacoes);
router.put("/solicitacoes/:id/atribuir", atribuirResponsavel);
router.put("/solicitacoes/:id/status", alterarStatus);
router.delete("/solicitacoes/:id", deletarSolicitacao);


export default router;