import "dotenv/config";
import type { Knex } from "knex";
import setupKnex from "knex";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: process.env.DATABASE_URL,
  },
  migrations: {
    directory: "./db/migrations",
    extension: "ts",
  },
  useNullAsDefault: true,
};

export const knex = setupKnex(config);
