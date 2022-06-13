import Db from "../../database";

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

/// LOGIC ///

async function createTransaction(transaction: TTransaction): Promise<void | Error> {
  const maybeError = await Db.run(
    `INSERT INTO Transaction_Record (id_buyer, id_seller, id_widget)
     VALUES ($idBuyer, $idSeller, $idWidget)`,
    {
      $idBuyer: transaction.id_buyer,
      $idSeller: transaction.id_seller,
      $idWidget: transaction.id_widget,
    }
  );

  if (maybeError instanceof Error) return new Error("Could not create transaction");
}

export default { createTransaction };
