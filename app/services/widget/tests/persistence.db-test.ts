import test from "ava";
import Db from "../../../database";
import Widget, { TWidgetRecord } from "..";

const { createWidget, getWidget, setPurchased } = Widget;

test.before("Insert a user record into the database", async () => {
  // The table should be empty, so the record should have an id equal to 1.
  await Db.run(
    `INSERT INTO User (first_name, last_name, email)
     VALUES ($first_name, $last_name, $email)`,
    {
      $first_name: "Babe",
      $last_name: "Ruth",
      $email: "b.ruth@example.com",
    }
  );
});

test.afterEach("Reset the Widget table", async () => {
  await Db.run("DELETE FROM Widget");
});

test.after("Reset the User table", async () => {
  await Db.run("DELETE FROM User");
});

test("createWidget() should create a widget record", async (t) => {
  // Insert a Widget record into the test database.
  const record = {
    id_seller: 1,
    description: "A really cool widget",
    price: 2.34,
  };

  await createWidget(record);

  // Get the new record and then reset the tables.
  const maybeResult = await Db.retrieve<TWidgetRecord>("SELECT * FROM Widget WHERE id_seller=?", 1);
  const result = maybeResult._unsafeUnwrap();

  // Test the result.
  t.is(result.length, 1);
  t.is(result[0].id, 1);
  t.is(result[0].purchased, 0);
  t.is(result[0].id_seller, record.id_seller);
  t.is(result[0].description, record.description);
  t.is(result[0].price, record.price);
});

test("getWidget() should retrieve a widget record", async (t) => {
  // Insert a Widget record into the test database.
  const record = {
    id_seller: 1,
    description: "A really cool widget",
    price: 2.34,
  };

  await Db.run(
    `INSERT INTO Widget (id_seller, description, price)
     VALUES ($id_seller, $description, $price)`,
    {
      $id_seller: record.id_seller,
      $description: record.description,
      $price: record.price,
    }
  );

  await createWidget(record);

  // Attempt to get the new record.
  const maybeResult = await getWidget(1);
  const result = maybeResult._unsafeUnwrap();

  // Test the result.
  t.is(result.id, 1);
  t.is(result.purchased, 0);
  t.is(result.id_seller, record.id_seller);
  t.is(result.description, record.description);
  t.is(result.price, record.price);
});

test("setPurchased() should set the widget purchased status", async (t) => {
  // Insert a Widget record into the test database and modify the purchased status.
  await Db.run(
    `INSERT INTO Widget (id_seller, description, price)
     VALUES ($id_seller, $description, $price)`,
    {
      $id_seller: 1,
      $description: "A really cool widget",
      $price: 2.34,
    }
  );

  await setPurchased(1, true);

  // Get the new record.
  const maybeResult = await getWidget(1);
  const result = maybeResult._unsafeUnwrap();

  // Test the result.
  t.is(result.purchased, 1);
});
