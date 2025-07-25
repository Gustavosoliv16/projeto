const express = import("express");
const cors = import("cors");
const db = import("./dbs.js");

const app = express();
const PORT = 3050;

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
  console.log(`✅ Backend rodando em 198.162.3.20:${PORT}`);
});
