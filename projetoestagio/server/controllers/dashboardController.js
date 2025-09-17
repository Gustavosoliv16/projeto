import db from "../database.js";

export const getDashboardStats = (req, res) => {
    const { id: userId, tipo_usuario: userType } = req.user;

    db.get((err, conn) => {
        if (err) {
            return res.status(500).json({ error: "Erro de conexão com o banco de dados" });
        }

        let whereClause = "WHERE 1=1"; 
        let params = [];

        if (userType !== 'administrador') {
            whereClause += " AND s.ID_USUARIO_SOLICITANTE = ?";
            params.push(userId);
        }

        const results = {};

        const queryAbertas = `SELECT COUNT(*) AS TOTAL FROM SOLICITACOES s ${whereClause} AND s.STATUS = 'ABERTA'`;
        const queryFechadas = `SELECT COUNT(*) AS TOTAL FROM SOLICITACOES s ${whereClause} AND s.STATUS = 'FECHADA'`;
        const queryPendentes = `SELECT COUNT(*) AS TOTAL FROM SOLICITACOES s ${whereClause} AND s.STATUS = 'PENDENTE'`;
        const queryUltimas = `
            SELECT 
                s.ID_SOLICITACAO, S.DEFEITO_RELATADO, s.STATUS, s.PATRIMONIO,
                u_sol.NOME_USUARIO AS NOME_SOLICITANTE, st.NOME_SETOR
            FROM SOLICITACOES s
            LEFT JOIN USUARIOS u_sol ON s.ID_USUARIO_SOLICITANTE = u_sol.ID_USUARIOS
            LEFT JOIN SETOR st ON u_sol.ID_SETOR = st.ID_SETOR
            ${whereClause}
            ORDER BY s.ID_SOLICITACAO DESC
            ROWS 20`;

        conn.query(queryAbertas, params, (err1, res1) => {
            if (err1) { conn.detach(); return res.status(500).json({ error: "Erro ao contar chamados abertos: " + err1.message }); }
            results.ordensAbertas = res1[0].TOTAL;

            conn.query(queryFechadas, params, (err2, res2) => {
                if (err2) { conn.detach(); return res.status(500).json({ error: "Erro ao contar chamados fechados: " + err2.message }); }
                results.resolvidos = res2[0].TOTAL; 

                conn.query(queryPendentes, params, (err3, res3) => {
                    if (err3) { conn.detach(); return res.status(500).json({ error: "Erro ao contar chamados pendentes: " + err3.message }); }
                    results.pendentes = res3[0].TOTAL;

                    conn.query(queryUltimas, params, (err4, res4) => {
                        conn.detach();
                        if (err4) { return res.status(500).json({ error: "Erro ao listar últimos chamados: " + err4.message }); }
                        results.ultimasSolicitacoes = res4;
                        
                        res.json(results);
                    });
                });
            });
        });
    });
};