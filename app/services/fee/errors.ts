import { TGenericFailure } from "../../infrastructure";

/// TYPES ///

type TFeeErrorType = "FAILED_TO_RETRIEVE_MARKETPLACE_FEE";

type TFailure = TGenericFailure<TFeeErrorType>;

/// LOGIC ///

/**
 * Creates a failure oject containing useful information about the encountered error.
 *
 * @param errorType - Error strings customized to this service
 * @param error - Optional JavaScript error object
 */
function defineFailure(errorType: TFeeErrorType, error?: Error): TFailure {
  switch (errorType) {
    case "FAILED_TO_RETRIEVE_MARKETPLACE_FEE":
      return {
        type: errorType,
        reason: "Failed to retrieve the marketplace fee from its database table",
        error,
      };
      break;

    default:
      throw new Error("Please specify a fee service failure mode");
      break;
  }
}

export type { TFailure };
export { defineFailure };
