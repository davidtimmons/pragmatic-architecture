import test from "ava";
import { TFailure, defineFailure } from "../errors";

test("defineFailure() should return a failure object with error information", (t) => {
  const testFailure01: TFailure = {
    type: "FAILED_TO_RUN_SQL",
    reason: "Failed to run the SQL query",
    error: undefined,
  };

  const result01 = defineFailure("FAILED_TO_RUN_SQL");
  const result02 = defineFailure("FAILED_TO_RETRIEVE_RECORDS", new Error("test"));

  t.deepEqual(result01, testFailure01);
  t.is(result02.error?.message, "test");
});
