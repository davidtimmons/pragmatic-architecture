import Db from "../../database";

/// TYPES ///

type TWidget = {
  id_seller: number;
  description: string;
  price: number;
};

export type TWidgetRecord = TWidget & {
  id: number;
  purchased: 0 | 1;
};

/// LOGIC ///

async function createWidget(widget: TWidget): Promise<void | Error> {
  const maybeResult = await Db.run(
    `INSERT INTO Widget (id_seller, description, price)
     VALUES ($id_seller, $description, $price)`,
    {
      $id_seller: widget.id_seller,
      $description: widget.description,
      $price: widget.price,
    }
  );

  if (maybeResult instanceof Error) return new Error("Could not create widget");
}

async function getWidget(widgetId: number): Promise<TWidgetRecord | Error> {
  const maybeResult = await Db.retrieve<TWidgetRecord>("SELECT * FROM Widget WHERE id=?", widgetId);

  if (maybeResult instanceof Error || maybeResult.length < 1) {
    return new Error("Could not retrieve widget");
  }

  return maybeResult[0];
}

async function updatePurchased(widgetId: number, purchased: boolean): Promise<void | Error> {
  const purchasedValue = purchased ? 1 : 0;
  const maybeResult = await Db.run(
    "UPDATE Widget SET purchased=? WHERE id=?",
    purchasedValue,
    widgetId
  );

  if (maybeResult instanceof Error) return new Error("Could not update widget purchased status");
}

export default { createWidget, getWidget, updatePurchased };
