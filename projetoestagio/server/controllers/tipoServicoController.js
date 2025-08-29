import db from "../database.js";

export function listarServicos(req, res) {
  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("SELECT * FROM TIPO_SERVICO", (err2, result) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(result);
    });
  });
}

export function cadastrarServico(req, res) {
  const { NOME_SERVICO } = req.body;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("INSERT INTO TIPO_SERVICO (NOME_SERVICO) VALUES (?)", [NOME_SERVICO], (err2) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });

      res.status(201).json({
        message: "Tipo Serviço cadastrado com sucesso",
        servico: { NOME_SERVICO }
      });
    });
  });
}

export function atualizarServico(req, res) {
  const { id } = req.params;
  const { NOME_SERVICO } = req.body;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      UPDATE TIPO_SERVICO
      SET NOME_SERVICO = ?
      WHERE ID_SERVICO = ?
    `;

    conn.query(
      sql,
      [NOME_SERVICO, parseInt(id)],
      (err2) => {
        conn.detach();
        if (err2) return res.status(500).json({ error: err2.message });

        res.status(200).json({
          message: "Serviço atualizado com sucesso",
          servico: { ID_SERVICO: id, NOME_SERVICO }
        });
      }
    );
  });
}

export function deletarServico(req, res) {
  const id = parseInt(req.params.id);

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const checkSql = "SELECT COUNT(*) AS total FROM SOLICITACOES WHERE ID_SERVICO = ?";

    conn.query(checkSql, [id], (err2, result) => {
      if (err2) {
        conn.detach();
        return res.status(500).json({ error: err2.message });
      }

      const total = result[0].TOTAL;
      if (total > 0) {
        conn.detach();
        return res.status(400).json({
          error: `Não é possível excluir o serviço ${id}, pois ele está associado a ${total} solicitação(ões).`
        });
      }

      const deleteSql = "DELETE FROM TIPO_SERVICO WHERE ID_SERVICO = ?";
      conn.query(deleteSql, [id], (err3) => {
        conn.detach();
        if (err3) return res.status(500).json({ error: err3.message });

        res.status(200).json({
          message: `Serviço com ID ${id} deletado com sucesso.`,
        });
      });
    });
  });
}