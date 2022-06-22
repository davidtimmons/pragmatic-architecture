import test from "ava";
import { privateExports } from "../logic";

const { openDatabase, closeDatabase, selectDatabase } = privateExports;

test("openDatabase() and closeDatabase() should work without failing", async (t) => {
  const maybeDatabase = await openDatabase(selectDatabase());
  t.true(maybeDatabase.isOk());

  const maybeCloseFailed = await closeDatabase(maybeDatabase);
  t.true(maybeCloseFailed.isOk());
});
