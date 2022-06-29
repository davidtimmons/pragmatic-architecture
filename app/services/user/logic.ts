import { err } from "neverthrow";
import { defineFailure } from "./errors";
import Persistence, { TSetAccountBalance } from "./persistence";

const { createUser, getUser } = Persistence;

/**
 * Set the account balance associated with this user if the requested balance is reasonable.
 *
 * @param userId - ID associated with this user
 * @param balance - New account balance for this user
 */
const setAccountBalance: TSetAccountBalance = async (userId, balance) => {
  if (balance < 0) {
    return err(defineFailure("INCORRECT_ACCOUNT_BALANCE", new RangeError(`${balance} is < 0`)));
  }
  return await Persistence.setAccountBalance(userId, balance);
};

export default {
  createUser,
  getUser,
  setAccountBalance,
};
