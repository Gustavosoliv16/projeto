import db from "../database.js";

export function listarUsuariosPaginado(req, res) {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  const offset = (page - 1) * limit;

  db.get((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.query("SELECT COUNT(*) AS TOTAL FROM USUARIOS", (errCount, countResult) => {
      if (errCount) {
        conn.detach();
        return res.status(500).json({ error: errCount.message });
      }

      const total = countResult[0].TOTAL;
      const totalPages = Math.ceil(total / limit);

      const sql = `
        SELECT * FROM USUARIOS
        ORDER BY ID_USUARIOS ASC
        ROWS ? TO ?
      `;

      conn.query(sql, [offset + 1, offset + limit], (errData, result) => {
        conn.detach();
        if (errData) return res.status(500).json({ error: errData.message });

        res.json({
          data: result,
          total,
          page,
          totalPages
        });
      });
    });
  });
}