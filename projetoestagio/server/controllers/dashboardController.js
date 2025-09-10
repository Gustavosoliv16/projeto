import db from "../database.js";

export const getDashboardStats = (req, res) => {
    db.get((err, conn) => {
        if (err) return res.status(500).json({ error: "Erro de conexão com o banco de dados" });

        const queries = {
            ordensAbertas: 'SELECT COUNT(*) AS TOTAL FROM SOLICITACOES WHERE STATUS = \'ABERTA\'',
            totalEquipamentos: 'SELECT COUNT(*) AS TOTAL FROM EQUIPAMENTOS',
            totalUsuarios: 'SELECT COUNT(*) AS TOTAL FROM USUARIOS',
            ultimasSolicitacoes: `
                SELECT 
                    s.ID_SOLICITACAO,
                    s.DESCRICAO,
                    s.STATUS,
                    u_sol.NOME_USUARIO AS NOME_SOLICITANTE,
                    st.NOME_SETOR
                FROM SOLICITACOES s
                LEFT JOIN USUARIOS u_sol ON s.ID_USUARIO_SOLICITANTE = u_sol.ID_USUARIOS
                LEFT JOIN SETOR st ON u_sol.ID_SETOR = st.ID_SETOR
                WHERE s.STATUS = 'ABERTA'
                ORDER BY s.ID_SOLICITACAO DESC
                ROWS 5`
        };

        let results = {};
        let completedQueries = 0;
        const totalQueries = Object.keys(queries).length;

        const handleResult = (key, data) => {
            results[key] = data;
            completedQueries++;
            if (completedQueries === totalQueries) {
                conn.detach();
                const finalResults = {
                    ordensAbertas: results.ordensAbertas[0].TOTAL,
                    totalEquipamentos: results.totalEquipamentos[0].TOTAL,
                    totalUsuarios: results.totalUsuarios[0].TOTAL,
                    ultimasSolicitacoes: results.ultimasSolicitacoes
                };
                res.json(finalResults);
            }
        };

        for (const key in queries) {
            conn.query(queries[key], (errQuery, result) => {
                if (errQuery) {
                    conn.detach();
                    return res.status(500).json({ error: `Erro na consulta '${key}': ${errQuery.message}` });
                }
                handleResult(key, result);
            });
        }
    });
};