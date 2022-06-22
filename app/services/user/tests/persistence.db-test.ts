import test from "ava";
import Db from "../../../database";
import User, { TUserRecord } from "..";

const { createUser, getUser, setAccountBalance } = User;

test.afterEach("Reset the User table", async () => {
  await Db.run("DELETE FROM User");
});

test("createUser() should create a user record", async (t) => {
  // Insert a User record into the test database.
  const record = {
    first_name: "Babe",
    last_name: "Ruth",
    email: "b.ruth@example.com",
  };

  await createUser(record);

  // Get the new record.
  const maybeResult = await Db.retrieve<TUserRecord>(
    "SELECT * FROM User WHERE email=?",
    record.email
  );
  const result = maybeResult._unsafeUnwrap();

  // Test the result.
  t.is(result.length, 1);
  t.is(result[0].balance, 0);
  t.is(result[0].first_name, record.first_name);
  t.is(result[0].last_name, record.last_name);
  t.is(result[0].email, record.email);
});

test("getUser() should retrieve a user record", async (t) => {
  // Insert a User record into the test database.
  const record = {
    first_name: "Babe",
    last_name: "Ruth",
    email: "b.ruth@example.com",
  };

  await createUser(record);

  // Get the new record by various means.
  const maybeResult01 = await getUser({ email: record.email });
  const maybeResult02 = await getUser({ id: 1 });
  const result01 = maybeResult01._unsafeUnwrap();
  const result02 = maybeResult02._unsafeUnwrap();

  // Test the result.
  t.deepEqual(result01, result02);
  t.is(result01.balance, 0);
  t.is(result01.first_name, record.first_name);
  t.is(result01.last_name, record.last_name);
  t.is(result01.email, record.email);
});

test("setAccountBalance() should replace the existing account balance", async (t) => {
  // Insert a User record into the test database and modify the balance.
  await createUser({
    first_name: "Babe",
    last_name: "Ruth",
    email: "b.ruth@example.com",
  });

  const newBalance = 10.75;
  await setAccountBalance(1, newBalance);

  // Get the new record.
  const maybeResult = await getUser({ id: 1 });
  const result = maybeResult._unsafeUnwrap();

  // Test the result.
  t.is(result.balance, newBalance);
});
