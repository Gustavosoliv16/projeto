// server/index.js
import express from "express";

const app = express();
const PORT = 3050;

app.get("/", (req, res) => {
  res.send("Servidor funcionando com sucesso");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em 192.168.3.20:${PORT}`);
});
