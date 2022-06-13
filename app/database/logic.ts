/**
 * Provides a facade to work with the backing SQLite database.
 */
import path from "node:path";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

const DB_FILENAME = "marketplace.db";
const DB_PATH = path.join(process.cwd(), "app", "database", DB_FILENAME);

const TEST_DB_FILENAME = "marketplace.test.db";
const TEST_DB_PATH = path.join(process.cwd(), "app", "database", TEST_DB_FILENAME);

/// TYPES ///

type TDatabase = Database<sqlite3.Database, sqlite3.Statement>;

/// LOGIC ///

function selectDatabase() {
  if (process.env.NODE_ENV === "production") return DB_PATH;
  return TEST_DB_PATH;
}

async function openDatabase(databasePath: string): Promise<TDatabase | Error> {
  return open({
    filename: databasePath,
    driver: sqlite3.Database,
  }).catch((err: Error) => {
    console.error("Failed to open the database:", err);
    return err;
  });
}

async function retrieve<T>(sql: string, ...params: any[]): Promise<T[] | Error> {
  const databasePath = selectDatabase();
  const db = await openDatabase(databasePath);
  if (db instanceof Error) return db;

  const maybeResult = await db.all<T[]>(sql, params).catch((err: Error) => {
    console.error(`Failed to retrieve records from ${databasePath}:`, err);
    return err;
  });

  await db.close();
  return maybeResult;
}

async function run(sql: string, ...params: any[]): Promise<void | Error> {
  const databasePath = selectDatabase();
  const db = await openDatabase(databasePath);
  if (db instanceof Error) return db;

  const maybeError = await db.run(sql, ...params).catch((err: Error) => {
    console.error(`Failed to run statement at ${databasePath}:`, err);
    return err;
  });

  await db.close();
  if (maybeError instanceof Error) return maybeError;
}

export const privateExports = {
  DB_PATH,
  TEST_DB_PATH,
  openDatabase,
  selectDatabase,
};

export default { retrieve, run };
