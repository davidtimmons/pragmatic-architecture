import { err, ok } from "neverthrow";
import type { PromisedResult, TError } from "../../infrastructure";
import Fee, { TFailureModes as TFeeFailureModes } from "../../services/fee";
import User, { TFailureModes as TUserFailureModes } from "../../services/user";
import Widget, { TFailureModes as TWidgetFailureModes } from "../../services/widget";
import Transaction, { TFailureModes as TTransactionFailureModes } from "../../services/transaction";
import { defineFailure, TFailure } from "./errors";

/// TYPES ///

type TAmounts = {
  buyerBalance: number;
  sellerBalance: number;
  widgetPrice: number;
  marketplaceFee: number;
};

type TBalances = {
  newBuyerBalance: number;
  newSellerBalance: number;
};

type TFailureModes =
  | TFailure
  | TFeeFailureModes
  | TTransactionFailureModes
  | TUserFailureModes
  | TWidgetFailureModes;

/// LOGIC ///

/**
 * Coordinate multiple services to complete the purchase transaction. Database errors
 * may occur whenever we access it. Additionally, the buyer may be unable to purchase
 * the widget. When any of this happens, bubble the errors back up the call stack to
 * provide the option of alerting the end user through the API response.
 *
 * @param buyerId - ID associated with the user buying this widget
 * @param widgetId - ID associated with this widget
 */
async function main(buyerId: number, widgetId: number): PromisedResult<void, TFailureModes> {
  // Get all entities required for this transaction.
  const maybeBuyer = await User.getUser({ id: buyerId });
  if (maybeBuyer.isErr()) return maybeBuyer as TError<TUserFailureModes>;
  const buyer = maybeBuyer.value;

  const maybeWidget = await Widget.getWidget(widgetId);
  if (maybeWidget.isErr()) return maybeWidget as TError<TWidgetFailureModes>;
  const widget = maybeWidget.value;

  if (widget.purchased) return err(defineFailure("WIDGET_IS_UNAVAILABLE"));
  if (buyer.balance < widget.price) return err(defineFailure("INSUFFICIENT_FUNDS"));
  if (buyer.id === widget.id_seller) return err(defineFailure("BUYER_OWNS_WIDGET"));

  const maybeSeller = await User.getUser({ id: widget.id_seller });
  if (maybeSeller.isErr()) return maybeSeller as TError<TUserFailureModes>;
  const seller = maybeSeller.value;

  const maybeMarketplaceFee = await Fee.getMarketplaceFee();
  if (maybeMarketplaceFee.isErr()) return maybeMarketplaceFee as TError<TFeeFailureModes>;
  const marketplaceFee = maybeMarketplaceFee.value;

  // Calculate transaction balances.
  const { newBuyerBalance, newSellerBalance } = calculateBalances({
    marketplaceFee,
    buyerBalance: buyer.balance,
    sellerBalance: seller.balance,
    widgetPrice: widget.price,
  });

  // Update all entities involved in this transaction.
  const maybeBuyerResult = await User.setAccountBalance(buyer.id, newBuyerBalance);
  if (maybeBuyerResult.isErr()) return maybeBuyerResult as TError<TUserFailureModes>;

  const maybeWidgetResult = await Widget.setPurchased(widget.id, true);
  if (maybeWidgetResult.isErr()) return maybeWidgetResult as TError<TWidgetFailureModes>;

  const maybeSellerResult = await User.setAccountBalance(seller.id, newSellerBalance);
  if (maybeSellerResult.isErr()) return maybeSellerResult as TError<TUserFailureModes>;

  const maybeTransactionResult = await Transaction.createTransaction({
    id_buyer: buyer.id,
    id_seller: seller.id,
    id_widget: widget.id,
  });
  if (maybeTransactionResult.isErr())
    return maybeTransactionResult as TError<TTransactionFailureModes>;

  return ok(undefined);
}

/**
 * Determine what the new user balances should be after a successful purchase.
 */
function calculateBalances({
  buyerBalance,
  sellerBalance,
  widgetPrice,
  marketplaceFee,
}: TAmounts): TBalances {
  const newBuyerBalance = buyerBalance - widgetPrice;
  const widgetProceeds = widgetPrice * (1 - marketplaceFee);
  const newSellerBalance = sellerBalance + widgetProceeds;
  return { newBuyerBalance, newSellerBalance };
}

export const privateExports = {
  calculateBalances,
};

export default { main };
