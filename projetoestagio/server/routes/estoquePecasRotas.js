import express from "express";
import {
    listarEstoque,
} from "../controllers/estoqueController.js";
const router = express.Router();

router.get("/estoque", listarEstoque);

export default router;