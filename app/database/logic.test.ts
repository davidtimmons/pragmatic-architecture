import test from "ava";
import { env } from "node:process";
import { privateExports } from "./logic";

const { DB_PATH, TEST_DB_PATH, selectDatabase } = privateExports;

test("selectDatabase() should return the correct database path", (t) => {
  const originalEnv = process.env.NODE_ENV;
  {
    env.NODE_ENV = "production";
    const result = selectDatabase();
    t.is(result, DB_PATH);
  }
  {
    env.NODE_ENV = "development";
    const result = selectDatabase();
    t.is(result, TEST_DB_PATH);
  }
  {
    env.NODE_ENV = undefined;
    const result = selectDatabase();
    t.is(result, TEST_DB_PATH);
  }
  env.NODE_ENV = originalEnv;
});
