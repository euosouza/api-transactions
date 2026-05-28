import setupKnex from "knex";
import type { Knex } from "knex";

export const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./db/db.sqlite",
  },
  migrations: {
    directory: "./db/migrations",
    extension: "ts",
  },
  useNullAsDefault: true,
};

export const knex = setupKnex(config);
