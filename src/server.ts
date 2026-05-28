import fastify from "fastify";

const app = fastify();
const PORT = 3000;

app.get("/", (req, reply) => {
  reply.send("Hello World");
});

app.listen({ port: PORT }).then(() => {
  console.log(`🔥 Servidor está rodando na porta ${PORT}`);
});
