import { TGenericFailure } from "../../infrastructure";

/// TYPES ///

type TFeeErrorType =
  | "FAILED_TO_CREATE_WIDGET"
  | "FAILED_TO_RETRIEVE_WIDGET"
  | "FAILED_TO_SET_PURCHASED_STATUS";

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
    case "FAILED_TO_CREATE_WIDGET":
      return {
        type: errorType,
        reason: "Failed to create a new widget in the database",
        error,
      };
      break;

    case "FAILED_TO_RETRIEVE_WIDGET":
      return {
        type: errorType,
        reason: "Failed to retrieve the specified widget from the database",
        error,
      };
      break;

    case "FAILED_TO_SET_PURCHASED_STATUS":
      return {
        type: errorType,
        reason: "Failed to update the purchased status associated with the specified widget",
        error,
      };
      break;

    default:
      throw new Error("Please specify a widget service failure mode");
      break;
  }
}

export type { TFailure };
export { defineFailure };
