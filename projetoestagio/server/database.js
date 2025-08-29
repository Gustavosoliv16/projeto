import { createRequire } from "module";
const require = createRequire(import.meta.url);
const firebird = require("node-firebird");
import dotenv from "dotenv";
import process from "process";
dotenv.config();

const options = {
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT,
  database: process.env.DB_NAME, 
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
};


const pool = firebird.pool(5, options);
export default {
  get: (callback) => pool.get(callback),
};
