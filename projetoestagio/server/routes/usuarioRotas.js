import express from "express";
import {
  listarUsuarios,
  cadastrarUsuario,
  atualizarUsuario,
  deletarUsuario,
  login,
} from "../controllers/usuariosController.js";
import {isAdmin} from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/login", login)

router.get("/cadastro", isAdmin, listarUsuarios);
router.post("/cadastro", isAdmin,cadastrarUsuario);
router.put("/cadastro/:id", isAdmin,atualizarUsuario);
router.delete("/cadastro/:id", isAdmin,deletarUsuario);

export default router;