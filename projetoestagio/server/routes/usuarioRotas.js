import express from "express";
import {
  listarUsuarios,
  cadastrarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../controllers/usuariosController.js";

const router = express.Router();

router.get("/cadastro", listarUsuarios);
router.post("/cadastro", cadastrarUsuario);
router.put("/cadastro/:id", atualizarUsuario);
router.delete("/cadastro/:id", deletarUsuario);

export default router;