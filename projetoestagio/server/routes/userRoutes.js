import express from "express";
import {
  listarUsuarios,
  cadastrarUsuario,
  atualizarUsuario,
  deletarUsuario,
  login,
} from "../controllers/UserController.js";
import { listarUsuariosPaginado } from "../controllers/userpage.js";

const router = express.Router();

router.get("/cadastro", listarUsuarios);
router.post("/cadastro", cadastrarUsuario);
router.get("/cadastro/paginado", listarUsuariosPaginado);
router.put("/cadastro/:id", atualizarUsuario);
router.delete("/cadastro/:id", deletarUsuario);
router.post("/login", login)

export default router;