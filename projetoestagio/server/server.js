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
import dashboardRoutes from "./routes/dashboardRotas.js"
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", usuariosRoutes);
app.use("/api", servicosRoutes);
app.use("/api", solicitacoesRoutes);
app.use("/api", setoresRoutes);
app.use("/api", historicoRoutes);
app.use("/api", pecasRoutes);
app.use("/api", solicitacoesPecasRoutes);
app.use("/api", estoquePecasRoutes);
app.use("/api", movimentacaoEstoqueRoutes);
app.use("/api", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});