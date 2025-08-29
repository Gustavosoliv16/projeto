import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "./database.js";

const router = express.Router();

router.post("/cadastro", async (req, res) => {
    const { NOME_USUARIO, ID_SETOR, CPF, EMAIL, TIPO_USUARIO, SENHA } = req.body;

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(SENHA, salt);

    db.get((err, conn) => {
        if (err) return res.status(500).json({ error: err.message });

        const sql = `
          INSERT INTO USUARIOS (NOME_USUARIO, ID_SETOR, CPF, EMAIL, TIPO_USUARIO, SENHA) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        conn.query(sql, [NOME_USUARIO, ID_SETOR, CPF, EMAIL, TIPO_USUARIO, senhaHash], (err2) => {
            conn.detach();
            if (err2) return res.status(500).json({ error: err2.message });
            return res.status(201).json({ message: "Usuário cadastrado com sucesso" });
        });
    });
});

router.post("/login", (req, res) => {
    const { EMAIL, SENHA } = req.body;

    if (!EMAIL || !SENHA) {
        return res.status(400).json({ error: "Email e senha obrigatório" });
    }

    db.get((err, conn) => {
        if (err) return res.status(500).json({ error: "Erro de conexão com o banco de dados" });

        const sql = "SELECT * FROM USUARIOS WHERE EMAIL = ?";
        conn.query(sql, [EMAIL], async (err2, result) => {
            conn.detach();
            if (err2) return res.status(500).json({ error: "erro interno no servidor" });

            if (!result || result.length === 0) {
                return res.status(401).json({ error: "credenciais invalidas" });
            }

            const usuario = result[0];
            try {
                const senhaexiste = await bcrypt.compare(SENHA, usuario.SENHA);
                if (!senhaexiste) {
                    return res.status(401).json({ error: "credenciais invalidas" });
                }

                const payload = { id: usuario.ID_USUARIOS, nome: usuario.NOME_USUARIO };
                const secret = "uma-chave-secreta-bem-forte-para-testes";
                const token = jwt.sign(payload, secret, { expiresIn: '20h' });

                return res.status(200).json({ message: "login efetuado", token: token });

            } catch (bcryptError) {
                console.log('erro bcrypt', bcryptError);
                return res.status(500).json({ error: "Erro ao verificar credencias" });
            }
        });
    });
});

router.get("/cadastro", (req, res) => {
    const { search } = req.query;
    if (!search) {
        return res.status(200).json([]);
    }
    db.get((err, conn) => {
        if (err) return res.status(500).json({ error: "erro na conexao com o banco de dados" });

        const sql = "SELECT * FROM USUARIOS WHERE NOME_USUARIO LIKE ?";
        const searchTerm = `%${search}%`;

        conn.query(sql, [searchTerm], (err2, results) => {
            conn.detach();
            if (err2) {
                return res.status(500).json({ error: "erro ao executar a busca pelo nome" });
            }
            return res.status(200).json(results);
        });
    });
});

export default router;