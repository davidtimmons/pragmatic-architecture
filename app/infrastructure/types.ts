import { Result, Err } from "neverthrow";

type TGenericFailure<T extends string> = {
  type: T;
  reason: string;
  error: Error | undefined;
};

type PromisedErr<E> = Promise<Err<never, E>>;
type PromisedResult<T, E> = Promise<Result<T, E>>;

export type { PromisedErr, PromisedResult, TGenericFailure };
