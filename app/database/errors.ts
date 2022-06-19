import { TGenericFailure } from "../infrastructure";

/// TYPES ///

type TDatabaseErrorType =
  | "FAILED_TO_OPEN_DATABASE"
  | "FAILED_TO_CLOSE_DATABASE"
  | "FAILED_TO_RETRIEVE_RECORDS"
  | "FAILED_TO_RUN_SQL";

type TFailure = TGenericFailure<TDatabaseErrorType>;

/// LOGIC ///

// TODO: Add tests for this

function defineFailure(errorType: TDatabaseErrorType, error?: Error): TFailure {
  switch (errorType) {
    case "FAILED_TO_OPEN_DATABASE":
      return {
        type: errorType,
        reason: "Failed to open the database",
        error,
      };
      break;

    case "FAILED_TO_CLOSE_DATABASE":
      return {
        type: errorType,
        reason: "Failed to close the database",
        error,
      };
      break;

    case "FAILED_TO_RETRIEVE_RECORDS":
      return {
        type: errorType,
        reason: "Failed to retrieve records from the database",
        error,
      };
      break;

    case "FAILED_TO_RUN_SQL":
      return {
        type: errorType,
        reason: "Failed to run the SQL query",
        error,
      };
      break;

    default:
      throw new Error("Please specify a database failure mode");
      break;
  }
}

export type { TFailure };
export { defineFailure };
