import Express, { Request as TRequest, Response as TResponse } from "express";
import { Result } from "neverthrow";
import User from "../services/user";
import Widget from "../services/widget";
import PurchaseWidget from "../workflows/purchase-widget";
import ErrorResultHandler, { TFailure } from "./error-result-handler";

const router = Express.Router();

/// TYPES ///

type TSendResponseOptions<T> = {
  res: TResponse;
  maybeData: Result<T, TFailure>;
  shouldSendData: boolean;
  successStatusCode: number;
  successMessage: string;
};

/// LOGIC ///

function sendResponse<T>(options: TSendResponseOptions<T>) {
  const { res, maybeData, shouldSendData, successStatusCode, successMessage } = options;

  if (maybeData.isErr()) {
    const response = ErrorResultHandler.main(maybeData.error);
    res.status(response.error.status).json(response);
  } else {
    const data = shouldSendData ? maybeData.value : undefined;
    res.status(successStatusCode).json({
      status: successStatusCode,
      message: successMessage,
      data,
    });
  }
}

//== USERS ==//

router.post("/users", async (req: TRequest, res: TResponse) => {
  const maybeData = await User.createUser({
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  });

  sendResponse({
    res,
    maybeData,
    shouldSendData: false,
    successStatusCode: 201,
    successMessage: "Successfully created a new user",
  });
});

router
  .route("/users/:user_id")

  .get(async (req: TRequest, res: TResponse) => {
    const maybeData = await User.getUser({ id: Number(req.params.user_id) });

    sendResponse({
      res,
      maybeData,
      shouldSendData: true,
      successStatusCode: 200,
      successMessage: "Successfully retrieved user",
    });
  })

  .patch(async (req: TRequest, res: TResponse) => {
    const maybeData = await User.setAccountBalance(
      Number(req.params.user_id),
      Number(req.body.balance)
    );

    sendResponse({
      res,
      maybeData,
      shouldSendData: false,
      successStatusCode: 200,
      successMessage: "Successfully updated user balance",
    });
  });

//== WIDGETS ==//

router.post("/widgets", async (req: TRequest, res: TResponse) => {
  const maybeData = await Widget.createWidget({
    id_seller: Number(req.body.id_seller),
    description: req.body.description,
    price: Number(req.body.price),
  });

  sendResponse({
    res,
    maybeData,
    shouldSendData: false,
    successStatusCode: 201,
    successMessage: "Successfully created a new widget",
  });
});

router.get("/widgets/:widget_id", async (req: TRequest, res: TResponse) => {
  const maybeData = await Widget.getWidget(Number(req.params.widget_id));

  sendResponse({
    res,
    maybeData,
    shouldSendData: true,
    successStatusCode: 200,
    successMessage: "Successfully retrieved widget",
  });
});

//== WORKFLOWS ==//

router.post("/widgets/:widget_id", async (req: TRequest, res: TResponse) => {
  const maybeData = await PurchaseWidget.main(
    Number(req.body.buyer_id),
    Number(req.params.widget_id)
  );

  sendResponse({
    res,
    maybeData,
    shouldSendData: false,
    successStatusCode: 200,
    successMessage: "Successfully completed the widget purchase",
  });
});

export default router;
