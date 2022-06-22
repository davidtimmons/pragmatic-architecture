import { Result, err, ok } from "neverthrow";
import Database, { TFailure as TDatabaseFailure, TDbRunResult } from "../../database";
import Infrastructure, { PromisedResult, TMatch } from "../../infrastructure";
import { defineFailure, TFailure } from "./errors";

/// TYPES ///

type TWidget = {
  id_seller: number;
  description: string;
  price: number;
};

export type TWidgetRecord = TWidget & {
  id: number;
  purchased: 0 | 1;
};

type TFailureModes = TFailure | TDatabaseFailure;
type TMaybeRunResult = TMatch<TDbRunResult, TFailureModes>;
type TMaybeWidget = TMatch<TWidgetRecord, TFailureModes>;

/// LOGIC ///

/**
 * Create a new widget record.
 *
 * @param widget - Object containing the relevant widget information
 */
async function createWidget(widget: TWidget): PromisedResult<TDbRunResult, TFailureModes> {
  const maybeRunResult = await Database.run(
    `INSERT INTO Widget (id_seller, description, price)
     VALUES ($id_seller, $description, $price)`,
    {
      $id_seller: widget.id_seller,
      $description: widget.description,
      $price: widget.price,
    }
  );

  const handleSuccess = (result: TDbRunResult) => {
    if (result.lastID && result.lastID > 0) {
      return ok(result);
    } else {
      return err(defineFailure("FAILED_TO_CREATE_WIDGET"));
    }
  };

  return maybeRunResult.match<TMaybeRunResult>(handleSuccess, Infrastructure.handleFailure);
}

/**
 * Retrieve the specified widget from the database.
 *
 * @param widgetId - ID associated with the desired widget
 */
async function getWidget(widgetId: number): PromisedResult<TWidgetRecord, TFailureModes> {
  const maybeWidgetRecords = await Database.retrieve<TWidgetRecord>(
    "SELECT * FROM Widget WHERE id=?",
    widgetId
  );

  const handleSuccess = (widgetRecords: TWidgetRecord[]) => {
    if (widgetRecords.length < 1) {
      return err(defineFailure("FAILED_TO_RETRIEVE_WIDGET"));
    } else {
      return ok(widgetRecords[0]);
    }
  };

  return maybeWidgetRecords.match<TMaybeWidget>(handleSuccess, Infrastructure.handleFailure);
}

/**
 * Set the purchased status associated with this widget.
 *
 * @param widgetId - ID associated with this widget
 * @param purchased - New purchased status for this widget
 */
async function setPurchased(
  widgetId: number,
  purchased: boolean
): PromisedResult<TDbRunResult, TFailureModes> {
  const purchasedValue = purchased ? 1 : 0;

  const maybeRunResult = await Database.run(
    "UPDATE Widget SET purchased=? WHERE id=?",
    purchasedValue,
    widgetId
  );

  const handleSuccess = (result: TDbRunResult) => {
    if (result?.changes && result.changes > 0) {
      return ok(result);
    } else {
      return err(defineFailure("FAILED_TO_SET_PURCHASED_STATUS"));
    }
  };

  return maybeRunResult.match<TMaybeRunResult>(handleSuccess, Infrastructure.handleFailure);
}

export default { createWidget, getWidget, setPurchased };
