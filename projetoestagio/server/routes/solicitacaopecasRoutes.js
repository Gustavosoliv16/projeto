import express from "express";
import {
  adicionarPecaSolicitacao,
  listarPecasPorSolicitacao,
  removerPecaSolicitacao
} from "../controllers/solicitacaoPecasController.js";
const router = express.Router();

router.post("/solicitacoes/:id", adicionarPecaSolicitacao);
router.get("/solicitacoes/:id/pecas", listarPecasPorSolicitacao);
router.delete("/solicitacoes/:idSolicitacao/pecas/:idPeca", removerPecaSolicitacao);

export default router;