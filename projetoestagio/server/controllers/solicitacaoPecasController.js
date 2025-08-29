import db from "../database.js";

export function adicionarPecaSolicitacao(req, res) {
  const { ID_SOLICITACAO, ID_PECA, QUANTIDADE_USADA } = req.body;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.transaction(db.ISOLATION_READ_COMMITTED, (err2, tx) => {
      if (err2) {
        conn.detach();
        return res.status(500).json({ error: err2.message });
      }

      tx.query(
        `INSERT INTO SOLICITACAO_PECAS (ID_SOLICITACAO, ID_PECA, QUANTIDADE_USADA) VALUES (?, ?, ?)`,
        [ID_SOLICITACAO, ID_PECA, QUANTIDADE_USADA],
        (err3) => {
          if (err3) {
            tx.rollback(() => conn.detach());
            return res.status(500).json({ error: err3.message });
          }

          tx.query(
            `UPDATE ESTOQUE_PECAS SET QUANTIDADE = QUANTIDADE - ? WHERE ID_PECA = ?`,
            [QUANTIDADE_USADA, ID_PECA],
            (err4) => {
              if (err4) {
                tx.rollback(() => conn.detach());
                return res.status(500).json({ error: err4.message });
              }

              tx.commit((err5) => {
                conn.detach();
                if (err5) return res.status(500).json({ error: err5.message });

                res.status(201).json({
                  message: "Peça vinculada à solicitação e estoque atualizado com sucesso",
                });
              });
            }
          );
        }
      );
    });
  });
}

export function listarPecasPorSolicitacao(req, res) {
  const { id } = req.params;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      SELECT sp.ID_SOLICITACAO,
             sp.ID_PECA,
             ep.NOME_PECA,
             sp.QUANTIDADE_USADA
      FROM SOLICITACAO_PECAS sp
      JOIN ESTOQUE_PECAS ep ON sp.ID_PECA = ep.ID_PECA
      WHERE sp.ID_SOLICITACAO = ?
    `;

    conn.query(sql, [id], (err2, result) => {
      conn.detach();

      if (err2) return res.status(500).json({ error: err2.message });

      if (result.length === 0) {
        return res.status(404).json({ message: "Nenhuma peça encontrada para esta solicitação." });
      }

      res.json({
        solicitacao: id,
        pecas: result
      });
    });
  });
}

export function removerPecaSolicitacao(req, res) {
  const { idSolicitacao, idPeca } = req.params;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.transaction(db.ISOLATION_READ_COMMITTED, (err2, tx) => {
      if (err2) {
        conn.detach();
        return res.status(500).json({ error: err2.message });
      }

      tx.query(
        `SELECT QUANTIDADE_USADA 
         FROM SOLICITACAO_PECAS 
         WHERE ID_SOLICITACAO = ? AND ID_PECA = ?`,
        [idSolicitacao, idPeca],
        (err3, result) => {
          if (err3) {
            tx.rollback(() => conn.detach());
            return res.status(500).json({ error: err3.message });
          }

          if (result.length === 0) {
            tx.rollback(() => conn.detach());
            return res.status(404).json({ message: "Peça não encontrada nesta solicitação." });
          }

          const quantidadeUsada = result[0].QUANTIDADE_USADA;

          tx.query(
            `DELETE FROM SOLICITACAO_PECAS 
             WHERE ID_SOLICITACAO = ? AND ID_PECA = ?`,
            [idSolicitacao, idPeca],
            (err4) => {
              if (err4) {
                tx.rollback(() => conn.detach());
                return res.status(500).json({ error: err4.message });
              }

              tx.query(
                `UPDATE ESTOQUE_PECAS 
                 SET QUANTIDADE = QUANTIDADE + ? 
                 WHERE ID_PECA = ?`,
                [quantidadeUsada, idPeca],
                (err5) => {
                  if (err5) {
                    tx.rollback(() => conn.detach());
                    return res.status(500).json({ error: err5.message });
                  }

                  tx.commit((err6) => {
                    conn.detach();
                    if (err6) return res.status(500).json({ error: err6.message });

                    res.json({
                      message: "Peça removida da solicitação e estoque atualizado com sucesso"
                    });
                  });
                }
              );
            }
          );
        }
      );
    });
  });
}