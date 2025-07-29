import express from "express";
import cors from "cors";
import db from "./database.js"; // seu módulo de conexão Firebird

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/cadastro", (req, res) => {
  const { NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA } = req.body;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      INSERT INTO USUARIOS (NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    conn.query(sql, [NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA], (err2) => {
      conn.detach();

      if (err2) return res.status(500).json({ error: err2.message });

      // Firebird não retorna insertId, então retornamos os dados enviados
      return res.status(201).json({
        message: "Usuário cadastrado com sucesso",
        usuario: { NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA }
      });
    });
  });
});

app.get("/cadastro", (req, res) => {
  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("SELECT * FROM USUARIOS", (err2, result) => {
      conn.detach();

      if (err2) return res.status(500).json({ error: err2.message });

      return res.json(result);
    });
  });
});

app.put("/cadastro/:id", (req, res) => {
  const { id } = req.params;
  console.log("ID recebido:", id); // 👈 isso ajuda a ver se está vindo corretamente

  const { NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA } = req.body;

  console.log("Dados recebidos:", req.body); // 👈 verifica se veio tudo certo

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      UPDATE USUARIOS 
      SET NOME_USUARIO = ?, 
          DEPARTAMENTO = ?, 
          CPF = ?, 
          EMAIL = ?, 
          TIPO_USUARIO = ?, 
          SENHA = ?
      WHERE ID_USUARIOS = ?
    `;

    conn.query(
      sql,
      [NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA, parseInt(id)],
      (err2) => {
        conn.detach();

        if (err2) return res.status(500).json({ error: err2.message });

        res.status(200).json({
          message: "Usuário atualizado com sucesso",
          usuario: { ID_USUARIOS: id, NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA }
        });
      }
    );
  });
});

app.delete("/cadastro/:id", (req, res) => {
  const id = parseInt(req.params.id); // garante que seja inteiro

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = "DELETE FROM USUARIOS WHERE ID_USUARIOS = ?";

    conn.query(sql, [id], (err2) => {
      conn.detach();

      if (err2) {
        return res.status(500).json({ error: err2.message });
      }

      // Firebird geralmente não retorna o número de linhas afetadas, mas tentamos verificar
      return res.status(200).json({
        message: `Usuário com ID ${id} deletado com sucesso.`,
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});