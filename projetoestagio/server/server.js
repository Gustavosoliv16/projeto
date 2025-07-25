import express from "express";
import cors from "cors";
import db from "./dbs.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/usuarios", (req, res) => {
  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err });

    conn.query("SELECT * FROM USUARIOS", (err, result) => {
      conn.detach();
      if (err) return res.status(500).json({ error: err });

      res.json(result);
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend rodando em localhost:${PORT}`);
});

