import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import z from "zod";
import { knex } from "../database";

// eslint-disable-next-line @typescript-eslint/require-await
export async function transactionsRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const transactions = await knex("transactions").select("*");

    return reply.status(200).send(transactions);
  });

  app.get("/:id", async (request, reply) => {
    const transactionsParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = transactionsParamsSchema.parse(request.params);

    const transaction = await knex("transactions").where({ id }).first();

    return reply.status(200).send(transaction);
  });

  app.get("/summary", async (request, reply) => {
    const summary = await knex("transactions").sum("amount", { as: "amount" }).first();

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
