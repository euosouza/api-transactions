import cookie from "@fastify/cookie";
import fastify from "fastify";
import { env } from "./env/index";
import { transactionsRoutes } from "./routes/transactions.routes";

const app = fastify({
  logger: true,
});
const PORT = env.PORT;

app.register(cookie);
app.register(transactionsRoutes, {
  prefix: "transactions",
});

app.listen({ port: PORT }).then(() => {
  console.log(`🔥 Servidor está rodando na porta ${PORT}`);
});
