// dbs.js
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const firebird = require("node-firebird");

// Configurações de Rede
const options = {
  host: "192.168.3.20", 
  port: 3050,
  database: "/home/informatica/PMC/BD/OS_INFORMATICA.FDB", 
  user: "SYSDBA",
  password: "infor@pref#23",
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
};

const pool = firebird.pool(5, options);
export default {
  get: (callback) => pool.get(callback),
};
