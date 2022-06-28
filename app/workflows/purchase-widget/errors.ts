import { TGenericFailure } from "../../infrastructure";

/// TYPES ///

type TPurchaseWidgetErrorType =
  | "WIDGET_IS_UNAVAILABLE"
  | "INSUFFICIENT_FUNDS"
  | "BUYER_OWNS_WIDGET";

type TFailure = TGenericFailure<TPurchaseWidgetErrorType>;

/// LOGIC ///

/**
 * Creates a failure oject containing useful information about the encountered error.
 *
 * @param errorType - Error strings customized to this workflow
 * @param error - Optional JavaScript error object
 */
function defineFailure(errorType: TPurchaseWidgetErrorType, error?: Error): TFailure {
  switch (errorType) {
    case "WIDGET_IS_UNAVAILABLE":
      return {
        type: errorType,
        reason: "This widget has already been purchased",
        error,
      };
      break;

    case "INSUFFICIENT_FUNDS":
      return {
        type: errorType,
        reason: "Buyer has insufficient funds to complete this transaction",
        error,
      };
      break;

    case "BUYER_OWNS_WIDGET":
      return {
        type: errorType,
        reason: "Buyer and seller cannot be the same user",
        error,
      };
      break;

    default:
      throw new Error("Please specify a workflow failure mode");
      break;
  }
}

export type { TFailure };
export { defineFailure };
