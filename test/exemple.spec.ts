import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";

import { execSync } from "node:child_process";
import request from "supertest";
import { app } from "../src/app";

beforeAll(async () => {
  // Espera a aplicação estar pronta para receber requisições
  await app.ready();
});

afterAll(async () => {
  // Desliga o servidor
  await app.close();
});

beforeEach(async () => {
  // Executar as migrações
  execSync("npm run knex -- migrate:rollback --all");
  execSync("npm run knex -- migrate:latest");
});

describe("Endpoint de transações", () => {
  describe("[POST: /transactions] Criação de transações", () => {
    test("Deve poder criar uma transação", async () => {
      // Ação: Fazer uma requisição HTTP para criar uma transação
      const response = await request(app.server).post("/transactions").send({
        title: "Transaction 1",
        amount: 50,
        type: "credit",
      });

      // Resultado: Verificar se a transação foi criada
      expect(response.statusCode).toBe(201);
    });
  });

  describe("[GET: /transactions] Listagem de transações", () => {
    test("Deve poder listar as transações", async () => {
      // Ação: Fazer uma requisição HTTP para listar as transações
      const responseCreate = await request(app.server).post("/transactions").send({
        title: "Transaction 1",
        amount: 50,
        type: "credit",
      });

      const cookies = responseCreate.headers["set-cookie"];

      const response = await request(app.server).get("/transactions").set({
        Cookie: cookies,
      });

      // Resultado: Verificar se as transações foram listadas
      expect(response.statusCode).toBe(200);
      expect(response.body.transactions).toEqual([
        expect.objectContaining({
          title: "Transaction 1",
          amount: 50,
        }),
      ]);
    });
  });

  describe("[GET: /transactions/:id] Listagem de uma transação", () => {
    test("Deve poder listar uma transação", async () => {
      // Ação: Fazer uma requisição HTTP para listar uma transação
      const responseCreate = await request(app.server).post("/transactions").send({
        title: "Transaction 1",
        amount: 50,
        type: "credit",
      });

      const cookies = responseCreate.headers["set-cookie"];

      const listaTransacoes = await request(app.server).get("/transactions").set({
        Cookie: cookies,
      });

      const id = listaTransacoes.body.transactions[0].id;

      const getTransacao = await request(app.server).get(`/transactions/${id}`).set({
        Cookie: cookies,
      });

      // Resultado: Verificar se a transação foi listada
      expect(getTransacao.statusCode).toBe(200);
      expect(getTransacao.body).toEqual(
        expect.objectContaining({
          id,
          title: "Transaction 1",
          amount: 50,
        }),
      );
    });
  });

  describe("[GET: /transactions/summary] Sumário de transações", () => {
    test("Deve poder listar o sumário de transações", async () => {
      // Ação: Fazer uma requisição HTTP para listar o sumário de transações
      const responseCreate1 = await request(app.server).post("/transactions").send({
        title: "Transaction 1",
        amount: 50,
        type: "credit",
      });

      const cookies = responseCreate1.headers["set-cookie"];

      await request(app.server)
        .post("/transactions")
        .set({
          Cookie: cookies,
        })
        .send({
          title: "Transaction 2",
          amount: 100,
          type: "credit",
        });

      const response = await request(app.server).get("/transactions/summary").set({
        Cookie: cookies,
      });

      // Resultado: Verificar se o sumário foi listado
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          amount: 150,
        }),
      );
    });
  });

  describe("[DELETE: /transactions/:id] Deletar uma transação", () => {
    test("Deve poder deletar uma transação", async () => {
      // Ação: Fazer uma requisição HTTP para deletar uma transação
      const responseCreate = await request(app.server).post("/transactions").send({
        title: "Transaction 1",
        amount: 50,
        type: "credit",
      });

      const cookies = responseCreate.headers["set-cookie"];

      const listaTransacoes = await request(app.server).get("/transactions").set({
        Cookie: cookies,
      });

      const id = listaTransacoes.body.transactions[0].id;

      const response = await request(app.server).delete(`/transactions/${id}`).set({
        Cookie: cookies,
      });

      // Resultado: Verificar se a transação foi deletada
      expect(response.statusCode).toBe(204);

      const listaTransacoesAtualizada = await request(app.server).get("/transactions").set({
        Cookie: cookies,
      });

      expect(listaTransacoesAtualizada.body.transactions.length).toBe(0);
    });
  });

  describe("[PUT: /transactions/:id] Atualizar uma transação", () => {
    test("Deve poder atualizar uma transação", async () => {
      // Ação: Fazer uma requisição HTTP para atualizar uma transação
      const responseCreate = await request(app.server).post("/transactions").send({
        title: "Transaction 1",
        amount: 50,
        type: "credit",
      });

      const cookies = responseCreate.headers["set-cookie"];

      const listaTransacoes = await request(app.server).get("/transactions").set({
        Cookie: cookies,
      });

      const id = listaTransacoes.body.transactions[0].id;

      const response = await request(app.server)
        .put(`/transactions/${id}`)
        .set({
          Cookie: cookies,
        })
        .send({
          title: "Transaction 1 updated",
          amount: 100,
          type: "credit",
        });

      // Resultado: Verificar se a transação foi atualizada
      expect(response.statusCode).toBe(204);

      const listaTransacoesAtualizada = await request(app.server).get("/transactions").set({
        Cookie: cookies,
      });

      expect(listaTransacoesAtualizada.body.transactions[0]).toEqual(
        expect.objectContaining({
          id,
          title: "Transaction 1 updated",
          amount: 100,
        }),
      );
    });
  });
});
