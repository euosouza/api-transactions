import cookie from "@fastify/cookie";
import fastify from "fastify";
import { transactionsRoutes } from "./routes/transactions.routes";

export const app = fastify({
  logger: false,
});

app.register(cookie);
app.register(transactionsRoutes, {
  prefix: "transactions",
});
