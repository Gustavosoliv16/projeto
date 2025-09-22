import express from "express";
import {
  cadastrarSolicitacao,
  listarSolicitacoes,
  atribuirResponsavel,
  alterarStatus,
  deletarSolicitacao,
  responderSolicitacao,
  buscarSolicitacaoPorId
} from "../controllers/solicitacoesController.js";

import { isAdmin, verifyToken} from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/solicitacoes", verifyToken, cadastrarSolicitacao);
router.get("/solicitacoes", verifyToken, listarSolicitacoes); 
router.get("/solicitacoes/:id", verifyToken, buscarSolicitacaoPorId); 

router.put("/solicitacoes/:id/atribuir",isAdmin, atribuirResponsavel);
router.put("/solicitacoes/:id/status",isAdmin, alterarStatus);
router.delete("/solicitacoes/:id", isAdmin, deletarSolicitacao);
router.put("/solicitacoes/:id/responder", isAdmin, responderSolicitacao);

export default router;