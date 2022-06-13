import Express, {
  Request as TRequest,
  Response as TResponse,
  NextFunction as TNextFunction,
} from "express";
import User from "../services/user";
import Widget from "../services/widget";
import PurchaseWidget from "../workflows/purchase-widget";

const router = Express.Router();

/// USERS ///

router.post("/users", async (req: TRequest, res: TResponse) => {
  const { email, first_name, last_name } = req.body;

  const maybeError = await User.createUser({
    email,
    first_name,
    last_name,
  });

  if (maybeError instanceof Error) {
    res.status(500).json({
      status: 500,
      message: maybeError.message,
    });
  } else {
    res.status(201).json({
      status: 201,
      message: "Successfully created a new user",
    });
  }
});

router
  .route("/users/:userId")

  .get(async (req: TRequest, res: TResponse) => {
    const maybeUser = await User.getUser({ id: Number(req.params.userId) });

    if (maybeUser instanceof Error) {
      res.status(500).json({
        status: 500,
        message: maybeUser.message,
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved user",
        data: maybeUser,
      });
    }
  })

  .patch(async (req: TRequest, res: TResponse, next: TNextFunction) => {
    const userId = Number(req.params.userId);
    const { balance } = req.body;

    if (!balance || balance < 0) {
      res.status(400).json({
        status: 400,
        message: "The request was invalid",
      });
      return next();
    }

    const maybeError = await User.updateBalance(userId, balance);

    if (maybeError instanceof Error) {
      res.status(500).json({
        status: 500,
        message: maybeError.message,
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Successfully updated user balance",
      });
    }
  });

/// WIDGETS ///

router.post("/widgets", async (req: TRequest, res: TResponse) => {
  const { id_seller, description, price } = req.body;

  const maybeError = await Widget.createWidget({
    id_seller,
    description,
    price,
  });

  if (maybeError instanceof Error) {
    res.status(500).json({
      status: 500,
      message: maybeError.message,
    });
  } else {
    res.status(201).json({
      status: 201,
      message: "Successfully created a new widget",
    });
  }
});

router.get("/widgets/:widgetId", async (req: TRequest, res: TResponse) => {
  const maybeWidget = await Widget.getWidget(Number(req.params.widgetId));

  if (maybeWidget instanceof Error) {
    res.status(500).json({
      status: 500,
      message: maybeWidget.message,
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved widget",
      data: maybeWidget,
    });
  }
});

/// WORKFLOWS ///

router.post("/widgets/:widgetId", async (req: TRequest, res: TResponse) => {
  const { buyer_id: buyerId } = req.body;
  const widgetId = Number(req.params.widgetId);

  const maybeError = await PurchaseWidget.purchaseWidget(buyerId, widgetId);

  if (maybeError instanceof Error) {
    res.status(500).json({
      status: 500,
      message: maybeError.message,
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully completed the widget purchase",
    });
  }
});

export default router;
