import test from "ava";
import Db from "../../../database";
import { TUserRecord } from "../../../services/user";
import { TWidgetRecord } from "../../../services/widget";
import { TTransactionRecord } from "../../../services/transaction";
import PurchaseWidget from "..";

test.beforeEach("Insert users and a widget into the database", async () => {
  // The tables should be empty, so the records should have ids starting at 1.
  await Db.run(
    `INSERT INTO User (first_name, last_name, email, balance)
      VALUES ($first_name, $last_name, $email, $balance)`,
    {
      // id: 1
      $first_name: "Babe",
      $last_name: "Ruth",
      $email: "b.ruth@example.com",
      $balance: 10.0,
    }
  );

  await Db.run(
    `INSERT INTO User (first_name, last_name, email, balance)
        VALUES ($first_name, $last_name, $email, $balance)`,
    {
      // id: 2
      $first_name: "Ryan",
      $last_name: "Laukat",
      $email: "r.laukat@example.com",
      $balance: 10.0,
    }
  );

  await Db.run(
    `INSERT INTO Widget (id_seller, description, price)
      VALUES ($id_seller, $description, $price)`,
    {
      // id: 1
      $id_seller: 1,
      $description: "A really cool widget",
      $price: 5.0,
    }
  );
});

test.afterEach("Reset the tables", async () => {
  await Db.run("DELETE FROM User");
  await Db.run("DELETE FROM Widget");
  await Db.run("DELETE FROM Transaction_Record");
});

test("purhaseWidget() should correctly complete a transaction", async (t) => {
  // Run the workflow.
  const maybeResult = await PurchaseWidget.main(2, 1);
  if (maybeResult.isErr()) throw maybeResult.error.error;

  // Confirm there are no database errors.
  const maybeBuyer = await Db.retrieve<TUserRecord>("SELECT * FROM User WHERE id=2");
  const maybeSeller = await Db.retrieve<TUserRecord>("SELECT * FROM User WHERE id=1");
  const maybeWidget = await Db.retrieve<TWidgetRecord>("SELECT * FROM Widget WHERE id=1");
  const maybeTransaction = await Db.retrieve<TTransactionRecord>(
    "SELECT * FROM Transaction_Record WHERE id=1"
  );

  if (
    maybeBuyer.isErr() ||
    maybeSeller.isErr() ||
    maybeWidget.isErr() ||
    maybeTransaction.isErr()
  ) {
    throw new Error("Could not retrieve entities");
  }

  // Test the results.
  const buyer = maybeBuyer.value[0];
  const seller = maybeSeller.value[0];
  const widget = maybeWidget.value[0];
  const transaction = maybeTransaction.value[0];

  t.is(buyer.balance, 5.0);
  t.is(seller.balance, 14.75);
  t.is(widget.purchased, 1);
  t.is(transaction.id_buyer, 2);
  t.is(transaction.id_seller, 1);
  t.is(transaction.id_widget, 1);
  t.truthy(transaction.datetime_unix);
});

test("purhaseWidget() should not allow a purchased widget to be re-purchased", async (t) => {
  await Db.run("UPDATE Widget SET purchased=? WHERE id=?", 1, 1);
  const result = await PurchaseWidget.main(2, 1);
  t.true(result.isErr());
  t.is(result._unsafeUnwrapErr().type, "WIDGET_IS_UNAVAILABLE");
});

test("purhaseWidget() should not allow a transaction with insufficient funds", async (t) => {
  await Db.run("UPDATE User SET balance=? WHERE id=?", 0.0, 2);

  const result = await PurchaseWidget.main(2, 1);
  t.true(result.isErr());
  t.is(result._unsafeUnwrapErr().type, "INSUFFICIENT_FUNDS");
});

test("purhaseWidget() should not allow a buyer to purchase an owned widget", async (t) => {
  const result = await PurchaseWidget.main(1, 1);
  t.true(result.isErr());
  t.is(result._unsafeUnwrapErr().type, "BUYER_OWNS_WIDGET");
});
