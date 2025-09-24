import db from "../database.js";

export const cadastrarPeca = (req, res) => {
  const { NOME, DESCRICAO, MODELO, MARCA, FORNECEDOR, PATRIMONIO } = req.body;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });


    conn.query(
      `INSERT INTO PECAS (NOME, DESCRICAO, MODELO, MARCA, FORNECEDOR, PATRIMONIO) 
       VALUES (?, ?, ?, ?, ?, ?) RETURNING ID_PECA`,
      [NOME, DESCRICAO, MODELO, MARCA, FORNECEDOR, PATRIMONIO],
      (err2, result) => {
        if (err2) {
          conn.detach();
          return res.status(500).json({ error: err2.message });
        }

        const idPeca = result.ID_PECA;

        conn.query(
          "SELECT ID_PECA, QUANTIDADE FROM ESTOQUE_PECAS WHERE ID_PECA = ?",
          [idPeca],
          (err3, estoqueResult) => {
            if (err3) {
              conn.detach();
              return res.status(500).json({ error: err3.message });
            }

            if (estoqueResult.length > 0) {
              conn.query(
                "UPDATE ESTOQUE_PECAS SET QUANTIDADE = QUANTIDADE + 1 WHERE ID_PECA = ?",
                [idPeca],
                (err4) => {
                  conn.detach();
                  if (err4)
                    return res.status(500).json({ error: err4.message });

                  res.status(201).json({
                    message:
                      "Peça cadastrada e quantidade atualizada no estoque.",
                    peca: {
                      ID_PECA: idPeca,
                      NOME,
                      DESCRICAO,
                      MODELO,
                      MARCA,
                      FORNECEDOR,
                      PATRIMONIO,
                    },
                  });
                }
              );
            } else {
              conn.query(
                "INSERT INTO ESTOQUE_PECAS (ID_PECA, QUANTIDADE) VALUES (?, ?)",
                [idPeca, 1],
                (err4) => {
                  conn.detach();
                  if (err4)
                    return res.status(500).json({ error: err4.message });

                  res.status(201).json({
                    message:
                      "Peça cadastrada e adicionada ao estoque com sucesso.",
                    peca: {
                      ID_PECA: idPeca,
                      NOME,
                      DESCRICAO,
                      MODELO,
                      MARCA,
                      FORNECEDOR,
                      PATRIMONIO,
                    },
                  });
                }
              );
            }
          }
        );
      }
    );
  });
};

export function listarPecas(req, res) {
  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("SELECT * FROM PECAS", (err2, result) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(result);
    });
  });
}

export function listarPecasPorId(req, res) {
  const { id } = req.params;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("SELECT * FROM PECAS WHERE ID_PECA = ?", [id], (err2, result) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(result);
    });
  });
}

export function atualizarPeca(req, res) {
  const { id } = req.params;
  const { NOME, DESCRICAO, MODELO, MARCA, FORNECEDOR, PATRIMONIO } = req.body;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      UPDATE PECAS
      SET NOME = ?,
          DESCRICAO = ?,
          MODELO = ?,
          MARCA = ?,
          FORNECEDOR = ?,
          PATRIMONIO = ?
      WHERE ID_PECA = ?
    `;

    conn.query(
      sql,
      [NOME, DESCRICAO, MODELO, MARCA, FORNECEDOR, PATRIMONIO, parseInt(id)],
      (err2) => {
        conn.detach();
        if (err2) return res.status(500).json({ error: err2.message });

        res.status(200).json({
          message: "Peça atualizada com sucesso",
          peca: { ID: id, NOME, DESCRICAO, MODELO, MARCA, FORNECEDOR, PATRIMONIO }
        });
      }
    );
  });
}

export function deletarPeca(req, res) {
  const id = parseInt(req.params.id);

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

  conn.transaction(db.ISOLATION_READ_COMMITTED, (err, tx) => {
      if (err) {
        conn.detach();
        return res.status(500).json({ error: "Erro ao iniciar a transação: " + err.message });
      }


      tx.query("DELETE FROM ESTOQUE_PECAS WHERE ID_PECA = ?", [id], (errEstoque) => {
        if (errEstoque) {
          return tx.rollback(() => {
            conn.detach();
            console.error("Erro ao apagar do estoque:", errEstoque);
            return res.status(500).json({ error: "Erro ao apagar registo do estoque." });
          });
        }
        tx.query("DELETE FROM PECAS WHERE ID_PECA = ?", [id], (errPeca) => {
          if (errPeca) {
            return tx.rollback(() => {
              conn.detach();
              console.error("Erro ao apagar a peça:", errPeca);
              return res.status(500).json({ error: "Erro ao apagar a peça principal." });
            });
          }

          tx.commit((errCommit) => {
            conn.detach();
            if (errCommit) {
              return res.status(500).json({ error: "Erro ao confirmar a transação." });
            }
            res.status(200).json({
              message: `Peça com ID ${id} e o seu registo de stock foram apagados com sucesso.`,
            });
          });
        });
      });
    });
  });
}