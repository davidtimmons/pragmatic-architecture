import test from "ava";
import Fee from ".";

const { getMarketplaceFee } = Fee;

test("getMarketplaceFee() should return the marketplace fee", async (t) => {
  const maybeFee = await getMarketplaceFee();
  t.is(maybeFee._unsafeUnwrap(), 0.05);
});
