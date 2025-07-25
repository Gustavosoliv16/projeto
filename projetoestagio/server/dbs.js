const firebird = import("firebird");

const db = firebird.pool(5, options);
export default db;

const options = {
  host: "192.168.3.20",
  port: 3050,
  database: "192.168.3.20/home/informatica/PMC/BD/OS_INFORMATICA.FDB",
  user: "SYSDBA",
  password: "infor@pref#23",
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
};

firebird.attach(options, (err, db) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  db.query("SELECT * FROM OS", (err, result) => {
    if (err) {
      console.error("Erro ao executar a consulta:", err);
    } else {
      console.log("Resultados da consulta:", result);
    }
  });
});

db.attach(options, function (err, conn) {
  if (err) return console.error("Erro ao conectar:", err);

  conn.query("SELECT * FROM USUARIOS", (err, result) => {
    if (err) return console.error("Erro na query:", err);

    console.log(result);
    conn.detach();
  });
});
