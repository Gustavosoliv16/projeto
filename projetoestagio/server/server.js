import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuarioRotas.js";
import servicosRoutes from "./routes/tipoServicoRotas.js"
import solicitacoesRoutes from "./routes/solicitacaoRotas.js";
import setoresRoutes from "./routes/setorRotas.js";
import historicoRoutes from "./routes/historicoSolicitacaoRotas.js";
import pecasRoutes from "./routes/pecasRotas.js";
import solicitacoesPecasRoutes from "./routes/solicitacaopecasRotas.js";
import estoquePecasRoutes from "./routes/estoquePecasRotas.js";
import movimentacaoEstoqueRoutes from "./routes/movimentacaoEstoqueRotas.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3001;

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