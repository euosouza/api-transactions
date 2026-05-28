import "dotenv/config";
import fastify from "fastify";

const PORT = Number(process.env.PORT ?? 3333);
const app = fastify();

app.listen({ port: PORT }).then(() => {
  console.log(`🔥 Servidor está rodando na porta ${PORT}`);
});
