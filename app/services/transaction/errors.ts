import { TGenericFailure } from "../../infrastructure";

/// TYPES ///

type TTransactionErrorType = "FAILED_TO_CREATE_TRANSACTION";
type TFailure = TGenericFailure<TTransactionErrorType>;

/// LOGIC ///

/**
 * Creates a failure oject containing useful information about the encountered error.
 *
 * @param errorType - Error strings customized to this service
 * @param error - Optional JavaScript error object
 */
function defineFailure(errorType: TTransactionErrorType, error?: Error): TFailure {
  switch (errorType) {
    case "FAILED_TO_CREATE_TRANSACTION":
      return {
        type: errorType,
        reason: "Failed to create a new transaction record in the database",
        error,
      };
      break;

    default:
      throw new Error("Please specify a transaction service failure mode");
      break;
  }
}

export type { TFailure };
export { defineFailure };
