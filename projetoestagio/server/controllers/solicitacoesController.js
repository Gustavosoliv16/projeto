import db from "../database.js";

export function cadastrarSolicitacao(req, res) {
  const { ID_USUARIO_SOLICITANTE, ID_USUARIO_RESPONSAVEL, DESCRICAO } = req.body;

  if (!ID_USUARIO_SOLICITANTE || !DESCRICAO) {
    return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
  }

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      INSERT INTO SOLICITACOES (
        ID_USUARIO_SOLICITANTE, DESCRICAO, STATUS
      ) VALUES (?, ?, ?)
    `;

    const params = [
      ID_USUARIO_SOLICITANTE,
      DESCRICAO,
      "ABERTA"
    ];

    conn.query(sql, params, (err2) => {
      conn.detach();
      if (err2) {
        console.error("Erro ao inserir solicitação:", err2);
        return res.status(500).json({ error: err2.message });
      }
      res.status(201).json({
        message: "Solicitação criada com sucesso!",
        dados: { ID_USUARIO_SOLICITANTE, ID_USUARIO_RESPONSAVEL, DESCRICAO, STATUS: "ABERTA" }
      });
    });
  });
}

export function listarSolicitacoes(req, res) {
  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("SELECT * FROM SOLICITACOES", (err2, result) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(result);
    });
  });
}

export function atribuirResponsavel(req, res) {
  const idSolicitacao = parseInt(req.params.id);
  const { ID_USUARIO_RESPONSAVEL } = req.body; 
  if (!ID_USUARIO_RESPONSAVEL) {
    return res.status(400).json({ error: "ID_USUARIO_RESPONSAVEL é obrigatório" });
  }

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      UPDATE SOLICITACOES
      SET ID_USUARIO_RESPONSAVEL = ?
      WHERE ID_SOLICITACAO = ?
    `;

    conn.query(sql, [ID_USUARIO_RESPONSAVEL, idSolicitacao], (err2) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });

      res.status(200).json({
        message: `Solicitação ${idSolicitacao} atribuída ao usuário ${ID_USUARIO_RESPONSAVEL}`,
      });
    });
  });
}

export function alterarStatus(req, res) {
  const idSolicitacao = parseInt(req.params.id);
  const { STATUS } = req.body;
  if (!STATUS) {
    return res.status(400).json({ error: "STATUS é obrigatório" });
  }

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      UPDATE SOLICITACOES
      SET STATUS = ?
      WHERE ID_SOLICITACAO = ?
    `;

    conn.query(sql, [STATUS, idSolicitacao], (err2) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });

      res.status(200).json({
        message: `Solicitação ${idSolicitacao} teve seu status alterado para ${STATUS}`,
      });
    });
  });
}

export function deletarSolicitacao(req, res) {
  const id = parseInt(req.params.id);

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = "DELETE FROM SOLICITACOES WHERE ID_SOLICITACAO = ?";

    conn.query(sql, [id], (err2) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });

      res.status(200).json({
        message: `Solicitação com ID ${id} deletada com sucesso.`,
      });
    });
  });
}