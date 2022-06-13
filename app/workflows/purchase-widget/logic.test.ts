import test from "ava";
import { privateExports } from "./logic";

const { calculateBalances } = privateExports;

/// TYPES ///

type TAmountsTuple = [number, number, number, number];
type TBalancesTuple = [number, number];
type TBalancesTest = [TAmountsTuple, TBalancesTuple];

/// LOGIC ///

test("calculateBalances() should calculate the correct balances", (t) => {
  const createAmountObject = (
    buyerBalance: number,
    sellerBalance: number,
    widgetPrice: number,
    marketplaceFee: number
  ) => ({
    buyerBalance,
    sellerBalance,
    widgetPrice,
    marketplaceFee,
  });

  // These are shorthand tuples to make the test cases more compact and readable.
  // The first tuple has the same order as the object factory function signature above.
  // The second tuple is in order of the buyer balance then seller balance.
  // prettier-ignore
  const tests: TBalancesTest[] = [
    [[0, 0, 0, 0], [0, 0]],
    [[1, 1, 1, 1], [0, 1]],
    [[-1, -1, -1, -1], [0, -3]],
    [[1, 1, 2, 0.5], [-1, 2]],
    [[10, 5, 4, 0.05], [6, 8.8]],
  ];

  tests.forEach((test, idx) => {
    const [amounts, balances] = test;
    const amountObject = createAmountObject(...amounts);
    const { newBuyerBalance, newSellerBalance } = calculateBalances(amountObject);
    t.is(balances[0], newBuyerBalance, `Buyer balance failed at test index ${idx}`);
    t.is(balances[1], newSellerBalance, `Seller balance failed at test index ${idx}`);
  });
});
