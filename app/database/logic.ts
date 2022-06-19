/**
 * Provides a facade to work with the backing database.
 */
import Path from "node:path";
import Sqlite from "sqlite";
import SqliteWrapper from "sqlite3";
import { Result, ResultAsync, ok, err } from "neverthrow";
import { PromisedErr, PromisedResult } from "../infrastructure";
import { defineFailure, TFailure } from "./errors";

const DB_PATH = Path.join(process.cwd(), "app", "database", "marketplace.db");
const TEST_DB_PATH = Path.join(process.cwd(), "app", "database", "marketplace.test.db");

/// TYPES ///

type TDatabase = Sqlite.Database<SqliteWrapper.Database, SqliteWrapper.Statement>;

/// LOGIC ///

/**
 * Select the production or test database depending on the current Node.js environment.
 * A "production" environment returns the production database. Any other environment returns
 * the test database.
 */
function selectDatabase() {
  if (process.env.NODE_ENV === "production") return DB_PATH;
  return TEST_DB_PATH;
}

/**
 * Convenience function used to promisify a result object containing a database failure object.
 *
 * @param dbFailure - Database failure object containing error information
 */
function handleFailure(dbFailure: TFailure): PromisedErr<TFailure> {
  return Promise.reject(err(dbFailure));
}

/**
 * Attempt to open the database.
 *
 * @param databasePath - File path used to access the database
 */
function openDatabase(databasePath: string): ResultAsync<TDatabase, TFailure> {
  const handleFailure = (openErr: unknown) =>
    defineFailure("FAILED_TO_OPEN_DATABASE", openErr as Error);

  return ResultAsync.fromPromise(
    Sqlite.open({ filename: databasePath, driver: SqliteWrapper.Database }),
    handleFailure
  );
}

/**
 * Attempt to close the open database.
 *
 * @param maybeOpenDb - Result object containing either a database object or a failure object
 */
async function closeDatabase(
  maybeOpenDb: Result<TDatabase, TFailure>
): PromisedResult<void, TFailure> {
  const handleSuccess = async (openDb: TDatabase) =>
    await openDb
      .close()
      .then(ok)
      .catch((closeErr: Error) => err(defineFailure("FAILED_TO_CLOSE_DATABASE", closeErr)));

  return maybeOpenDb.match(handleSuccess, handleFailure);
}

/**
 * Attempt to retrieve records from the database.
 *
 * @param sql - Arbitrary SQL query that should return database records
 * @param params - Arbitrary parameters to interpolate with the SQL query string
 */
async function retrieve<T>(sql: string, ...params: any[]): PromisedResult<T[], TFailure> {
  const maybeDb = await openDatabase(selectDatabase());

  const handleSuccess = async (openDb: TDatabase) =>
    await openDb
      .all<T[]>(sql, params)
      .then(ok)
      .catch((retrieveErr: Error) => err(defineFailure("FAILED_TO_RETRIEVE_RECORDS", retrieveErr)));

  const maybeResults = await maybeDb.match(handleSuccess, handleFailure);

  const maybeCloseFailed = await closeDatabase(maybeDb);
  maybeCloseFailed.mapErr((closeFailure: TFailure) => {
    console.error(closeFailure);
  });

  return maybeResults;
}

/**
 * Attempt to run an arbitrary SQL query.
 *
 * @param sql - Arbitrary SQL query that should not return database records
 * @param params - Arbitrary parameters to interpolate with the SQL query string
 */
async function run(
  sql: string,
  ...params: any[]
): PromisedResult<Sqlite.ISqlite.RunResult, TFailure> {
  const maybeDb = await openDatabase(selectDatabase());

  const handleSuccess = async (openDb: TDatabase) =>
    await openDb
      .run(sql, ...params)
      .then(ok)
      .catch((runErr: Error) => err(defineFailure("FAILED_TO_RUN_SQL", runErr)));

  const maybeResult = await maybeDb.match(handleSuccess, handleFailure);

  const maybeCloseFailed = await closeDatabase(maybeDb);
  maybeCloseFailed.mapErr((closeFailure: TFailure) => {
    console.error(closeFailure);
  });

  return maybeResult;
}

export const privateExports = {
  DB_PATH,
  TEST_DB_PATH,
  openDatabase,
  selectDatabase,
  // TODO: Add tests for these
  closeDatabase,
  handleFailure,
};

export default { retrieve, run };
