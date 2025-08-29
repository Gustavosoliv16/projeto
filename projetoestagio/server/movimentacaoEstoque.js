import db from "../database.js";

export function registrarMovimentacao(req, res) {
  const { ID_PECA, QUANTIDADE, TIPO } = req.body;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      INSERT INTO MOVIMENTACAO_ESTOQUE (ID_PECA, QUANTIDADE, TIPO)
      VALUES (?, ?, ?)
    `;

    conn.query(sql, [ID_PECA, QUANTIDADE, TIPO], (err2) => {
      conn.detach();
      if (err2) {
        return res.status(500).json({ error: err2.message });
      }

      res.status(201).json({
        message: "Movimentação registrada com sucesso",
        movimentacao: { ID_PECA, QUANTIDADE, TIPO },
      });
    });
  });
}

export function listarMovimentacoes(req, res) {
  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("SELECT * FROM MOVIMENTACAO_ESTOQUE", (err2, result) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(result);
    });
  });
}