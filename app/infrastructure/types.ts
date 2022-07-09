import { Result, Ok, Err } from "neverthrow";

// Expand this type to include more details as desired. Possibilities include error codes,
// error categories, and state variables to help diagnose app failures.
type TGenericFailure<T extends string> = {
  type: T;
  reason: string;
  error: Error | undefined;
};

// These types are syntactic sugar to make working with neverthrow cleaner.
type TMatch<T1, T2> = Ok<T1, never> | Err<never, T2>;
type TError<T> = Err<never, T>;

// The types below break the internal type naming convention by not prepending the names with a T.
// Leaving off the T here arguably improves code readability.
type PromisedErr<E> = Promise<Err<never, E>>;
type PromisedResult<T, E> = Promise<Result<T, E>>;

export type { PromisedErr, PromisedResult, TError, TGenericFailure, TMatch };
