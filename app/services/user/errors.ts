import { TGenericFailure } from "../../infrastructure";

/// TYPES ///

type TUserErrorType =
  | "FAILED_TO_CREATE_USER"
  | "FAILED_TO_RETRIEVE_USER"
  | "FAILED_TO_SET_ACCOUNT_BALANCE";

type TFailure = TGenericFailure<TUserErrorType>;

/// LOGIC ///

/**
 * Creates a failure oject containing useful information about the encountered error.
 *
 * @param errorType - Error strings customized to this service
 * @param error - Optional JavaScript error object
 */
function defineFailure(errorType: TUserErrorType, error?: Error): TFailure {
  switch (errorType) {
    case "FAILED_TO_CREATE_USER":
      return {
        type: errorType,
        reason: "Failed to create a new user in the database",
        error,
      };
      break;

    case "FAILED_TO_RETRIEVE_USER":
      return {
        type: errorType,
        reason: "Failed to retrieve the specified user from the database",
        error,
      };
      break;

    case "FAILED_TO_SET_ACCOUNT_BALANCE":
      return {
        type: errorType,
        reason: "Failed to update the account balance associated with the specified user",
        error,
      };
      break;

    default:
      throw new Error("Please specify a user service failure mode");
      break;
  }
}

export type { TFailure };
export { defineFailure };
