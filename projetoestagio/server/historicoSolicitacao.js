import db from "../database.js";

export function listarHistorico(req, res) {
  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("SELECT * FROM HISTORICO_SOLICITACOES", (err2, result) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(result);
    });
  });
}

export function buscarHistoricoPorId(req, res) {
  const id = parseInt(req.params.id);

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("SELECT * FROM HISTORICO_SOLICITACOES WHERE ID_HISTORICO = ?", [id], (err2, result) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(result);
    });
  });
}

export function deletarHistorico(req, res) {
  const id = parseInt(req.params.id);

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("DELETE FROM HISTORICO_SOLICITACOES WHERE ID_HISTORICO = ?", [id], (err2) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "Histórico deletado com sucesso" });
    });
  });
}