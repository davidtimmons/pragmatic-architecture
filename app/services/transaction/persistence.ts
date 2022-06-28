import { err, ok } from "neverthrow";
import Database, { TFailure as TDatabaseFailure, TDbRunResult } from "../../database";
import Infrastructure, { PromisedResult, TMatch } from "../../infrastructure";
import { defineFailure, TFailure } from "./errors";

/// TYPES ///

type TTransaction = {
  id_buyer: number;
  id_seller: number;
  id_widget: number;
};

export type TTransactionRecord = TTransaction & {
  id: number;
  datetime_unix: number;
};

type TFailureModes = TFailure | TDatabaseFailure;
type TMaybeRunResult = TMatch<TDbRunResult, TFailureModes>;

/// LOGIC ///

/**
 * Create a transaction record noting the buyer, seller, and widget associated
 * with this transaction.
 *
 * @param transaction - Object containing foreign database keys associated with this transaction
 */
async function createTransaction(
  transaction: TTransaction
): PromisedResult<TDbRunResult, TFailureModes> {
  const maybeRunResult = await Database.run(
    `INSERT INTO Transaction_Record (id_buyer, id_seller, id_widget)
     VALUES ($idBuyer, $idSeller, $idWidget)`,
    {
      $idBuyer: transaction.id_buyer,
      $idSeller: transaction.id_seller,
      $idWidget: transaction.id_widget,
    }
  );

  const handleSuccess = (result: TDbRunResult) => {
    if (result?.lastID && result.lastID > 0) {
      return ok(result);
    } else {
      return err(defineFailure("FAILED_TO_CREATE_TRANSACTION"));
    }
  };

  return maybeRunResult.match<TMaybeRunResult>(handleSuccess, Infrastructure.handleFailure);
}

export type { TFailureModes };
export default { createTransaction };
