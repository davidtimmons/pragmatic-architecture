/**
 * Run database migrations to update the SQLite databases. Migrates to the test database if the
 * NODE_ENV flag is not set to "production."
 *
 * Reference:
 * https://github.com/kriasoft/node-sqlite#migrations
 * https://github.com/kriasoft/node-sqlite/blob/master/docs/interfaces/_src_interfaces_.imigrate.migrationparams.md
 */
import path from "node:path";
import { privateExports } from "../logic";

const { openDatabase, selectDatabase } = privateExports;
const shouldForce = process.env.NODE_ENV === "production" ? false : true;
const dbPath = selectDatabase();
const migrationsPath = path.join(process.cwd(), "app", "database", "migrations");

openDatabase(dbPath)
  .then((maybeDb) => {
    if (maybeDb instanceof Error) throw maybeDb;
    return maybeDb;
  })
  .then((db) => {
    console.log(`Attempting to migrate SQL updates into ${dbPath}...`);
    return db.migrate({
      migrationsPath,
      force: shouldForce,
    });
  })
  .then(() => {
    console.error("Successfully migrated SQL updates.");
  })
  .catch((err) => {
    console.error("Failed to migrate SQL updates!");
    throw err;
  });
