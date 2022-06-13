import Express, { Express as TExpress } from "express";
import Dotenv from "dotenv";
import Routes from "./api/routes";

Dotenv.config();

const app: TExpress = Express();
const port = process.env.PORT;

app.use(Express.json()); // For parsing application/json request bodies
app.use(Routes);

app.listen(port, () => {
  console.log(`The server is running at localhost:${port}`);
});
