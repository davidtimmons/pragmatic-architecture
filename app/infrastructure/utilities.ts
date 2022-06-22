import { Err, err } from "neverthrow";
import { TGenericFailure, PromisedErr } from "./types";

/**
 * Convenience function used to promisify and wrap a failure object within an error result.
 *
 * @param failure - Generic failure object containing error information
 */
function handleAsyncFailure<T extends string>(
  failure: TGenericFailure<T>
): PromisedErr<TGenericFailure<T>> {
  // Returning a rejected promise will end async function execution if not enclosed within a
  // try-catch block. The app should report errors but not automatically fail when they occur.
  return Promise.resolve(err(failure));
}

/**
 * Convenience function used to wrap a failure object within an error result.
 *
 * @param failure - Generic failure object containing error information
 */
function handleFailure<T extends string>(
  failure: TGenericFailure<T>
): Err<never, TGenericFailure<T>> {
  // Returning a rejected promise will end async function execution if not enclosed within a
  // try-catch block. The app should report errors but not automatically fail when they occur.
  return err(failure);
}

/**
 * Log the failure. This function could be extended to perform additional reporting,
 * such as storing the error within a database or sending an email notification.
 *
 * @param failure - Failure object containing information about an error
 */
function reportFailure<T extends string>(failure: TGenericFailure<T>) {
  console.error(failure);
}

export default {
  handleAsyncFailure,
  handleFailure,
  reportFailure,
};
