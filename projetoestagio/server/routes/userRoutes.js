import express from "express";
import {
  listarUsuarios,
  cadastrarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../controllers/usuariosController.js";
import { listarUsuariosPaginado } from "../controllers/usuarioPaginacao.js";

const router = express.Router();

router.get("/cadastro", listarUsuarios);
router.post("/cadastro", cadastrarUsuario);
router.get("/cadastro/paginado", listarUsuariosPaginado);
router.put("/cadastro/:id", atualizarUsuario);
router.delete("/cadastro/:id", deletarUsuario);

export default router;