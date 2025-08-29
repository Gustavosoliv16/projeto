import db from "../database.js";

export function cadastrarSetor(req, res) {
  const { NOME_SETOR } = req.body;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("INSERT INTO SETOR (NOME_SETOR) VALUES (?)", [NOME_SETOR], (err2) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });

      res.status(201).json({
        message: "Setor cadastrado com sucesso",
        setor: { NOME_SETOR }
      });
    });
  });
}

export function listarSetor(req, res) {
  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("SELECT * FROM SETOR", (err2, result) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(result);
    });
  });
}

export function buscarSetorPorId(req, res) {
  const { id } = req.params;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("SELECT * FROM SETOR WHERE ID_SETOR = ?", [id], (err2, result) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(result);
    });
  });
}

export function atualizarSetor(req, res) {
  const { id } = req.params;
  const { NOME_SETOR } = req.body;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      UPDATE SETOR
      SET NOME_SETOR = ?
      WHERE ID_SETOR = ?
    `;

    conn.query(
      sql,
      [NOME_SETOR, parseInt(id)],
      (err2) => {
        conn.detach();
        if (err2) return res.status(500).json({ error: err2.message });

        res.status(200).json({
          message: "Setor atualizado com sucesso",
          setor: { ID_SETOR: id, NOME_SETOR }
        });
      }
    );
  });
}

export function deletarSetor(req, res) {
  const { id } = req.params;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("DELETE FROM SETOR WHERE ID_SETOR = ?", [id], (err2) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });

      res.status(200).json({
        message: "Setor excluído com sucesso",
        setor: { ID_SETOR: id }
      });
    });
  });
}