import test from "ava";
import Fee from ".";

const { getMarketplaceFee } = Fee;

test("getMarketplaceFee() should return the marketplace fee", async (t) => {
  const fee = await getMarketplaceFee();
  t.is(fee, 0.05);
});
