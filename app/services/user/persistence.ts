import { Result, err, ok } from "neverthrow";
import Database, { TFailure as TDatabaseFailure, TDbRunResult } from "../../database";
import Infrastructure, { PromisedResult, TMatch } from "../../infrastructure";
import { defineFailure, TFailure } from "./errors";

/// TYPES ///

type TUser = {
  first_name: string;
  last_name: string;
  email: string;
};

export type TUserRecord = TUser & {
  id: number;
  balance: number;
};

type TGetUserOptions = {
  id?: number;
  email?: string;
};

type TFailureModes = TFailure | TDatabaseFailure;
type TMaybeRunResult = TMatch<TDbRunResult, TFailureModes>;
type TMaybeUser = TMatch<TUserRecord, TFailureModes>;

/// LOGIC ///

/**
 * Create a new user record.
 *
 * @param account - Object containing the relevant user information
 */
async function createUser(account: TUser): PromisedResult<TDbRunResult, TFailureModes> {
  const maybeRunResult = await Database.run(
    `INSERT INTO User (first_name, last_name, email)
     VALUES ($first_name, $last_name, $email)`,
    {
      $first_name: account.first_name,
      $last_name: account.last_name,
      $email: account.email,
    }
  );

  const handleSuccess = (result: TDbRunResult) => {
    if (result?.lastID && result.lastID > 0) {
      return ok(result);
    } else {
      return err(defineFailure("FAILED_TO_CREATE_USER"));
    }
  };

  return maybeRunResult.match<TMaybeRunResult>(handleSuccess, Infrastructure.handleFailure);
}

/**
 * Retrieve the specified user from the database.
 *
 * @param options - Object containing a user ID or email address
 */
async function getUser(options: TGetUserOptions): PromisedResult<TUserRecord, TFailureModes> {
  let maybeUserRecords: Result<TUserRecord[], TFailureModes> = err(
    defineFailure("FAILED_TO_RETRIEVE_USER")
  );

  if (options.hasOwnProperty("id")) {
    maybeUserRecords = await Database.retrieve<TUserRecord>(
      "SELECT * FROM User WHERE id=?",
      options.id
    );
  } else if (options.hasOwnProperty("email")) {
    maybeUserRecords = await Database.retrieve<TUserRecord>(
      "SELECT * FROM User WHERE email=?",
      options.email
    );
  }

  const handleSuccess = (userRecords: TUserRecord[]) => {
    if (userRecords.length < 1) {
      return err(defineFailure("FAILED_TO_RETRIEVE_USER"));
    } else {
      return ok(userRecords[0]);
    }
  };

  return maybeUserRecords.match<TMaybeUser>(handleSuccess, Infrastructure.handleFailure);
}

/**
 * Set the account balance associated with this user.
 *
 * @param userId - ID associated with this user
 * @param balance - New account balance for this user
 * @returns
 */
async function setAccountBalance(
  userId: number,
  balance: number
): PromisedResult<TDbRunResult, TFailureModes> {
  const maybeRunResult = await Database.run(
    "UPDATE User SET balance=? WHERE id=?",
    balance,
    userId
  );

  const handleSuccess = (result: TDbRunResult) => {
    if (result?.changes && result.changes > 0) {
      return ok(result);
    } else {
      return err(defineFailure("FAILED_TO_SET_ACCOUNT_BALANCE"));
    }
  };

  return maybeRunResult.match<TMaybeRunResult>(handleSuccess, Infrastructure.handleFailure);
}

export type { TFailureModes };
export default {
  createUser,
  getUser,
  setAccountBalance,
};
