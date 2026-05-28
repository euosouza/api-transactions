import fastify from "fastify";
import { knex } from "./database.js";

const app = fastify();
const PORT = 3000;

app.get("/", async (req, reply) => {
  const tables = await knex("sqlite_schema").select("*");

  reply.status(200).send({ tables });
});

app.listen({ port: PORT }).then(() => {
  console.log(`🔥 Servidor está rodando na porta ${PORT}`);
});
