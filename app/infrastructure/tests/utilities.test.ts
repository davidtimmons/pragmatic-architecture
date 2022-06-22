import test from "ava";
import Utilities from "../utilities";

const { handleAsyncFailure, handleFailure } = Utilities;

test("handleAsyncFailure() should return a promised failure result object", async (t) => {
  const result = await handleAsyncFailure({
    type: "FAILED_TO_RUN_SQL",
    reason: "",
    error: new Error(),
  });

  t.true(result.isErr());
});

test("handleFailure() should return a failure result object", (t) => {
  const result = handleFailure({
    type: "FAILED_TO_RUN_SQL",
    reason: "",
    error: new Error(),
  });

  t.true(result.isErr());
});
