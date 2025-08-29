import db from "../database.js";

export const listarEstoque = (req, res) => {
  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      SELECT 
        P.NOME,
        SUM(E.QUANTIDADE) AS QUANTIDADE
      FROM ESTOQUE_PECAS E
      JOIN PECAS P ON P.ID_PECA = E.ID_PECA
      GROUP BY P.NOME
      ORDER BY P.NOME
    `;

    conn.query(sql, (err2, result) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });

      res.status(200).json(result);
    });
  });
};