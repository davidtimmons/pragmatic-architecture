import test from "ava";
import Db from "../../database";
import Transaction, { TTransactionRecord } from ".";

const { createTransaction } = Transaction;

test.before("Insert a user and widget record into the database", async () => {
  // The tables should be empty, so the records should have ids equal to 1.
  await Db.run(
    `INSERT INTO User (first_name, last_name, email)
     VALUES ($first_name, $last_name, $email)`,
    {
      $first_name: "Babe",
      $last_name: "Ruth",
      $email: "b.ruth@example.com",
    }
  );

  await Db.run(
    `INSERT INTO Widget (id_seller, description, price)
     VALUES ($id_seller, $description, $price)`,
    {
      $id_seller: 1,
      $description: "A really cool widget",
      $price: 2.34,
    }
  );
});

test.after("Reset the tables", async () => {
  await Db.run("DELETE FROM User");
  await Db.run("DELETE FROM Widget");
  await Db.run("DELETE FROM Transaction_Record");
});

test("createTransaction() should create a widget transaction record", async (t) => {
  await createTransaction({
    id_buyer: 1,
    id_seller: 1,
    id_widget: 1,
  });

  const result = await Db.retrieve<TTransactionRecord>(
    "SELECT * FROM Transaction_Record WHERE id=1"
  );
  if (result instanceof Error) throw result;

  t.is(result[0].id, 1);
  t.truthy(result[0].datetime_unix);
  t.is(result[0].id_buyer, 1);
  t.is(result[0].id_seller, 1);
  t.is(result[0].id_widget, 1);
});
