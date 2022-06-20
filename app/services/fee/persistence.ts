import { err, ok } from "neverthrow";
import Infrastructure, { PromisedResult, TMatch } from "../../infrastructure";
import Database, { TFailure as TDatabaseFailure } from "../../database";
import { defineFailure, TFailure } from "./errors";

/// TYPES ///

type TFeeRecord = { marketplace: number };
type TFailureModes = TFailure | TDatabaseFailure;
type TMaybeFee = TMatch<number, TFailureModes>;

/// LOGIC ///

/**
 * Get the marketplace fee from the database.
 */
async function getMarketplaceFee(): PromisedResult<number, TFailureModes> {
  const field = "marketplace";
  const maybeFeeRecords = await Database.retrieve<TFeeRecord>(
    `SELECT ${field} FROM Fee ORDER BY id ASC LIMIT 1`
  );

  const handleSuccess = (feeRecords: TFeeRecord[]) => {
    if (feeRecords.length < 1 || !(field in feeRecords[0])) {
      return err(defineFailure("FAILED_TO_RETRIEVE_MARKETPLACE_FEE"));
    } else {
      return ok(feeRecords[0].marketplace);
    }
  };

  const maybeFee = maybeFeeRecords.match<TMaybeFee>(handleSuccess, Infrastructure.handleFailure);
  return maybeFee;
}

export default { getMarketplaceFee };
