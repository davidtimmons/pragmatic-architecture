import Fee from "../../services/fee";
import User, { TUserRecord } from "../../services/user";
import Widget, { TWidgetRecord } from "../../services/widget";
import Transaction from "../../services/transaction";

/// TYPES ///

type TEntities = {
  buyer: TUserRecord;
  seller: TUserRecord;
  widget: TWidgetRecord;
  marketplaceFee: number;
};

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

/// LOGIC ///

/**
 * Coordinate multiple services to complete the purchase transaction. Database errors
 * may occur whenever we access it. Additionally, the buyer may be unable to purchase
 * the widget. When any of this happens, bubble the errors back up the call stack to
 * provide the option of alerting the end user through the API response.
 */
async function purchaseWidget(buyerId: number, widgetId: number): Promise<void | Error> {
  const entities = await getEntities(buyerId, widgetId);
  if (entities instanceof Error) return entities;

  const { buyer, seller, widget, marketplaceFee } = entities;
  const balances = calculateBalances({
    marketplaceFee,
    buyerBalance: buyer.balance,
    sellerBalance: seller.balance,
    widgetPrice: widget.price,
  });

  const updateResult = await updateEntities(entities, balances);
  if (updateResult instanceof Error) return updateResult;
}

/**
 * Get all database entities involved with this widget purchase.
 */
async function getEntities(buyerId: number, widgetId: number): Promise<TEntities | Error> {
  const buyer = await User.getUser({ id: buyerId });
  if (buyer instanceof Error) return buyer;

  const widget = await Widget.getWidget(widgetId);
  if (widget instanceof Error) return widget;
  if (widget.purchased) return new Error("Widget cannot be purchased again");
  if (buyer.balance < widget.price) return new Error("Buyer has insufficient funds");
  if (buyer.id === widget.id_seller) return new Error("Buyer cannot purchase an owned widget");

  const seller = await User.getUser({ id: widget.id_seller });
  if (seller instanceof Error) return seller;

  const marketplaceFee = await Fee.getMarketplaceFee();
  if (marketplaceFee instanceof Error) return marketplaceFee;

  return { buyer, seller, widget, marketplaceFee };
}

/**
 * Update all database entities with the result of this widget purchase.
 */
async function updateEntities(entities: TEntities, balances: TBalances): Promise<void | Error> {
  const { buyer, seller, widget } = entities;
  const { newBuyerBalance, newSellerBalance } = balances;

  const buyerResult = await User.updateBalance(buyer.id, newBuyerBalance);
  if (buyerResult instanceof Error) return buyerResult;

  const widgetResult = await Widget.updatePurchased(widget.id, true);
  if (widgetResult instanceof Error) return widgetResult;

  const sellerResult = await User.updateBalance(seller.id, newSellerBalance);
  if (sellerResult instanceof Error) return sellerResult;

  const transactionResult = await Transaction.createTransaction({
    id_buyer: buyer.id,
    id_seller: seller.id,
    id_widget: widget.id,
  });
  if (transactionResult instanceof Error) return transactionResult;
}

/**
 * Determine what the new user balances should be after a successful purchase.
 */
function calculateBalances(options: TAmounts): TBalances {
  const { buyerBalance, sellerBalance, widgetPrice, marketplaceFee } = options;

  const newBuyerBalance = buyerBalance - widgetPrice;
  const widgetProceeds = widgetPrice * (1 - marketplaceFee);
  const newSellerBalance = sellerBalance + widgetProceeds;

  return { newBuyerBalance, newSellerBalance };
}

export const privateExports = {
  calculateBalances,
};

export default { purchaseWidget };
