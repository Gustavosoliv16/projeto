import express from "express";
import cors from "cors";
import db from "./database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/api/cadastro", async (req, res) => {
  const { NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA } = req.body;

const salt = await bcrypt.genSalt(10);
const senhaHash = await bcrypt.hash(SENHA, salt);

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = `
      INSERT INTO USUARIOS (NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    conn.query(sql, [NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO,senhaHash], (err2) => {
      conn.detach();

      if (err2) return res.status(500).json({ error: err2.message });

      return res.status(201).json({
        message: "Usuário cadastrado com sucesso"
      });
    });
  });
});

app.post("/api/login", (req, res) => {
    const { EMAIL, SENHA } = req.body;

    if (!EMAIL || !SENHA) {
        return res.status(400).json({ error: "Email e senha obrigatorio" });
    }

    db.get((err, conn) => {
        if (err) return res.status(500).json({ error: "Erro de conexao com o banco de dados" });

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
                    return res.status(401).json({ error: "credenciais invalidas" })
                }

                const payload = {
                    id: usuario.ID_USUARIOS,
                    nome: usuario.NOME_USUARIO
                };
                const secret = "uma-chave-secreta-bem-forte-para-testes";

                const token = jwt.sign(payload, secret, {
                    expiresIn: '20h'
                });

                return res.status(200).json({ message: "login efetuado", token: token });
                
            } catch (bcryptError) {
                return res.status(500).json({ error: "Erro ao verificar credencias" })
            }
        }); 
    }); 
});



app.get("/api/cadastro/:id", (req, res) => { 
  const id = parseInt(req.params.id, 10);
  const sql = "SELECT * FROM USUARIOS WHERE ID_USUARIOS = ?";

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query(sql, [id], (err2, result) => {
      conn.detach();

      if (err2) return res.status(500).json({ error: err2.message });


      if (!result || result.length === 0) { 
        return res.status(404).json({ message: "Usuario nao encontrado" });
      }

      return res.json(result[0]);
    });
  });
});

app.get("/api/cadastro", (req, res) => {
  const {search} = req.query;
  if (!search){
    return res.status(200).json([]);
  }
db.get((err,conn)=>{
  if(err) return res.status(500).json({error:"erro na conexao com o banco de dados"});

 const sql = "SELECT * FROM USUARIOS WHERE NOME_USUARIO LIKE ?";
 const searchTerm = `%${search}%`;
 
 conn.query(sql, [searchTerm], (err2, results)=> {
  conn.detach();
  if(err2) {
    return res.status(500).json({error:"erro ao executar a busca pelo nome"});
  }
  return res.status(200).json(results);
 });
});
});

app.put("/api/cadastro/:id", async (req, res) => {
 const { id } = req.params;
 const { NOME_USUARIO, DEPARTAMENTO, CPF, EMAIL, TIPO_USUARIO, SENHA } = req.body;


  if (!NOME_USUARIO && !DEPARTAMENTO && !CPF && !EMAIL && !TIPO_USUARIO && !SENHA) {
    return res.status(400).json({ error: "Nenhum dado fornecido para atualização." });
  }

 db.get(async (err, conn) => { 
 if (err) return res.status(500).json({ error: err.message });

    try {
      let camposParaAtualizar = [];
      let valores = [];

      if (NOME_USUARIO) {
        camposParaAtualizar.push("NOME_USUARIO = ?");
        valores.push(NOME_USUARIO);
      }
      if (DEPARTAMENTO) {
        camposParaAtualizar.push("DEPARTAMENTO = ?");
        valores.push(DEPARTAMENTO);
      }
      if (CPF) {
        camposParaAtualizar.push("CPF = ?");
        valores.push(CPF);
      }
      if (EMAIL) {
        camposParaAtualizar.push("EMAIL = ?");
        valores.push(EMAIL);
      }
      if (TIPO_USUARIO) {
        camposParaAtualizar.push("TIPO_USUARIO = ?");
        valores.push(TIPO_USUARIO);
      }

      if (SENHA) {
  
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(SENHA, salt);

        camposParaAtualizar.push("SENHA = ?");
        valores.push(senhaHash);
      }


      const sql = `UPDATE USUARIOS SET ${camposParaAtualizar.join(", ")} WHERE ID_USUARIOS = ?`;
      valores.push(parseInt(id));

   conn.query(sql, valores, (err2) => {
    conn.detach();

   if (err2) {
          console.error("Erro ao atualizar:", err2);
          return res.status(500).json({ error: err2.message });
        }

   res.status(200).json({ message: "Usuário atualizado com sucesso" });
 });

    } catch (error) {
      conn.detach();
      console.error("Erro de criptografia:", error);
      res.status(500).json({ error: "Erro ao processar a senha." });
    }
 });
});

app.delete("/api/cadastro/:id", (req, res) => {
  const id = parseInt(req.params.id);

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    const sql = "DELETE FROM USUARIOS WHERE ID_USUARIOS = ?";

    conn.query(sql, [id], (err2) => {
      conn.detach();

      if (err2) {
        return res.status(500).json({ error: err2.message });
      }

      return res.status(200).json({
        message: `Usuário com ID ${id} deletado com sucesso.`,
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta LocalHost:${PORT}`);
});