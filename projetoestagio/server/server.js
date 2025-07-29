import express from "express";
import cors from "cors";
import db from "./database.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/cadastro", (req, res) => {
  const { NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA } = req.body;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query(
      "INSERT INTO USUARIOS (NOME_USUÁRIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUÁRIO, SENHA) VALUES (?, ?, ?, ?, ?, ?)",
      [NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA],
      (err, result) => {
        conn.detach();
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ id: result.insertId, NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA });
      }
    );
  });
});

app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

app.get("/cadastro", (req, res) => {
  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("SELECT * FROM USUARIOS", (err, result) => {
      conn.detach();
      if (err) return res.status(500).json({ error: err.message });

      res.json(result);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
