import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/userRoutes.js";
import servicosRoutes from "./routes/servicoRoutes.js"
import solicitacoesRoutes from "./routes/solicitacaoRoutes.js";
import setoresRoutes from "./routes/setorRoutes.js";
import historicoRoutes from "./routes/historicoSolicitacaoRoutes.js";
import pecasRoutes from "./routes/pecaRoutes.js";
import solicitacoesPecasRoutes from "./routes/solicitacaopecasRoutes.js";
import estoquePecasRoutes from "./routes/estoqueRoutes.js";
import movimentacaoEstoqueRoutes from "./routes/movimentacaoEstoqueRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/", usuariosRoutes);
app.use("/", servicosRoutes);
app.use("/", solicitacoesRoutes);
app.use("/", setoresRoutes);
app.use("/", historicoRoutes);
app.use("/", pecasRoutes);
app.use("/", solicitacoesPecasRoutes);
app.use("/", estoquePecasRoutes);
app.use("/", movimentacaoEstoqueRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});