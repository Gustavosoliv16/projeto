import db from "../database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function listarUsuarios(req, res) {

  const { search = "" } = req.query;

  db.get((err, conn) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const params = [];
    let sql = `
      SELECT 
        ID_USUARIOS, NOME_USUARIO, TIPO_USUARIO, ID_SETOR 
      FROM USUARIOS
      `;

    if (search) {
      sql += `
        WHERE 
          NOME_USUARIO CONTAINING ?
      `;
      params.push(search, search, search);
    }
    
    sql += ' ROWS 10';

    conn.query(sql, params, (err2, result) => {
      conn.detach();
      if (err2) {
        return res.status(500).json({ error: err2.message });
      }
      res.json(result);
    });
  });
}

export function login (req, res){
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

            if(!usuario.SENHA){
              console.error('nao existe este usuario')
              return res.status(401).json({error:"credenciais invalidas"});
            }
            try {
                const senhaexiste = await bcrypt.compare(SENHA, usuario.SENHA);
                if (!senhaexiste) {
                    return res.status(401).json({ error: "credenciais invalidas" });
                }

                const payload = { id: usuario.ID_USUARIOS, nome: usuario.NOME_USUARIO };
                const secret = "uma-chave-secreta-bem-forte-para-testes";
                const token = jwt.sign(payload, secret, { expiresIn: '10h' });

                return res.status(200).json({ message: "login efetuado", token: token });

            } catch (bcryptError) {
                console.log('erro bcrypt', bcryptError);
                return res.status(500).json({ error: "Erro ao verificar credencias" });
            }
        });
    });
}

export function cadastrarUsuario(req, res) {

  const { NOME_USUARIO, CPF, EMAIL, TIPO_USUARIO, SENHA, ID_SETOR } = req.body;

  bcrypt.hash(SENHA, 10, (err, senhaCriptografada) => {
    if (err) return res.status(500).json({ error: "Erro ao criptografar senha." });

    db.get((errConn, conn) => {
      if (errConn) return res.status(500).json({ error: errConn.message });

      const sql = `
        INSERT INTO USUARIOS 
          (NOME_USUARIO, CPF, EMAIL, TIPO_USUARIO, SENHA, ID_SETOR) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const dados = [NOME_USUARIO, CPF, EMAIL, TIPO_USUARIO, senhaCriptografada, ID_SETOR];

      conn.query(sql, dados, (err2) => {
        conn.detach();
        if (err2) return res.status(500).json({ error: err2.message });

        res.status(201).json({
          message: "Usuário cadastrado com sucesso",
          usuario: { NOME_USUARIO, CPF, EMAIL, TIPO_USUARIO, ID_SETOR }
        });
      });
    });
  });
}

export function atualizarUsuario(req, res) {
  const { id } = req.params;
  const { NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA } = req.body;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      UPDATE USUARIOS 
      SET NOME_USUARIO = ?, 
          CPF = ?, 
          EMAIL = ?, 
          TIPO_USUARIO = ?, 
          SENHA = ?
      WHERE ID_USUARIOS = ?
    `;

    conn.query(
      sql,
      [NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA, parseInt(id)],
      (err2) => {
        conn.detach();
        if (err2) return res.status(500).json({ error: err2.message });

        res.status(200).json({
          message: "Usuário atualizado com sucesso",
          usuario: { ID_USUARIOS: id, NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA }
        });
      }
    );
  });
}

export function deletarUsuario(req, res) {
  const id = parseInt(req.params.id);

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = "DELETE FROM USUARIOS WHERE ID_USUARIOS = ?";

    conn.query(sql, [id], (err2) => {
      conn.detach();
      if (err2) return res.status(500).json({ error: err2.message });

      res.status(200).json({
        message: `Usuário com ID ${id} deletado com sucesso.`,
      });
    });
  });
}