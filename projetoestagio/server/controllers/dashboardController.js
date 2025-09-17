import db from "../database.js";

export const getDashboardStats = (req, res) => {
    const {id: userId, tipo_usuario: userType} = req.user;
    
    db.get((err, conn) => {
        if (err) {
            console.error("Erro de conexão com o banco de dados:", err);
            return res.status(500).json({ error: "Erro de conexão com o banco de dados" });
        }

        let userFilterClause = "";
        if (userType !== 'administrador'){
            userFilterClause = `WHERE s.ID_USUARIO_SOLICITANTE = ${userId}`;
        }

        const results = {};
        
        conn.query('SELECT COUNT(*) AS TOTAL FROM SOLICITACOES WHERE STATUS = \'ABERTA\'', (err1, res1) => {
            if (err1) {
                console.error("Erro na consulta de ordens abertas:", err1);
                conn.detach();
                return res.status(500).json({ error: err1.message });
            }
            results.ordensAbertas = res1[0].TOTAL;

            conn.query('SELECT COUNT(DISTINCT PATRIMONIO) AS TOTAL FROM SOLICITACOES WHERE PATRIMONIO IS NOT NULL AND PATRIMONIO <> \'\'', (err2, res2) => {
                if (err2) {
                    console.error("Erro na consulta de equipamentos:", err2);
                    conn.detach();
                    return res.status(500).json({ error: err2.message });
                }
                results.totalEquipamentos = res2[0].TOTAL;

                conn.query('SELECT COUNT(*) AS TOTAL FROM USUARIOS', (err3, res3) => {
                    if (err3) {
                        console.error("Erro na consulta de usuários:", err3);
                        conn.detach();
                        return res.status(500).json({ error: err3.message });
                    }
                    results.totalUsuarios = res3[0].TOTAL;

                    const ultimasSql = `
                        SELECT 
                s.ID_SOLICITACAO, s.DESCRICAO, s.STATUS, s.PATRIMONIO,
                u_sol.NOME_USUARIO AS NOME_SOLICITANTE, st.NOME_SETOR
            FROM SOLICITACOES s
            LEFT JOIN USUARIOS u_sol ON s.ID_USUARIO_SOLICITANTE = u_sol.ID_USUARIOS
            LEFT JOIN SETOR st ON u_sol.ID_SETOR = st.ID_SETOR
            ${userFilterClause}  -- A cláusula de filtro é inserida aqui
            ORDER BY s.ID_SOLICITACAO DESC
            ROWS 20`;
                    
                    conn.query(ultimasSql, (err4, res4) => {
                        conn.detach();

                        if (err4) {
                            console.error("Erro na consulta de últimas solicitações:", err4);
                            return res.status(500).json({ error: err4.message });
                        }
                        results.ultimasSolicitacoes = res4;

                        res.json(results);
                    });
                });
            });
        });
    });
};