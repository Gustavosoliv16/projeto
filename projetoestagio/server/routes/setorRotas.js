import express from "express";
import {
  listarSetor,
  cadastrarSetor,
  buscarSetorPorId,
  atualizarSetor,
  deletarSetor
} from "../controllers/setorController.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/setores", listarSetor);

router.post("/setores", isAdmin,cadastrarSetor);
router.get("/setores/:id", isAdmin,buscarSetorPorId);
router.put("/setores/:id", isAdmin, atualizarSetor);
router.delete("/setores/:id", isAdmin, deletarSetor);

export default router;