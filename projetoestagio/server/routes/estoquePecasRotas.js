import express from "express";
import {
    listarEstoque,
} from "../controllers/estoquePecasController.js";
const router = express.Router();

router.get("/estoque", listarEstoque);

export default router;