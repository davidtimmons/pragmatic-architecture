import Db from "../../database";

/// TYPES ///

type TMarketplaceFee = { marketplace: number };

/// LOGIC ///

async function getMarketplaceFee(): Promise<number | Error> {
  const maybeResult = await Db.retrieve<TMarketplaceFee>(
    "SELECT marketplace FROM Fee ORDER BY id ASC LIMIT 1"
  );

  if (maybeResult instanceof Error || maybeResult.length < 1) {
    return new Error("Could not retrieve marketplace fee");
  }

  return maybeResult[0].marketplace;
}

export default { getMarketplaceFee };
