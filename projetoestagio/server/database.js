import Database from "better-sqlite3";
import dotenv from "dotenv";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const serverDirectory = dirname(fileURLToPath(import.meta.url));
const configuredPath = process.env.SQLITE_DB_PATH;
const databasePath = configuredPath
  ? (isAbsolute(configuredPath) ? configuredPath : resolve(process.cwd(), configuredPath))
  : resolve(serverDirectory, "data", "database.sqlite");

mkdirSync(dirname(databasePath), { recursive: true });

const database = new Database(databasePath);
database.pragma("foreign_keys = ON");
database.pragma("journal_mode = WAL");
database.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));

const connection = {
  query(sql, params, callback) {
    if (typeof params === "function") {
      callback = params;
      params = [];
    }

    let result;
    const values = (params || []).map((value) => {
      if (value instanceof Date) return value.toISOString();
      return value === undefined ? null : value;
    });
    try {
      const statement = database.prepare(sql);
      if (statement.reader) {
        result = /\bRETURNING\b/i.test(sql)
          ? statement.get(...values)
          : statement.all(...values);
      } else {
        statement.run(...values);
      }
    } catch (error) {
      callback?.(error);
      return;
    }
    callback?.(null, result);
  },
  transaction(isolationOrCallback, callback) {
    const transactionCallback = typeof isolationOrCallback === "function"
      ? isolationOrCallback
      : callback;

    try {
      database.exec("BEGIN IMMEDIATE");
    } catch (error) {
      transactionCallback(error);
      return;
    }
    transactionCallback(null, this);
  },
  commit(callback) {
    try {
      database.exec("COMMIT");
      callback?.(null);
    } catch (error) {
      callback?.(error);
    }
  },
  rollback(callback) {
    try {
      if (database.inTransaction) database.exec("ROLLBACK");
      callback?.(null);
    } catch (error) {
      callback?.(error);
    }
  },
  detach() {},
};

console.log(`Banco SQLite pronto em ${databasePath}`);

export default {
  get: (callback) => callback(null, connection),
  ISOLATION_READ_COMMITTED: 0,
};
