import test from "ava";
import Db from "../../database";
import { TUserRecord } from "../../services/user";
import { TWidgetRecord } from "../../services/widget";
import { TTransactionRecord } from "../../services/transaction";
import PurchaseWidget from ".";

const { purchaseWidget } = PurchaseWidget;

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
  const result = await purchaseWidget(2, 1);
  if (result instanceof Error) throw result;

  // Test the results.
  const buyer = await Db.retrieve<TUserRecord>("SELECT * FROM User WHERE id=2");
  const seller = await Db.retrieve<TUserRecord>("SELECT * FROM User WHERE id=1");
  const widget = await Db.retrieve<TWidgetRecord>("SELECT * FROM Widget WHERE id=1");
  const transaction = await Db.retrieve<TTransactionRecord>(
    "SELECT * FROM Transaction_Record WHERE id=1"
  );

  if (
    buyer instanceof Error ||
    seller instanceof Error ||
    widget instanceof Error ||
    transaction instanceof Error
  ) {
    throw Error("Could not retrieve entities");
  }

  t.is(buyer[0].balance, 5.0);
  t.is(seller[0].balance, 14.75);
  t.is(widget[0].purchased, 1);
  t.is(transaction[0].id_buyer, 2);
  t.is(transaction[0].id_seller, 1);
  t.is(transaction[0].id_widget, 1);
  t.truthy(transaction[0].datetime_unix);
});

test("purhaseWidget() should not allow a transaction with insufficient funds", async (t) => {
  await Db.run("UPDATE User SET balance=? WHERE id=?", 0.0, 2);
  const result = await purchaseWidget(2, 1);
  t.assert(result instanceof Error);
  t.is(result?.message, "Buyer has insufficient funds");
});

test("purhaseWidget() should not allow a purchased widget to be re-purchased", async (t) => {
  await Db.run("UPDATE Widget SET purchased=? WHERE id=?", 1, 1);
  const result = await purchaseWidget(2, 1);
  t.assert(result instanceof Error);
  t.is(result?.message, "Widget cannot be purchased again");
});

test("purhaseWidget() should not allow a buyer to purchase an owned widget", async (t) => {
  const result = await purchaseWidget(1, 1);
  t.assert(result instanceof Error);
  t.is(result?.message, "Buyer cannot purchase an owned widget");
});
