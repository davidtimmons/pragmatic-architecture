import { TGenericFailure } from "./types";

/**
 * Log the failure. This function could be extended to perform additional reporting,
 * such as storing the error within a database or sending an email notification.
 *
 * @param failure - Failure object containing information about an error
 */
function reportFailure<T extends string>(failure: TGenericFailure<T>) {
  console.error(failure);
}

export default { reportFailure };
