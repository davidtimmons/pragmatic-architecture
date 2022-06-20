import { Result, Ok, Err } from "neverthrow";

type TGenericFailure<T extends string> = {
  type: T;
  reason: string;
  error: Error | undefined;
};

type TMatch<T1, T2> = Ok<T1, never> | Err<never, T2>;

// The types below break the internal convention by not prepending the names with a T.
// However, in this case, leaving off the T arguably improves code readability.

type PromisedErr<E> = Promise<Err<never, E>>;
type PromisedResult<T, E> = Promise<Result<T, E>>;

export type {
  PromisedErr,
  PromisedResult,
  TGenericFailure,
  TMatch,
};
