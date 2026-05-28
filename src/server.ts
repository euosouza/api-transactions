import fastify from "fastify";
import { env } from "./env/index";

const app = fastify();
const PORT = env.PORT;

app.listen({ port: PORT }).then(() => {
  console.log(`🔥 Servidor está rodando na porta ${PORT}`);
});
