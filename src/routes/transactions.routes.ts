import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import z from "zod";
import { knex } from "../database";
import { checkSessionId } from "../middlewares/check-session-id.middleware";

// eslint-disable-next-line @typescript-eslint/require-await
export async function transactionsRoutes(app: FastifyInstance) {
  // Adiciona o middleware checkSessionId a todos os métodos abaixo
  // app.addHook("preHandler", checkSessionId);

  app.get("/", { preHandler: [checkSessionId] }, async (request) => {
    const sessionId = request.cookies.sessionId;

    const transactions = await knex("transactions").select("*").where("session_id", sessionId).orderBy("created_at", "desc");

    return { transactions };
  });

  app.get("/:id", { preHandler: [checkSessionId] }, async (request, reply) => {
    const sessionId = request.cookies.sessionId;

    const transactionsParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = transactionsParamsSchema.parse(request.params);

    const transaction = await knex("transactions").where({ id, session_id: sessionId }).first();

    return reply.status(200).send(transaction);
  });

  app.get("/summary", { preHandler: [checkSessionId] }, async (request, reply) => {
    const sessionId = request.cookies.sessionId;

    const summary = await knex("transactions").where("session_id", sessionId).sum("amount", { as: "amount" }).first();

    return reply.status(200).send({
      amount: parseFloat(Number(summary?.amount ?? 0).toFixed(2)),
    });
  });

  app.post("/", async (request, reply) => {
    const createTransactionsBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionsBodySchema.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });

  app.delete("/:id", async (request, reply) => {
    const deleteTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = deleteTransactionsParamsSchema.parse(request.params);

    await knex("transactions").delete().where({ id });

    return reply.status(204).send();
  });

  app.put("/:id", async (request, reply) => {
    const updateTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const updateTransactionsBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { id } = updateTransactionsParamsSchema.parse(request.params);
    const { title, amount, type } = updateTransactionsBodySchema.parse(request.body);

    await knex("transactions")
      .update({
        title,
        amount: type === "credit" ? amount : amount * -1,
      })
      .where({ id });

    return reply.status(204).send();
  });
}
