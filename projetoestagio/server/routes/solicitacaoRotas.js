import express from "express";
import {
  cadastrarSolicitacao,
  listarSolicitacoes,
  atribuirResponsavel,
  alterarStatus,
  deletarSolicitacao,
  responderSolicitacao
} from "../controllers/solicitacoesController.js";

import { isAdmin} from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/solicitacoes", cadastrarSolicitacao);
router.get("/solicitacoes", listarSolicitacoes);
router.put("/solicitacoes/:id/atribuir",isAdmin, atribuirResponsavel);
router.put("/solicitacoes/:id/status",isAdmin, alterarStatus);
router.delete("/solicitacoes/:id", isAdmin, deletarSolicitacao);

router.put("/solicitacoes/:id/responder", isAdmin, responderSolicitacao);

export default router;