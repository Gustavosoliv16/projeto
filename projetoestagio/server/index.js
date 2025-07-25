// server/index.js
import express from "express";

const app = express();
const PORT = 3001;

app.get("/", (req, res) => {
  res.send("Servidor funcionando com sucesso");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em localhost:${PORT}`);
});

