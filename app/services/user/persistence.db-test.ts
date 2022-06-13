import test from "ava";
import Db from "../../database";
import User, { TUserRecord } from ".";

const { createUser, getUser, updateBalance } = User;

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
  const result = await Db.retrieve<TUserRecord>("SELECT * FROM User WHERE email=?", record.email);
  if (result instanceof Error) throw result;

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
  const result1 = await getUser({ email: record.email });
  if (result1 instanceof Error) throw result1;

  const result2 = await getUser({ id: 1 });
  if (result2 instanceof Error) throw result2;

  // Test the result.
  t.deepEqual(result1, result2);
  t.is(result1.balance, 0);
  t.is(result1.first_name, record.first_name);
  t.is(result1.last_name, record.last_name);
  t.is(result1.email, record.email);
});

test("updateBalance() should modify the user balance", async (t) => {
  // Insert a User record into the test database and modify the balance.
  await createUser({
    first_name: "Babe",
    last_name: "Ruth",
    email: "b.ruth@example.com",
  });

  const newBalance = 10.75;
  await updateBalance(1, newBalance);

  // Get the new record.
  const result = await getUser({ id: 1 });
  if (result instanceof Error) throw result;

  // Test the result.
  t.is(result.balance, newBalance);
});
