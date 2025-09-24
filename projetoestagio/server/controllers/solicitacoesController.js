import db from "../database.js";

export function cadastrarSolicitacao(req, res) {
  const { 
    ID_USUARIO_SOLICITANTE, 
    PATRIMONIO,
    DEFEITO_RELATADO 
  } = req.body;

  if (!ID_USUARIO_SOLICITANTE || !DEFEITO_RELATADO) {
    return res.status(400).json({ error: "O solicitante e a descrição do defeito são obrigatórios." });
  }

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      INSERT INTO SOLICITACOES (
        ID_USUARIO_SOLICITANTE, STATUS, DATA_CRIACAO, PATRIMONIO, DEFEITO_RELATADO
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const params = [
      ID_USUARIO_SOLICITANTE,
      "ABERTA",
      new Date(),
      PATRIMONIO || null,
      DEFEITO_RELATADO
    ];

    conn.query(sql, params, (err2) => {
      conn.detach();
      if (err2) {
        console.error("Erro ao inserir solicitação:", err2);
        return res.status(500).json({ error: err2.message });
      }
      res.status(201).json({
        message: "Solicitação criada com sucesso!",
      });
    });
  });
}

export function listarSolicitacoes(req, res) {
  
  if (!req.user || typeof req.user.id === 'undefined' || !req.user.tipo_usuario) {

    return res.status(401).json({ error: "Informações de autenticação inválidas ou ausentes no token. Por favor, faça login novamente." });
  }

  const { id, tipo_usuario } = req.user;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    let sql = `
      SELECT 
        s.ID_SOLICITACAO, s.STATUS, s.DATA_CRIACAO, s.DEFEITO_RELATADO,
        s.DEFEITO_ENCONTRADO, u_sol.NOME_USUARIO AS NOME_SOLICITANTE,
        u_resp.NOME_USUARIO AS NOME_RESPONSAVEL, st.NOME_SETOR
      FROM SOLICITACOES s
      LEFT JOIN USUARIOS u_sol ON s.ID_USUARIO_SOLICITANTE = u_sol.ID_USUARIOS
      LEFT JOIN USUARIOS u_resp ON s.ID_USUARIO_RESPONSAVEL = u_resp.ID_USUARIOS
      LEFT JOIN SETOR st ON u_sol.ID_SETOR = st.ID_SETOR
    `;
    const params = [];

    if (tipo_usuario !== 'administrador') {
      sql += ' WHERE s.ID_USUARIO_SOLICITANTE = ?';
      params.push(id);
    }

    sql += ' ORDER BY s.ID_SOLICITACAO DESC';

    conn.query(sql, params, (err2, result) => {
      conn.detach();
      if (err2) {
        console.error("Erro na consulta SQL de solicitações:", err2);
        return res.status(500).json({ error: err2.message });
      }
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

export function responderSolicitacao(req,res){
  const idSolicitacao = parseInt(req.params.id);
  const { solucao } = req.body;

  if (!solucao || solucao.trim() === "") {
    return res.status(400).json({ error: "O campo de solucao e obrigatorio"});
  }
  db.get((err,conn)=> {
    if(err) return res.status(500).json({error: err.message});

     const sql = ` UPDATE SOLICITACOES
      SET 
        STATUS = ?,
        DEFEITO_ENCONTRADO = ?,
        DATA_CONCLUSAO = ?
      WHERE ID_SOLICITACAO = ?`;

    const params = [
      "FECHADA",
      solucao,
      new Date(),
      idSolicitacao
    ];

    conn.query(sql, params, (err2) => {
        conn.detach();
        if (err2) {
          console.error("Erro ao responder solicitação:", err2);
          return res.status(500).json({ error: err2.message });
        }

        res.status(200).json({
          message: `Solicitação ${idSolicitacao} foi respondida e fechada com sucesso.`,
        });
      });
  });
}

export function buscarSolicitacaoPorId(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID da solicitação inválido." });
  }

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      SELECT 
        s.ID_SOLICITACAO,
        s.STATUS,
        s.DATA_CRIACAO,
        s.DEFEITO_RELATADO,
        s.DEFEITO_ENCONTRADO,
        u_sol.NOME_USUARIO AS NOME_SOLICITANTE,
        st.NOME_SETOR
      FROM 
        SOLICITACOES s
      LEFT JOIN 
        USUARIOS u_sol ON s.ID_USUARIO_SOLICITANTE = u_sol.ID_USUARIOS
      LEFT JOIN
        SETOR st ON u_sol.ID_SETOR = st.ID_SETOR
      WHERE s.ID_SOLICITACAO = ?
    `;

    conn.query(sql, [id], (err2, result) => {
      conn.detach();
      if (err2) {
        return res.status(500).json({ error: err2.message });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "Solicitação não encontrada." });
      }
      res.json(result[0]);
  });
});
}
